namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    public interface ISettingConfigurationService
    {
        ResultInfo UpdateBetSettingSportsbook(UpdateBetSettingSportsbookItem item);

        ResultInfo CheckBetSettingSportsbook(CheckBetSettingSportsbookItem item);

        BSSportsbookItemWithSuperInfo GetBSSportsbookItemWithSuperInfo(int custId, int productId, int agentId, bool option);
    }
}
