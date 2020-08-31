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
        public JsonResult Update(InsUpdateVolumeControlSettingCriteria criteria, ProductVolumeControlSetting productSetting)
        {
            criteria.ProductSetting = BuildProductSettingXml(new List<ProductVolumeControlSetting>{ productSetting });
            criteria.UserID = CurrentSession.UserId;
            var result = _betticketVolumeControlService.InsertOrUpdateVolumeControlSetting(criteria);
            return Json(new { IsSuccess = result.IsOk, Error = result.Message });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Host)]
        public JsonResult Insert(InsUpdateVolumeControlSettingCriteria criteria, List<ProductVolumeControlSetting> productSettingList)
        {
            criteria.ProductSetting = BuildProductSettingXml(productSettingList);
            criteria.UserID = CurrentSession.UserId;
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

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Read)]
        public JsonResult GetAddSettingList(string brandCode)
        {
            return Json(_betticketVolumeControlService.GetVolumeControlAddSettingList(brandCode));
        }

        private SearchVolumeControlViewModel GetSearchViewModel()
        {
            return new SearchVolumeControlViewModel
            {
                SiteNameList = _betticketVolumeControlService.GetSiteNames()
            };
        }

        private static string BuildProductSettingXml(List<ProductVolumeControlSetting> ProductSettings)
        {
            var builder = new StringBuilder("<vcsettings>");

            foreach (var product in ProductSettings)
            {
                builder.Append("<p>");
                builder.Append($"<pid>{product.ProductId}</pid><pname>{product.ProductName}</pname>"
                + $"<pper>{product.ProductPercentage}</pper><toa>{product.TOExpected}</toa><wla>{product.WLExpected}</wla>");
                builder.Append("</p>");
            }

            builder.Append("</vcsettings>");
            return builder.ToString();
        }
    }
}
