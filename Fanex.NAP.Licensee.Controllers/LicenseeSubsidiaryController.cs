using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Fanex.Logging;
using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Fanex.NAP.Licensee.Controllers.Attributes;
using Fanex.NAP.Licensee.Extension;
using Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting;
using Fanex.NAP.Licensee.Model.Criteria.Subsidiary;
using Fanex.NAP.Licensee.Model.DataDomain;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.DTO.Subsidiary;
using Fanex.NAP.Licensee.Model.Request;
using Fanex.NAP.Licensee.Service;
using Fanex.NAP.Licensee.Service.ShardDb;
using ONEbook.UM.AspNetMVC.Filters;
using static System.String;

namespace Fanex.NAP.Licensee.Controllers
{
    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    [CustomValidateAntiForgery]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.CreateLicenseeSubsidiaries, Policy = Constant.Policy.Host)]
    public class LicenseeSubsidiaryController : BaseController
    {
        private readonly ICommonService _commonService;
        private readonly ILicenseeSettingService _licenseeSettingService;
        private readonly ILicenseeSubsidiaryService _licenseeSubsidiaryService;

        public LicenseeSubsidiaryController()
        {
            _commonService = new CommonService();
            _licenseeSubsidiaryService = new LicenseeSubsidiaryService();
            _licenseeSettingService = new LicenseeSettingService();
        }

        [HttpGet]
        public ActionResult Add()
        {
            return View();
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult GetLicensees()
        {
            var result = _licenseeSubsidiaryService.GetLicenseeList(new LicenseeListCriteria());

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        public JsonResult GetCurrencies(string siteName)
        {
            var result = _commonService.GetSuperLicenseeList(siteName);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        public JsonResult GetSourceAgent(int customerId)
        {
            var criteria = new SourceAgentCriteria
            {
                Id = customerId
            };

            var result = _licenseeSubsidiaryService.GetSourceAgent(criteria);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        public JsonResult GenerateSubUsername(string sourceAgency, int quantity)
        {
            var criteria = new GenerateSubUserNameCriteria
            {
                Quantity = quantity,
                Username = sourceAgency
            };

            var result = _licenseeSubsidiaryService.GenerateSubUserName(criteria);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult CreateSubsidiaries(CreateSubsidiariesReq request)
        {
            ConfigSiteIp(request.CustomerId);

            var result = new CreateSubsidiariesRes();

            var createdAccounts = CreateAccounts(request.Usernames, request.SourceAgency);
            result.Subsidiaries = createdAccounts;

            if (!createdAccounts.Exists(createdAccount => createdAccount.IsSuccess))
            {
                return Json(result);
            }

            var failedStep = RemoveExcessive(request.SiteName, request.ExchangeId);
            result.FailedStep = failedStep;

            return Json(result);
        }

        private void ConfigSiteIp(int customerId)
        {
            var siteDbCriteria = new GetSiteDbConfigCriteria
            {
                CustId = customerId
            };
            var siteDb = _licenseeSubsidiaryService.GetSiteDb(siteDbCriteria);
            Request.Headers.Add(ShardInfoAccessor.SiteDbServer, siteDb.AgIp);
        }

        private List<ResultData<SubsidiaryAccount>> CreateAccounts(string[] usernames, string sourceAgency)
        {
            return usernames.Select(username => new CreateLicenseeSubsidiaryCriteria
            {
                Username = username,
                ExistedUsername = sourceAgency,
                UserId = CurrentSession.UserId,
                UserIp = CurrentContext.IP
            }).Select(CreateAccount).ToList();
        }

        private ResultData<SubsidiaryAccount> CreateAccount(CreateLicenseeSubsidiaryCriteria criteria)
        {
            try
            {
                var subsidiary = _licenseeSubsidiaryService.CreateLicenseeSubsidiary(criteria);

                if (subsidiary.Data.BalanceCustomerList != null)
                {
                    _licenseeSubsidiaryService.CheckCustList(subsidiary.Data.BalanceCustomerList);
                }

                return subsidiary;
            }
            catch (Exception exception)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);

                var account = new SubsidiaryAccount
                {
                    Username = criteria.Username
                };

                return new ResultData<SubsidiaryAccount>
                {
                    Data = account,
                    Error = exception.ToString(),
                    IsSuccess = false
                };
            }
        }

        private string RemoveExcessive(string siteName, int exchangeId)
        {
            if (!AddAgencySuccess(siteName, exchangeId))
            {
                return CreateSubsidiariesError.AddToLicenseeFailed.ToString();
            }

            if (!ExcludePermissionSuccess(siteName))
            {
                return CreateSubsidiariesError.ExcludePermissionFailed.ToString();
            }

            return null;
        }

        private bool AddAgencySuccess(string siteName, int exchangeId)
        {
            try
            {
                var result = AddAgency(siteName, exchangeId);
                return result.IsOk;
            }
            catch (Exception exception)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);
                return false;
            }
        }

        private ResultInfo AddAgency(string siteName, int exchangeId)
        {
            var licenseeAgentCriteria = new LicenseeAgentCriteria
            {
                LicenseeName = siteName,
                SuperWildCard = LicenseeAgentCriteria.ToWildCard(siteName),
                Currency = exchangeId
            };
            var addAgentResult = _licenseeSettingService.AddAgent(licenseeAgentCriteria);

            return new ResultInfo
            {
                IsOk = IsNullOrWhiteSpace(addAgentResult.Error),
                Message = addAgentResult.Error
            };
        }

        private bool ExcludePermissionSuccess(string siteName)
        {
            try
            {
                var result = ExcludePermission(siteName);
                return result.IsOk;
            }
            catch (Exception exception)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);
                return false;
            }
        }

        private ResultInfo ExcludePermission(string siteName)
        {
            var exclusionsPermissionCommand = new ExclusionsPermissionCommand(siteName);
            return _licenseeSubsidiaryService.ExclusionsPermission(exclusionsPermissionCommand);
        }
    }
}
