namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.Vendor;
    using Model.DataDomain;
    using Model.DTO;
    using Service;

    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSite, Policy = Constant.Policy.Read)]
    public class VendorController : BaseController
    {
        private readonly IVendorService _vendorService;

        public VendorController()
        {
            _vendorService = new VendorService();
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetVendorInfoList(VendorSearchingCriteria criteria)
        {
            return Json(_vendorService.GetVendorList(criteria));
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditBetSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(string vendorId)
        {
            var vendor = _vendorService.GetVendorById(vendorId);

            return View(vendor);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditBetSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(Vendor vendor)
        {
            var result = _vendorService.UpdateVendor(vendor);

            return Json(result);
        }
    }
}