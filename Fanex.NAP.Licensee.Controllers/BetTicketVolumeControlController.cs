using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Fanex.NAP.Licensee.Controllers.Attributes;
using Fanex.NAP.Licensee.Model.Criteria.BetTicketVolumeControlSetting;
using Fanex.NAP.Licensee.Model.DataDomain;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.ViewModel.BetTicketVolumeControl;
using Fanex.NAP.Licensee.Service;
using ONEbook.UM.Filters;
using System.Collections.Generic;
using System.Text;
using System.Web.Mvc;

namespace Fanex.NAP.Licensee.Controllers
{
    [NapSuperAuth]
    [CustomHandleError]
    [CheckUMFilter]
    public class BetTicketVolumeControlController : BaseController
    {
        private readonly IBetTicketVolumeControlService _betticketVolumeControlService;

        public BetTicketVolumeControlController()
        {
            _betticketVolumeControlService = new BetTicketVolumeControlService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View(GetSearchViewModel());
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Read)]
        public ActionResult Add()
        {
            return View(GetSearchViewModel());
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Host)]
        public JsonResult InsertOrUpdate(InsUpdateVolumeControlSettingCriteria criteria, List<ProductVolumeControlSetting> productSettingList)
        {
            criteria.ProductSettingXML = BuildProductSettingXml(productSettingList);
            var result = _betticketVolumeControlService.InsertOrUpdateVolumeControlSetting(criteria);
            return Json(new { IsSuccess = result.IsOk, Error = result.Message });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchVolumeControlSettingCriteria criteria)
        {
            return Json(_betticketVolumeControlService.GetVolumeControlSettingList(criteria));
        }

        private SearchVolumeControlViewModel GetSearchViewModel()
        {
            return new SearchVolumeControlViewModel
            {
                SiteNameList = _betticketVolumeControlService.GetSiteNames()
            };
        }

        private string BuildProductSettingXml(List<ProductVolumeControlSetting> ProductSettings)
        {
            var builder = new StringBuilder("<ROOT>");
            var id = 1;

            foreach (var product in ProductSettings)
            {
                builder.Append($"<ProductSetting ID=\"{id}\" ProductId=\"{product.ProductId}\" ProductName=\"{product.ProductName}\" ProductPercentage=\"{product.ProductPercentage}\" "
                + $"WLExpected=\"{product.WLExpected}\" WLAccumulated=\"{product.WLAccumulated}\"  WLRemaining=\"{product.WLRemaining}\" "
                + $"TOExpected=\"{product.TOExpected}\" TOAccumulated=\"{product.TOAccumulated}\"  WLRemaining=\"{product.TORemaining}\" />");
                id++;
            }

            builder.Append("</ROOT>");
            return builder.ToString();
        }
    }
}
