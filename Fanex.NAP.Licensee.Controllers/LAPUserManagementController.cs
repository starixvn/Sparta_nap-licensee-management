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
            ViewBag.SiteName = siteName;
            ViewBag.UserID = userID;
            ViewBag.UserPWD = SecurityHelper.GeneratePass(ExtendedTime);

            return View();
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult AddNewUser(LAPUserCriteria criteria)
        {
            criteria.UserPWD = SecurityHelper.EncryptPass(criteria.UserPWD);

            var result = _userService.AddUser(criteria);
            if (result.IsSuccess)
            {
                CreateBackgroundJob(criteria);
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

            if (RemoveBackgroundJob(criteria.UserPWD))
            {
                var originalPass = SecurityHelper.GeneratePass(ExtendedTime);
                criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

                result = _userService.UpdateUserPassword(criteria);
                if (result.IsSuccess)
                {
                    result.Data = originalPass;
                    CreateBackgroundJob(criteria);
                }
            }

            return Json(new { result, encryptPass = criteria.UserPWD });
        }

        public void UpdatePassExpried(LAPUserCriteria criteria)
        {
            var originalPass = SecurityHelper.GeneratePass(0);
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);

            _userService.UpdateUserPassword(criteria, true);
        }

        private bool RemoveBackgroundJob(string key)
        {
            var jobId = _redisService.GetValue(key);
            if (jobId != null)
            {
                return BackgroundJob.Delete(jobId) && _redisService.RemoveKey(key);
            }

            return true;
        }

        private void CreateBackgroundJob(LAPUserCriteria criteria)
        {
            var jobId = BackgroundJob.Schedule(() => UpdatePassExpried(criteria), TimeSpan.FromMinutes(ExtendedTime));
            _redisService.AddValue(criteria.UserPWD, jobId, ExtendedTime);
        }
    }
}