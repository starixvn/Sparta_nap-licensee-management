namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Core;
    using Model.Criteria.LicenseeSetting;
    using Model.DTO;

    public class LicenseeSettingService : ILicenseeSettingService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public LicenseeSettingService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<Licensee> Search(LicenseeCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Select"))
            {
                return db.Query<Licensee>(criteria);
            }
        }
    }
}