namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Linq;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Hangfire;
    using Model.Criteria.Vendor;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.LicenseeVendor;
    using ONEbook.UM.Filters;
    using Service;
    using Service.Redis;

    [NapSuperAuth]
    [CheckUMFilter]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLicenseeVendor, Policy = Constant.Policy.Read)]
    [CustomValidateAntiForgery]
    public class LicenseeVendorController : BaseController
    {
        private readonly ILicenseeVendorService _vendorService;
        private readonly IRedisService _redisService;
        private const double ExtendedTime = 15;

        public LicenseeVendorController()
        {
            _vendorService = new LicenseeVendorService();
            _redisService = new RedisService();
        }

        [HttpGet]
        public ActionResult Index()
        {
            var functionKeyList = _vendorService.GetFunctionKeyList();
            return View(functionKeyList);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult GetVendorInfoList(VendorSearchingCriteria criteria)
        {
            return Json(_vendorService.GetVendorList(criteria));
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult Edit(string vendorId)
        {
            var vendor = _vendorService.GetVendorById(vendorId);

            if (vendor != null)
            {
                var functionKeyList = _vendorService.GetFunctionKeyList();
                var renderingFunctionKeyList = vendor.ExclusionList != null ? functionKeyList.Union(vendor.ExclusionList) : functionKeyList;

                var viewModel = new EditVendorViewModel
                {
                    VendorInfo = vendor,
                    FunctionKeyList = renderingFunctionKeyList
                };

                return View(viewModel);
            }

            var emptyResult = new EditVendorViewModel
            {
                VendorInfo = new LicenseeVendor(),
                FunctionKeyList = Enumerable.Empty<string>()
            };

            return View(emptyResult);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult Edit(LicenseeVendor vendor)
        {
            var result = _vendorService.UpdateVendor(vendor);

            return Json(result);
        }

        [HttpGet]
        public ActionResult AddNewUser(string siteName, string userID)
        {
            const double defaulHour = 8;
            ViewBag.SiteName = siteName;
            ViewBag.UserID = userID;
            ViewBag.UserPWD = SecurityHelper.GeneratePass(defaulHour);

            return View();
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult AddNewUser(LAPUserCriteria criteria, double extendTime = ExtendedTime)
        {
            var encryptPass = SecurityHelper.EncryptPass(criteria.UserPWD);
            var result = new ResultData<int>
            {
                IsSuccess = false
            };

            if (_redisService.AddValue(encryptPass, criteria.UserPWD, extendTime))
            {
                criteria.UserPWD = encryptPass;
                result = _vendorService.AddUser(criteria);

                BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromMinutes(extendTime));
            }

            return Json(result);
        }

        [HttpGet]
        public ActionResult CreateToken(string siteName, string userID)
        {
            var result = _vendorService.GetUserInfo(siteName, userID);
            if (result == null)
            {
                return RedirectToAction("AddNewUser", "LicenseeVendor", new { siteName, userID });
            }

            var viewModel = new UpdateUserPWViewModel
            {
                UserInfo = result,
                TimeRemaining = (int)_redisService.GetRemainingTime(result.UserPWD).TotalSeconds
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult CreateToken(LAPUserCriteria criteria, double extendTime = ExtendedTime)
        {
            _redisService.RemoveKey(criteria.UserPWD);

            var originalPass = SecurityHelper.GeneratePass(extendTime);
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

            var result = _vendorService.UpdateUserPassword(criteria);
            if (result.IsSuccess)
            {
                result.Data = originalPass;

                BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromMinutes(extendTime));
            }

            _redisService.AddValue(criteria.UserPWD, originalPass, extendTime);

            return Json(result);
        }

        public void UpdatePassExpried(LAPUserCriteria criteria)
        {
            var originalPass = SecurityHelper.GeneratePass(0);
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

            _vendorService.UpdateUserPassword(criteria, true);
        }
    }
}