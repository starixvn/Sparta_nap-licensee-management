namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Text;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Hangfire;
    using Model.Criteria.LAPUser;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.LAPUser;
    using ONEbook.UM.Filters;
    using Service;
    using Service.Helpers;
    using Service.Redis;

    [NapSuperAuth]
    [CheckUMFilter]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLicenseeVendor, Policy = Constant.Policy.Read)]
    [CustomValidateAntiForgery]
    public class LAPUserManagementController : BaseController
    {
        private readonly ILAPUserManagementService _userService;
        private readonly IRedisService _redisService;
        private readonly ICommonService _commonService;
        private readonly ILicenseeSettingService _licenseeService;
        private readonly double extendedTime = double.Parse(ConfigurationManager.AppSettings["DefaultExtendedTimeOfToken"]);

        public LAPUserManagementController()
        {
            _userService = new LAPUserManagementService();
            _redisService = new RedisService();
            _commonService = new CommonService();
            _licenseeService = new LicenseeSettingService();
        }

        [HttpGet]
        public ActionResult AddNewUser(string vendorId, string siteName, string userID)
        {
            var licenseeInfo = _licenseeService.GetLicensee(siteName);
            var result = _userService.GetUserInfo(vendorId, siteName, userID);

            var viewModel = new AddUserViewModel
            {
                SiteName = siteName,
                UserID = userID,
                IsValid = CheckParamRequest(vendorId, siteName, userID),
                FuntionIgnore = result.FunctionIgnore,
                IsExist = !string.IsNullOrEmpty(result.UserID),
                FuntionPermission = GetFunctionPermissionFileContent(),
                Currency = licenseeInfo != null ? _commonService.GetLicenseeCurrencyList(licenseeInfo.LicenseeID) : new List<CurrencyItem>()
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult AddNewUser(LAPUserCriteria criteria)
        {
            var result = new ResultData<string>
            {
                IsSuccess = false
            };

            var error = CheckValidLAPUser(criteria, true);
            if (error != null)
            {
                result.Error = error;

                return Json(result);
            }

            var originalPass = SecurityHelper.GeneratePass(extendedTime);
            criteria.UpdateLAPUserInfo(originalPass);

            result = _userService.AddUser(criteria);
            if (result.IsSuccess)
            {
                result.Data = originalPass;

                var jobId = CreateBackgroundJob(criteria);
                _redisService.AddValue(criteria.UserPWD, jobId, extendedTime);
            }

            return Json(result);
        }

        [HttpGet]
        public ActionResult CreateToken(string vendorId, string siteName, string userID)
        {
            var result = _userService.GetUserInfo(vendorId, siteName, userID);

            if (string.IsNullOrEmpty(result.UserID) && string.IsNullOrEmpty(result.SiteName))
            {
                return RedirectToAction("AddNewUser", "LAPUserManagement", new { vendorId, siteName, userID });
            }

            var licenseeInfo = _licenseeService.GetLicensee(siteName);

            var viewModel = new UpdateUserViewModel
            {
                UserInfo = result,
                TimeRemaining = (int)_redisService.GetRemainingTime(result.UserPWD).TotalSeconds,
                IsValid = CheckParamRequest(vendorId, siteName, userID),
                FuntionPermission = GetFunctionPermissionFileContent(),
                Currency = licenseeInfo != null ? _commonService.GetLicenseeCurrencyList(licenseeInfo.LicenseeID) : new List<CurrencyItem>(),
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult CreateToken(LAPUserCriteria criteria)
        {
            var result = new ResultData<string>
            {
                IsSuccess = false
            };

            var error = CheckValidLAPUser(criteria, false);
            if (error != null)
            {
                result.Error = error;

                return Json(result);
            }

            var userInfo = _userService.GetUserInfo(criteria.VendorId, criteria.SiteName, criteria.UserID);
            if (userInfo != null)
            {
                RemoveBackgroundJob(userInfo.UserPWD);
                _redisService.RemoveKey(userInfo.UserPWD);

                var originalPass = SecurityHelper.GeneratePass(extendedTime);
                criteria.UpdateLAPUserInfo(originalPass);

                result = _userService.UpdateUser(criteria);
                if (result.IsSuccess)
                {
                    result.Data = originalPass;

                    var jobId = CreateBackgroundJob(criteria);
                    _redisService.AddValue(criteria.UserPWD, jobId, extendedTime);
                }
            }

            return Json(result);
        }

        public void UpdatePassExpried(LAPUserCriteria criteria)
        {
            var originalPass = SecurityHelper.GeneratePass(0);
            criteria.UpdatePassword(originalPass);

            _userService.UpdateUser(criteria);
        }

        private void RemoveBackgroundJob(string key)
        {
            var jobId = _redisService.GetValue(key);
            if (jobId != null)
            {
                BackgroundJob.Delete(jobId);
            }
        }

        private string CreateBackgroundJob(LAPUserCriteria criteria)
        {
            criteria.RemoveUnusefulInfoForBackgroundJob();

            return BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromHours(extendedTime));
        }

        private string CheckValidLAPUser(LAPUserCriteria criteria, bool isAddNew)
        {
            var error = new StringBuilder();
            var userInfo = _userService.GetUserInfo(criteria.VendorId, criteria.SiteName, criteria.UserID);

            error.Append(CheckEmptyParameter("Site Name", criteria.SiteName, "<br>"));
            error.Append(CheckEmptyParameter("Request By", criteria.RequestBy, "<br>"));
            error.Append(CheckInvalidRedmineId(criteria.RedmineID, "<br>"));

            if (isAddNew && !string.IsNullOrEmpty(userInfo.UserID))
            {
                error.Append("This username already exists! <br>");
            }

            if (!LAPUserHelper.IsValidUserAccount(criteria.UserID))
            {
                error.Append("This username is invalid! ");
            }

            return error.Length > 0 ? error.ToString() : null;
        }

        private bool CheckParamRequest(string vendorId, string siteName, string userID)
        {
            var error = new StringBuilder();

            error.Append(CheckEmptyParameter("Site Name", siteName, "<br>"));
            error.Append(CheckEmptyParameter("Vendor Id", vendorId, "<br>"));

            if (!LAPUserHelper.IsValidUserAccount(userID))
            {
                error.Append("This username is invalid! ");
            }

            return error.Length == 0;
        }

        private string GetFunctionPermissionFileContent()
        {
            var filePath = "~/App_Data/FunctionPermission.json";
            var jsonStr = System.IO.File.ReadAllText(HostingEnvironment.MapPath(filePath));

            return jsonStr;
        }
    }
}