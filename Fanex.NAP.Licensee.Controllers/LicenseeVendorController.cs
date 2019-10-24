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
            criteria.UserPWD = EncryptPass(criteria.UserPWD);
            var result = _vendorService.AddUser(criteria); 

            return Json(result);
        }

        [HttpGet]
        public ActionResult CreateToken(string siteName, string userID)
        {
            var testStringDateTime = "12abcde23101908";
            var result = _vendorService.GetUserBySiteNameAndUserID(siteName, userID);
            if (result == null)
            {
                return RedirectToAction("AddNewUser", "LicenseeVendor", new { siteName, userID });
            }

            var timeRemaning = (int)(GetExpriedDateFormPass(testStringDateTime) - DateTime.Now).TotalHours;
            var viewModel = new UpdateUserPWViewModel
            {
                UserInfo = result,
                TimeRemaining = (timeRemaning < 0) ? 0 : timeRemaning
            };

            return View(viewModel);
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

        private DateTime GetExpriedDateFormPass(string pass)
        {
            var createdDate = Int32.Parse(pass.Substring(7, 2));
            var createdMonth = Int32.Parse(pass.Substring(9, 2));
            var createdYear = Int32.Parse("20" + pass.Substring(11, 2));
            var createdHour = Int32.Parse(pass.Substring(13, 2));
            var extraHour = Int32.Parse(pass.Substring(0, 2));

            return new DateTime(createdYear, createdMonth, createdDate, createdHour, 0, 0).AddHours(extraHour);
        }
    }
}