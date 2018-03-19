namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.Vendor;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.LicenseeVendor;
    using Newtonsoft.Json;
    using Service;

    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSite, Policy = Constant.Policy.Read)]
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
            return View();
        }

        [HttpPost]
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
                var originalExclusionJson = vendor.Exclusions;
                var originalExclusionList = string.IsNullOrEmpty(originalExclusionJson) ?
                    new List<string>() :
                    JsonConvert.DeserializeObject<List<string>>(originalExclusionJson);

                var functionKeyList = _vendorService.GetFunctionKeyList();
                var renderingFunctionKeyList = functionKeyList.Union(originalExclusionList);

                var viewModel = new EditVendorViewModel
                {
                    VendorInfo = vendor,
                    FunctionKeyList = JsonConvert.SerializeObject(renderingFunctionKeyList)
                };

                return View(viewModel);
            }

            var emptyResult = new EditVendorViewModel
            {
                VendorInfo = new LicenseeVendor(),
                FunctionKeyList = JsonConvert.SerializeObject(new List<string>())
            };

            return View(emptyResult);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditLicenseeVendor, Policy = Constant.Policy.Host)]
        public ActionResult Edit(LicenseeVendor vendor)
        {
            var result = _vendorService.UpdateVendor(vendor);

            return Json(result);
        }
    }
}