namespace Fanex.NAP.Licensee.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.Vendor;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.LicenseeVendor;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLicenseeVendor, Policy = Constant.Policy.Read)]
    [CustomValidateAntiForgery]
    public class LicenseeVendorController : BaseController
    {
        private readonly ILicenseeVendorService _vendorService;

        public LicenseeVendorController()
        {
            _vendorService = new LicenseeVendorService();
        }

        [HttpGet]
        public ActionResult Index()
        {
            var functionKeyList = _vendorService.GetFunctionKeyList();
            return View(functionKeyList);
        }

        [HttpPost]
        [AjaxRequest]
        public ActionResult GetVendorInfoList(VendorSearchingCriteria criteria)
        {
            return Json(_vendorService.GetVendorList(criteria));
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult Edit(string vendorId)
        {
            var vendor = _vendorService.GetVendorById(vendorId);

            if (vendor != null)
            {
                var functionKeyList = _vendorService.GetFunctionKeyList();
                var renderingFunctionKeyList = vendor.ExclusionList != null ? functionKeyList.Union(vendor.ExclusionList) : functionKeyList;

                var viewModel = new EditVendorViewModel
                {
                    VendorInfo = vendor,
                    FunctionKeyList = renderingFunctionKeyList
                };

                return View(viewModel);
            }

            var emptyResult = new EditVendorViewModel
            {
                VendorInfo = new LicenseeVendor(),
                FunctionKeyList = Enumerable.Empty<string>()
            };

            return View(emptyResult);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult Edit(LicenseeVendor vendor)
        {
            var result = _vendorService.UpdateVendor(vendor);

            return Json(result);
        }
    }
}