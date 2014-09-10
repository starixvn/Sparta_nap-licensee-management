// -----------------------------------------------------------------------
// <copyright file="BetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class BetSettingService : IBetSettingService
    {
        private const int SuccessCode = 0;

        public IList<DefaultBetSetting> GetAll(Model.Criteria.DefaultBetSettingCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                return db.Query<DefaultBetSetting>(criteria.GetSpParams()).ToList();
            }
        }

        public bool Delete(DeletingDefaultBetSettingCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                db.ExecuteReader(criteria.GetSpParams());
                return db.GetParameterValue("@errcode").Equals(SuccessCode);
            }
        }

        public Model.ViewModel.EditDefaultBetSettingViewModel Single(string licensee, int currencyId, int? agentId)
        {
            return GenTestData(licensee, currencyId, agentId);
        }

        private static Model.ViewModel.EditDefaultBetSettingViewModel GenTestData(string licensee, int currencyId, int? agentId)
        {
            var item = new Model.ViewModel.EditDefaultBetSettingViewModel
            {
                Licensee = licensee,
                Currency = new CurrencyItem
                {
                    Id = currencyId,
                    Name = "$UUST"
                },
                AgentId = agentId,
                AgentName="All",
                Sportbook = new List<BetSettingBySport>(),
                VirtualSport = new List<BetSettingBySport>(),
                Keno = new List<BetSettingBySport>(),
                NumberGame = new List<BetSettingBySport>()
            };
            item.Sportbook.Add(new BetSettingBySport
            {
                SportOrGame = new SportOrGameItem { Id = 1, Name = "Soccer" },
                MaxBet = 500,
                MaxPerBall = 10,
                MaxPerMatch = 15
            });
            item.VirtualSport.Add(new BetSettingBySport
            {
                SportOrGame = new SportOrGameItem { Id = 2, Name = "Virtual Soccer" },
                MaxBet = 500,
                MaxPerBall = 10,
                MaxPerMatch = 15
            });
            item.Keno.Add(new BetSettingBySport
            {
                SportOrGame = new SportOrGameItem { Id = 3, Name = "Australia" },
                MaxBet = 500,
                MaxPerBall = 10,
                MaxPerMatch = 15
            });
            item.NumberGame.Add(new BetSettingBySport
            {
                SportOrGame = new SportOrGameItem { Id = 4, Name = "NumberGame" },
                MaxBet = 500,
                MaxPerBall = 10,
                MaxPerMatch = 15
            });
            return item;
        }
    }
}