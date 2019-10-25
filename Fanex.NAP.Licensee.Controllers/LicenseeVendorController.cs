namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Configuration;
    using System.Linq;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using IBCCrypt;
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
            const int defaulHour = 8; 
            ViewBag.SiteName = siteName;
            ViewBag.UserID = userID;
            ViewBag.UserPWD = GeneratePass(defaulHour);

            return View();
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult AddNewUser(VendorUserCriteria criteria)
        {
            var encryptPass = EncryptPass(criteria.UserPWD);
            var result = new ResultData<int>
            {
                IsSuccess = false
            };

            if (_redisService.AddValue(encryptPass, criteria.UserPWD))
            {
                criteria.UserPWD = encryptPass;
                result = _vendorService.AddUser(criteria);
            }

            return Json(result);
        }

        [HttpGet]
        public ActionResult CreateToken(string siteName, string userID)
        {
            var result = _vendorService.GetUserBySiteNameAndUserID(siteName, userID);
            if (result == null)
            {
                return RedirectToAction("AddNewUser", "LicenseeVendor", new { siteName, userID });
            }

            var viewModel = new UpdateUserPWViewModel
            {
                UserInfo = result,
                TimeRemaining = _redisService.GetRemainingTime(result.UserPWD).TotalSeconds
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult CreateToken(VendorUserCriteria criteria, int extendTime = 8)
        {
            _redisService.RemoveKey(criteria.UserPWD);

            var originalPass = GeneratePass(extendTime);
            criteria.UserPWD = EncryptPass(originalPass);

            var result = _vendorService.UpdateUserPWA(criteria);
            if (result.IsSuccess)
            {
                result.Data = originalPass;
            }

            _redisService.AddValue(criteria.UserPWD, originalPass, extendTime);

            return Json(result);
        }

        private string GeneratePass(int extendTime)
        {
            Random random = new Random();
            var randomString = "!@#$%&=1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ";

            var userPWD = extendTime.ToString("00");
            userPWD += string.Concat(Enumerable.Repeat(randomString, 5).Select(s => s[random.Next(s.Length)]).ToArray());
            userPWD += DateTime.Now.ToString("ddMMyyHH");

            return userPWD;
        }

        private string EncryptPass(string pass)
        {
            var UserPasswordKey = ConfigurationManager.AppSettings["UserPasswordKey"];
            var encryptPass = IBCCrypt.GenMD5Key(pass, UserPasswordKey);

            return encryptPass;
        }
    }
}