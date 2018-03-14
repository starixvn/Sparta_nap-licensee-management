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

            if (vendor != null)
            {
                var originalExclusionJson = vendor.Exclusions;
                var originalExclusionList = string.IsNullOrEmpty(originalExclusionJson) ?
                    new List<string>() :
                    JsonConvert.DeserializeObject<List<string>>(originalExclusionJson);

                var functionKeyList = _vendorService.GetFunctionKeyList();

                var renderingExclusionList = originalExclusionList.Where(f => functionKeyList.Contains(f));
                vendor.Exclusions = JsonConvert.SerializeObject(renderingExclusionList);

                var viewModel = new EditVendorViewModel
                {
                    VendorInfo = vendor,
                    FunctionKeyList = JsonConvert.SerializeObject(functionKeyList)
                };

                return View(viewModel);
            }

            var emptyResult = new EditVendorViewModel
            {
                VendorInfo = new Vendor(),
                FunctionKeyList = JsonConvert.SerializeObject(new List<string>())
            };

            return View(emptyResult);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditBetSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(Vendor vendor)
        {
            var exclusionList = GetExternalExclusionList(vendor.VendorId, vendor.Exclusions);
            var exclusionJson = exclusionList.Any() ? JsonConvert.SerializeObject(exclusionList) : null;
            vendor.Exclusions = exclusionJson;

            var result = _vendorService.UpdateVendor(vendor);

            return Json(result);
        }

        private IEnumerable<string> GetExternalExclusionList(string vendorId, string newExclusionJson)
        {
            var vendor = _vendorService.GetVendorById(vendorId);
            if (vendor != null)
            {
                var originalExclusionJson = vendor.Exclusions;
                var originalExclusionList = string.IsNullOrEmpty(originalExclusionJson) ?
                    new List<string>() :
                    JsonConvert.DeserializeObject<List<string>>(originalExclusionJson);

                var functionKeyList = _vendorService.GetFunctionKeyList();

                var externalFunctionKeyList = originalExclusionList.Where(f => !functionKeyList.Contains(f));

                return string.IsNullOrEmpty(newExclusionJson) ?
                    externalFunctionKeyList :
                    externalFunctionKeyList.Union(JsonConvert.DeserializeObject<List<string>>(newExclusionJson));
            }

            return new List<string>();
        }
    }
}