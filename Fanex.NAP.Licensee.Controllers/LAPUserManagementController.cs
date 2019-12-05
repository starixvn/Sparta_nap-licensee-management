namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
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
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
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
        private readonly ILicenseeVendorService _vendorService;
        private readonly ILicenseeSettingService _licenseeService;
        //private readonly double extendedTime = double.Parse(ConfigurationManager.AppSettings["DefaultExtendedTimeOfToken"]);

        public LAPUserManagementController()
        {
            _userService = new LAPUserManagementService();
            _redisService = new RedisService();
            _commonService = new CommonService();
            _licenseeService = new LicenseeSettingService();
            _vendorService = new LicenseeVendorService();
        }

        [HttpGet]
        public ActionResult AddNewUser(string vendorId, string userID)
        {
            var vendorInfo = _vendorService.GetVendorById(vendorId ?? string.Empty);
            var licenseeInfo = _licenseeService.GetLicensee(vendorInfo.SiteName);
            var result = _userService.GetUserInfo(vendorId, userID);

            var viewModel = new AddUserViewModel
            {
                VendorId = vendorInfo.VendorId,
                SiteName = vendorInfo.SiteName,
                UserID = userID,
                IsValid = IsValidRequest(vendorId, userID),
                IsExist = result.UserID != null,
                FuntionPermission = GetFunctionFromConfig(result.VendorInfo.LicenseeType, result.VendorInfo.FunctionIgnore),
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

            var originalPass = SecurityHelper.GeneratePass(criteria.ExtendTime);
            criteria.UpdateLAPUserInfo(originalPass);

            result = _userService.AddUser(criteria);
            if (result.IsSuccess)
            {
                result.Data = originalPass;

                var jobId = CreateBackgroundJob(criteria);
                _redisService.AddValue(criteria.UserPWD, jobId, criteria.ExtendTime);
            }

            return Json(result);
        }

        [HttpGet]
        public ActionResult CreateToken(string vendorId, string userID)
        {
            var isValidRequest = IsValidRequest(vendorId, userID);
            var result = isValidRequest ? _userService.GetUserInfo(vendorId, userID) : null;

            if (result == null || result.UserID == null)
            {
                return RedirectToAction("AddNewUser", "LAPUserManagement", new { vendorId, userID });
            }

            var licenseeInfo = _licenseeService.GetLicensee(result.SiteName);

            var viewModel = new UpdateUserViewModel
            {
                UserInfo = result,
                TimeRemaining = (int)_redisService.GetRemainingTime(result.UserPWD).TotalSeconds,
                IsValid = isValidRequest,
                FuntionPermission = GetFunctionFromConfig(result.VendorInfo.LicenseeType, result.VendorInfo.FunctionIgnore),
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

            var userInfo = _userService.GetUserInfo(criteria.VendorId, criteria.UserID);
            if (userInfo != null)
            {
                RemoveBackgroundJob(userInfo.UserPWD);
                _redisService.RemoveKey(userInfo.UserPWD);

                var originalPass = SecurityHelper.GeneratePass(criteria.ExtendTime);
                criteria.UpdateLAPUserInfo(originalPass);

                result = _userService.UpdateUser(criteria);
                if (result.IsSuccess)
                {
                    result.Data = originalPass;

                    var jobId = CreateBackgroundJob(criteria);
                    _redisService.AddValue(criteria.UserPWD, jobId, criteria.ExtendTime);
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

            return BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromSeconds(criteria.ExtendTime));
        }

        private string CheckValidLAPUser(LAPUserCriteria criteria, bool isAddNew)
        {
            var error = new StringBuilder();
            var userInfo = _userService.GetUserInfo(criteria.VendorId, criteria.UserID);

            error.Append(CheckEmptyParameter("Vendor Id", criteria.VendorId, "<br>"));
            error.Append(CheckEmptyParameter("Request By", criteria.RequestBy, "<br>"));
            error.Append(CheckInvalidRedmineId(criteria.RedmineID, "<br>"));

            if (isAddNew && userInfo.UserID != null)
            {
                error.Append("This username already exists! <br>");
            }

            if (!LAPUserHelper.IsValidUserAccount(criteria.UserID))
            {
                error.Append("This username is invalid! ");
            }

            return error.Length > 0 ? error.ToString() : null;
        }

        private static bool IsValidRequest(string vendorId, string userID)
        {
            return !string.IsNullOrEmpty(vendorId) && LAPUserHelper.IsValidUserAccount(userID);
        }

        private static string GetFunctionFromConfig(int licenseeType, string funcIgnore)
        {
            var filePath = "~/App_Data/FunctionPermission.json";
            var jsonStr = System.IO.File.ReadAllText(HostingEnvironment.MapPath(filePath));
            var functionList = (JArray)JsonConvert.DeserializeObject(jsonStr);

            functionList = FilterFunctionByLicenseeType(functionList, licenseeType);
            functionList = ExcludeFunctionByLicensee(functionList, funcIgnore);

            return JsonConvert.SerializeObject(functionList);
        }

        private static JArray FilterFunctionByLicenseeType(JArray functionList, int licenseeType)
        {
            var removeMode = licenseeType == (int)LicenseeType.API ? (int)SystemMode.OnlyAthena : (int)SystemMode.OnlyAPI;

            functionList.Descendants().OfType<JObject>().Where(x => x.Value<int>("Mode") == removeMode).ToList().ForEach(i => i.Remove());

            return functionList;
        }

        private static JArray ExcludeFunctionByLicensee(JArray functionList, string funcIgnore)
        {
            if (string.IsNullOrEmpty(funcIgnore))
            {
                return functionList;
            }

            var funcIg = JsonConvert.DeserializeObject<IEnumerable<string>>(funcIgnore);

            if (funcIg == null)
            {
                return functionList;
            }

            foreach (var item in funcIg)
            {
                functionList.Descendants().OfType<JObject>().Where(x => x.Value<string>("FunctionKey") == item.ToString()).ToList().ForEach(i => i.Remove());
            }

            return functionList;
        }
    }
}