// -----------------------------------------------------------------------
// <copyright file="LicenseeManagementController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Model.Criteria.Core;
    using Fanex.NAP.Licensee.Model.Criteria.Licensee;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.ViewModel;
    using Fanex.NAP.Licensee.Service.Core;
    using Fanex.NAP.Licensee.Service.Licensee;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class LicenseeManagementController : BaseController
    {
        private ILicenseeService _licenseeService;

        private IProductService _productService;

        private ISystemService _systemService;

        private IFunctionService _functionService;

        public LicenseeManagementController()
            : base()
        {
            this._licenseeService = new LicenseeService();
            this._systemService = new SystemService();
            this._functionService = new FunctionService();
            this._productService = new ProductService();
        }

        public LicenseeManagementController(
            ILicenseeService licenseeService, 
            ISystemService systemService, 
            IFunctionService functionService, 
            IProductService productService)
        {
            this._licenseeService = licenseeService;
            this._systemService = systemService;
            this._functionService = functionService;
            this._productService = productService;
        }

        /// <summary>
        /// Create Licensee.
        /// </summary>
        /// <returns>Action result.</returns>
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.CreateNewLicensee, Policy = Constant.Policy.Read)]
        public ActionResult Create()
        {
            var model = new CreateLicenseeViewModel()
                {
                    Licensees = _licenseeService.GetDummyLicensees(new GetLicenseesCriteria()),
                    LicenseeTypes = _licenseeService.GetLicenseeTypes(new GetLicenseeTypeCriteria()),
                    Products = _productService.GetAllProduct(new GetAllProductCriteria()),
                    SystemInfo = _systemService.GetSystemInfoList(new GetSystemInfoCriteria()),
                    SpecialFunctions = _functionService.GetSpecialFunctions(new GetSpecialFunctionCriteria()),
                };
            return View(model);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.CreateNewLicensee, Policy = Constant.Policy.Read)]
        public string Create(CreateLicenseeCriteria criteria)
        {
            var result = _licenseeService.CreateLicensee(criteria);
            return string.IsNullOrEmpty(result) ? "OK" : result;
        }
    }
}