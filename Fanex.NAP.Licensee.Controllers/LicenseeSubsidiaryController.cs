using static System.String;

namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Extension;
    using Logging;
    using Model.Criteria.LicenseeSetting;
    using Model.Criteria.Subsidiary;
    using Model.DataDomain;
    using Model.DTO;
    using Model.DTO.Subsidiary;
    using Model.Request;
    using ONEbook.UM.AspNetMVC.Filters;
    using Service;
    using Service.ShardDb;

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
            var shardDbConfig = _licenseeSubsidiaryService.GetShardDbConfig(new GetShardDbConfigCriteria { Username = request.SourceAgency });

            SetupDbServerConfig(shardDbConfig);

            var result = new CreateSubsidiariesRes();

            var createdAccounts = CreateAccounts(request, shardDbConfig);
            result.Subsidiaries = createdAccounts;

            if (!createdAccounts.Exists(createdAccount => createdAccount.IsSuccess))
            {
                return Json(result);
            }

            var failedStep = RemoveExcessive(request.SiteName, request.ExchangeId);
            result.FailedStep = failedStep;

            return Json(result);
        }

        private void SetupDbServerConfig(ShardDbConfig shardDbConfig)
        {
            Request.Headers.Add(ShardInfoAccessor.SiteDbServer, shardDbConfig.SiteDbServer);
            Request.Headers.Add(ShardInfoAccessor.CustDbServer, shardDbConfig.CustDbServer);
        }

        private List<ResultData<SubsidiaryAccount>> CreateAccounts(CreateSubsidiariesReq request, ShardDbConfig shardDbConfig)
        {
            var criteriaStep1 = new CheckExistedAccountCriteria
            {
                Username = request.SourceAgency
            };

            var resultStep1 = CheckExistedAccount(criteriaStep1);

            if (!resultStep1.IsSuccess)
            {
                return request.Usernames.Select(username => CreateFailedResult(username, resultStep1.Error)).ToList();
            }

            return request.Usernames.Select(username =>
            {
                var criteriaStep2 = new RegisterCustomerCriteria
                {
                    Username = username,
                    UpLineId = resultStep1.Data.MRecommend,
                    Site = shardDbConfig.Site,
                    SiteDbGroupId = shardDbConfig.CustDbGroupId
                };

                var resultStep2 = RegisterCustomer(criteriaStep2);

                if (!resultStep2.IsSuccess)
                {
                    return CreateFailedResult(username, resultStep2.Error);
                }

                var criteriaStep3 = new CreateLicenseeSubsidiaryCriteria
                {
                    Username = username,
                    CustId = resultStep2.Data,
                    ExistedUsername = request.SourceAgency,
                    MRecommend = resultStep1.Data.MRecommend,
                    ExistedCustId = resultStep1.Data.CustId,
                    UserId = CurrentSession.UserId,
                    UserIp = CurrentContext.IP
                };

                var resultStep3 = CreateSubsidiaryAccount(criteriaStep3);

                if (!resultStep3.IsSuccess)
                {
                    RollbackCreateAccount(new RollbackCreateSubsidiaryCommand { CustId = resultStep2.Data });
                }

                return resultStep3;
            }).ToList();
        }

        private static ResultData<SubsidiaryAccount> CreateFailedResult(string username, string error)
        {
            var account = new SubsidiaryAccount
            {
                Username = username
            };

            return new ResultData<SubsidiaryAccount>
            {
                Data = account,
                Error = error,
                IsSuccess = false
            };
        }

        private ResultData<AccountInfo> CheckExistedAccount(CheckExistedAccountCriteria criteria)
        {
            try
            {
                var accountInfo = _licenseeSubsidiaryService.CheckExistedAccount(criteria);

                return new ResultData<AccountInfo>
                {
                    Error = Empty,
                    IsSuccess = true,
                    Data = accountInfo
                };
            }
            catch (Exception exception)
            {
                LogService.Critical(LogMessageHelper.GenerateMessage(exception), exception);

                return new ResultData<AccountInfo>
                {
                    Data = null,
                    Error = exception.ToString(),
                    IsSuccess = false
                };
            }
        }

        private ResultData<int> RegisterCustomer(RegisterCustomerCriteria criteria)
        {
            try
            {
                var registerCustomer = _licenseeSubsidiaryService.RegisterCustomer(criteria);

                return registerCustomer;
            }
            catch (Exception exception)
            {
                LogService.Critical(LogMessageHelper.GenerateMessage(exception), exception);

                return new ResultData<int>
                {
                    Data = 0,
                    Error = exception.ToString(),
                    IsSuccess = false
                };
            }
        }

        private void RollbackCreateAccount(RollbackCreateSubsidiaryCommand command)
        {
            try
            {
                _licenseeSubsidiaryService.RollbackCreateSubsidiary(command);
            }
            catch (Exception exception)
            {
                LogService.Critical(LogMessageHelper.GenerateMessage(exception), exception);
            }
        }

        private ResultData<SubsidiaryAccount> CreateSubsidiaryAccount(CreateLicenseeSubsidiaryCriteria criteria)
        {
            try
            {
                var subsidiary = _licenseeSubsidiaryService.CreateLicenseeSubsidiary(criteria);

                return subsidiary;
            }
            catch (Exception exception)
            {
                LogService.Critical(LogMessageHelper.GenerateMessage(exception), exception);

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
                var (result, licenseeIdAffected) = AddAgency(siteName, exchangeId);

                if (licenseeIdAffected == 0)
                {
                    return result.IsOk;
                }

                var insertLimit = InsertCompanyWinLimit(licenseeIdAffected);

                if (!insertLimit.IsOk)
                {
                    LogService.Critical($"Insert Company Win Limit has errors: {insertLimit.Message}");
                }

                return insertLimit.IsOk;
            }
            catch (Exception exception)
            {
                LogService.Critical(LogMessageHelper.GenerateMessage(exception), exception);
                return false;
            }
        }

        private (ResultInfo result, int licenseeIdAffected) AddAgency(string siteName, int exchangeId)
        {
            var licenseeAgentCriteria = new LicenseeAgentCriteria
            {
                LicenseeName = siteName,
                SuperWildCard = LicenseeAgentCriteria.ToWildCard(siteName),
                Currency = exchangeId
            };
            var addAgentResult = _licenseeSettingService.AddAgent(licenseeAgentCriteria);
            var result = new ResultInfo
            {
                IsOk = IsNullOrWhiteSpace(addAgentResult.Error),
                Message = addAgentResult.Error
            };

            return (result, addAgentResult.Data.LicenseeIdAffected);
        }

        private ResultInfo InsertCompanyWinLimit(int licenseeId)
        {
            var command = new InsertCompanyWinLimitCommand(licenseeId);
            return _licenseeSubsidiaryService.InsertCompanyWinLimit(command);
        }

        private bool ExcludePermissionSuccess(string siteName)
        {
            try
            {
                var result = ExcludePermission(siteName);

                if (!result.IsOk)
                {
                    LogService.Critical($"Exclude Permission Success has errors: {result.Message}");
                }

                return result.IsOk;
            }
            catch (Exception exception)
            {
                LogService.Critical(LogMessageHelper.GenerateMessage(exception), exception);
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