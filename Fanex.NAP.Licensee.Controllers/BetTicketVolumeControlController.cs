using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Fanex.NAP.Licensee.Controllers.Attributes;
using Fanex.NAP.Licensee.Model.Criteria.BetTicket;
using Fanex.NAP.Licensee.Model.DataDomain;
using Fanex.NAP.Licensee.Model.ViewModel.BetTicket;
using Fanex.NAP.Licensee.Service;
using ONEbook.UM.Filters;
using System.Web.Mvc;

namespace Fanex.NAP.Licensee.Controllers
{
    [NapSuperAuth]
    [CustomHandleError]
    [CheckUMFilter]
    public class BetTicketVolumeControlController : BaseController
    {
        private readonly IBetTicketService _bettickService;

        public BetTicketVolumeControlController()
        {
            _bettickService = new BetTicketService();
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.BetTicketVolumeControl, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchBetTicketCriteria criteria)
        {
            return Json(_bettickService.GetBetTicketList(criteria));
        }

        private SearchBetTicketViewModel GetSearchViewModel()
        {
            return new SearchBetTicketViewModel
            {
                SiteNameList = _bettickService.GetSiteNames()
            };
        }
    }
}
