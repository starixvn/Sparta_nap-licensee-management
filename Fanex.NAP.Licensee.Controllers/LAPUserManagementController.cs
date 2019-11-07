namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Configuration;
    using System.Text;
    using System.Web.Mvc;
    using Attributes;
    using Hangfire;
    using Model.Criteria.LAPUser;
    using Model.DTO;
    using Model.ViewModel.LAPUser;
    using Service;
    using Service.Helpers;
    using Service.Redis;

    public class LAPUserManagementController : BaseController
    {
        private readonly ILAPUserManagementService _userService;
        private readonly IRedisService _redisService;
        private readonly double extendedTime = double.Parse(ConfigurationManager.AppSettings["DefaultExtendedTimeOfToken"]);

        public LAPUserManagementController()
        {
            _userService = new LAPUserManagementService();
            _redisService = new RedisService();
        }

        [HttpGet]
        public ActionResult AddNewUser(string siteName, string userID)
        {
            var viewModel = new AddUserViewModel
            {
                SiteName = siteName,
                UserID = userID,
                IsValid = LAPUserHelper.IsValidUserAccount(userID),
                IsExist = _userService.GetUserInfo(siteName, userID) != null
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult AddNewUser(LAPUserCriteria criteria)
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

            var originalPass = SecurityHelper.GeneratePass(extendedTime);
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);
            criteria.UpdateUserLoginInfo();

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
        public ActionResult CreateToken(string siteName, string userID)
        {
            var result = _userService.GetUserInfo(siteName, userID);
            if (result == null)
            {
                return RedirectToAction("AddNewUser", "LAPUserManagement", new { siteName, userID });
            }

            var viewModel = new UpdateUserPWViewModel
            {
                UserInfo = result,
                TimeRemaining = (int)_redisService.GetRemainingTime(result.UserPWD).TotalSeconds,
                IsValid = LAPUserHelper.IsValidUserAccount(userID)
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult CreateToken(LAPUserCriteria criteria)
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

            var userInfo = _userService.GetUserInfo(criteria.SiteName, criteria.UserID);
            if (userInfo != null)
            {
                RemoveBackgroundJob(userInfo.UserPWD);
                _redisService.RemoveKey(userInfo.UserPWD);

                var originalPass = SecurityHelper.GeneratePass(extendedTime);
                criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);
                criteria.UpdateUserLoginInfo();

                result = _userService.UpdateUserPassword(criteria);
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
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

            _userService.UpdateUserPassword(criteria, true);
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
            return BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromMinutes(extendedTime));
        }

        private string CheckValidLAPUser(LAPUserCriteria criteria, bool isUpdate)
        {
            var error = new StringBuilder();

            error.Append(CheckEmptyParameter("Site Name", criteria.SiteName, "<br>"));

            if (isUpdate)
            {
                error.Append(CheckEmptyParameter("Request By", criteria.RequestBy, "<br>"));
                error.Append(CheckInvalidRedmineId(criteria.RedmineID, "<br>"));
            }

            if (!LAPUserHelper.IsValidUserAccount(criteria.UserID))
            {
                error.Append("This user account is invalid");
            }

            return error.Length > 0 ? error.ToString() : null;
        }
    }
}