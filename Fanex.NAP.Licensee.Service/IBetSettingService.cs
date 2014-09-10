// -----------------------------------------------------------------------
// <copyright file="IBetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.ViewModel;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IBetSettingService
    {
        IList<DefaultBetSetting> GetAll(GetAllDefaultBetSettingCriteria criteria);

        bool Delete(DeletingDefaultBetSettingCriteria criteria);

        EditDefaultBetSettingViewModel SingleExisted(GetSingleDefaultBetSettingCriteria criteria);

        bool Update(UpdateExistedDefaultBetSettingCriteria criteria);

        EditDefaultBetSettingViewModel SingleTemplate(GetSingleDefaultBetSettingTemplate criteria);

        bool Insert(InsertDefaultBetSetting criteria);
    }
}