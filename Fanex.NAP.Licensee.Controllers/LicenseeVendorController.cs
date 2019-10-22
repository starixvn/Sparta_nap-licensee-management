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

    [NapSuperAuth]
    [CheckUMFilter]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLicenseeVendor, Policy = Constant.Policy.Read)]
    [CustomValidateAntiForgery]
    public class LicenseeVendorController : BaseController
    {
        private readonly ILicenseeVendorService _vendorService;

        public LicenseeVendorController()
        {
            _vendorService = new LicenseeVendorService();
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
        public ActionResult CreateToken(string siteName, string userID)
        {
            var result = _vendorService.GetUserBySiteNameAndUserID(siteName, userID);
            if(result == null)
            {
                return RedirectToAction("AddNewUser", "LicenseeVendor", new { siteName, userID });
            }

            return View(result);
        }

        [HttpGet]
        public ActionResult AddNewUser(string siteName, string userID)
        {
            ViewBag.SiteName = siteName;
            ViewBag.UserID = userID;
            ViewBag.UserPWD = GeneratePass(8);

            return View();
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult AddNewUser(VendorUserCriteria criteria)
        {
            criteria.UserPWD = EncryptPass(criteria.UserPWD);
            var result = _vendorService.AddUser(criteria); 

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult CreateToken(VendorUserCriteria criteria, int extendTime)
        {
            var temp = criteria.UserPWD = GeneratePass(extendTime);
            criteria.UserPWD = EncryptPass(criteria.UserPWD);

            var result = _vendorService.UpdateUserPWA(criteria);

            if (result.IsSuccess)
            {
                result.Data = temp;
            }

            return Json(result);
        }

        private string GeneratePass(int extendTime)
        {
            Random random = new Random();
            var randomString = "!@#$%&=1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ";

            var UserPWD = extendTime.ToString("00");
            UserPWD += string.Concat(Enumerable.Repeat(randomString, 5).Select(s => s[random.Next(s.Length)]).ToArray());
            UserPWD += DateTime.Now.ToString("ddMMyyhh");

            return UserPWD;
        }

        private string EncryptPass(string pass)
        {
            var UserPasswordKey = ConfigurationManager.AppSettings["UserPasswordKey"];
            var encryptPass = IBCCrypt.GenMD5Key(pass, UserPasswordKey);

            return encryptPass;
        }
    }
}