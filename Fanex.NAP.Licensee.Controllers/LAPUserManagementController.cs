namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Configuration;
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
        private readonly double ExtendedTime = double.Parse(ConfigurationManager.AppSettings["DefaultExtendedTimeOfToken"]);

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

            if (!LAPUserHelper.IsValidUserAccount(criteria.UserID))
            {
                result.Error = "This account is invalid";

                return Json(result);
            }

            var originalPass = SecurityHelper.GeneratePass(ExtendedTime);
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);
            criteria.UpdateUserLoginInfo();

            result = _userService.AddUser(criteria);
            if (result.IsSuccess)
            {
                result.Data = originalPass;

                var jobId = CreateBackgroundJob(criteria);
                _redisService.AddValue(criteria.UserPWD, jobId, ExtendedTime);
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

            if (!LAPUserHelper.IsValidUserAccount(criteria.UserID))
            {
                result.Error = "This account is invalid";

                return Json(result);
            }

            var userInfo = _userService.GetUserInfo(criteria.SiteName, criteria.UserID);
            if (userInfo != null)
            {
                RemoveBackgroundJob(userInfo.UserPWD);
                _redisService.RemoveKey(userInfo.UserPWD);

                var originalPass = SecurityHelper.GeneratePass(ExtendedTime);
                criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);
                criteria.UpdateUserLoginInfo();

                result = _userService.UpdateUserPassword(criteria);
                if (result.IsSuccess)
                {
                    result.Data = originalPass;

                    var jobId = CreateBackgroundJob(criteria);
                    _redisService.AddValue(criteria.UserPWD, jobId, ExtendedTime);
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
            return BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromMinutes(ExtendedTime));
        }
    }
}