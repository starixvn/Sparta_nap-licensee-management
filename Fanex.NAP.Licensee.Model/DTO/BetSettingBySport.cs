// -----------------------------------------------------------------------
// <copyright file="SetingBySport.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class BetSettingBySport
    {
       public SportOrGameItem SportOrGame { get; set; }
       public decimal? MaxBet { get; set; }
       public decimal? MaxPerMatch { get; set; }
       public decimal? MaxPerBall { get; set; }
       public int BetType { get; set; }
    }
}
