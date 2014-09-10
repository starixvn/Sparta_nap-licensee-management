// -----------------------------------------------------------------------
// <copyright file="IBetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.Criteria;
using Fanex.NAP.Licensee.Model.ViewModel;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IBetSettingService
    {
         IList<DefaultBetSetting> GetAll(DefaultBetSettingCriteria criteria);

         bool Delete(DeletingDefaultBetSettingCriteria criteria);

         EditDefaultBetSettingViewModel Single(string licensee, int currencyId, int? agentId);
    }
}
