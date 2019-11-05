namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Configuration;
    using System.Web.Mvc;
    using Attributes;
    using Hangfire;
    using Model.Criteria.LAPUser;
    using Model.DTO;
    using Model.Enumerations;
    using Model.ViewModel.LAPUser;
    using Service;
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
            if (userID == LAPAccount.ITSupport || userID == LAPAccount.ITSupport2)
            {
                ViewBag.SiteName = siteName;
                ViewBag.UserID = userID;

                return View();
            }

            return RedirectToAction("Index", "LicenseeVendor");
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult AddNewUser(LAPUserCriteria criteria)
        {
            var originalPass = SecurityHelper.GeneratePass(ExtendedTime);
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

            var result = _userService.AddUser(criteria);
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
                TimeRemaining = (int)_redisService.GetRemainingTime(result.UserPWD).TotalSeconds
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

            var userInfo = _userService.GetUserInfo(criteria.SiteName, criteria.UserID);
            if (userInfo != null)
            {
                RemoveBackgroundJob(userInfo.UserPWD);
                _redisService.RemoveKey(userInfo.UserPWD);

                var originalPass = SecurityHelper.GeneratePass(ExtendedTime);
                criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

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