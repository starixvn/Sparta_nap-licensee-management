namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Model.Criteria.Vendor;
    using Service;

    public class VendorController : BaseController
    {
        private readonly IVendorService _vendorService;

        public VendorController()
        {
            _vendorService = new VendorService();
        }

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
        public ActionResult Edit(string vendorId)
        {
            var vendor = _vendorService.GetVendorById(vendorId);

            return View(vendor);
        }
    }
}