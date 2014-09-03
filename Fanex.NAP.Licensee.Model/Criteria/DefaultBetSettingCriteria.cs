// -----------------------------------------------------------------------
// <copyright file="DefaultBetSettingCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria
{
    using Fanex.Data.Repository;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class DefaultBetSettingCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public string Currency { get; set; }

        public bool ShowSportBook { get; set; }

        public bool ShowNumberGame { get; set; }

        public bool ShowVirtualSport { get; set; }

        public bool ShowKeno { get; set; }
    }
}