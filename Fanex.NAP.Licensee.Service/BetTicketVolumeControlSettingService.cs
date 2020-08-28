namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.Criteria.BetTicketVolumeControlSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Service.Core;
    using System.Collections.Generic;

    public class BetTicketVolumeControlService : IBetTicketVolumeControlService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public BetTicketVolumeControlService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<Brand> GetSiteNames()
        {
            using (var db = _objectDbGenerator.Create("Plo_VolumeControl_Brand_Sel"))
            {
                return db.Query<Brand>();
            }
        }

        public ResultGridData<ProductVolumeControlSetting> GetVolumeControlSettingList(SearchVolumeControlSettingCriteria criteria)
        {
            var result = new ResultGridData<ProductVolumeControlSetting>();

            using (var db = _objectDbGenerator.Create("Plo_VolumeControl_Setting_Sel"))
            {
                result.Data = db.Query<ProductVolumeControlSetting>(criteria);
            }

            return result;
        }

        public ResultGridData<ProductVolumeControlSetting> GetVolumeControlAddSettingList(string brandCode)
        {
            var result = new ResultGridData<ProductVolumeControlSetting>();
            using (var db = _objectDbGenerator.Create("Plo_VolumeControl_BrandProduct_Sel"))
            {
                result.Data = db.Query<ProductVolumeControlSetting>(new { BrandCode = brandCode });
            }

            return result;
        }

        public ResultInfo InsertOrUpdateVolumeControlSetting(InsUpdateVolumeControlSettingCriteria criteria)
        {
            var result = new ResultInfo();
            using (var db = _objectDbGenerator.Create("Plo_VolumeControl_Setting_Sel"))
            {
                db.ExecuteNonQuery(criteria);
                result.IsOk = criteria.ErrorCode.Equals(0);
                result.Message = criteria.Message;
            }

            return result;
        }
    }
}
