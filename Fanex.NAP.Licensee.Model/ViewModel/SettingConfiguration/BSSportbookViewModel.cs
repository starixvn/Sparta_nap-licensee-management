namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Bet setting sport book view model.
    /// </summary>
    public class BSSportbookViewModel : BSBaseViewModel
    {
        public BSSportbookViewModel()
        {
        }

        public BSSportbookViewModel(BSSportbookItemWithSuperInfo lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSRowBaseViewModel>();

            foreach (var key in dctGameType.Keys)
            {

                BSSportbookItem item = lstItems.SuperItems.FirstOrDefault(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId);
                BSSportbookItem itemAgent = lstItems.AgentItems.FirstOrDefault(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId);
                BSRowBaseViewModel sportbookRowVM = new BSRowBaseViewModel
                {
                    SportTypeId = key.SportTypeId,
                    SportTypeName = dctGameType[key],
                    BetTypeId = key.BetTypeId,
                    BetTypeName = dctGameType[key],
                    MinBet = string.Empty,
                    MaxBet = string.Empty,
                    MaxPerMatch = string.Empty,
                    MaxPayoutPerMatch = string.Empty,
                    AgentMinBet = string.Empty,
                    AgentMaxBet = string.Empty,
                    AgentMaxPerMatch = string.Empty,
                    AgentMaxPayoutPerMatch = string.Empty,
                    IsRowSelected = false,
                    IsRowDisabled = false
                };

                if (item != null)
                {
                    sportbookRowVM = itemAgent != null
                        ? new BSRowBaseViewModel
                        {
                            SportTypeId = key.SportTypeId,
                            SportTypeName = dctGameType[key],
                            BetTypeId = key.BetTypeId,
                            BetTypeName = dctGameType[key],
                            MinBet = item.MinBet.ToString("0"),
                            MaxBet = item.MaxBet.ToString("0"),
                            MaxPerMatch = item.MaxPerMatch.ToString("0"),
                            MaxPayoutPerMatch = item.MaxPayoutPerMatch.ToString("0"),
                            AgentMinBet = itemAgent.MinBet.ToString("0"),
                            AgentMaxBet = itemAgent.MaxBet.ToString("0"),
                            AgentMaxPerMatch = itemAgent.MaxPerMatch.ToString("0"),
                            AgentMaxPayoutPerMatch = itemAgent.MaxPayoutPerMatch.ToString("0"),
                            IsRowSelected = false,
                            IsRowDisabled = false,
                        }
                        : new BSRowBaseViewModel
                        {
                            SportTypeId = key.SportTypeId,
                            SportTypeName = dctGameType[key],
                            BetTypeId = key.BetTypeId,
                            BetTypeName = dctGameType[key],
                            MinBet = item.MinBet.ToString("0"),
                            MaxBet = item.MaxBet.ToString("0"),
                            MaxPerMatch = item.MaxPerMatch.ToString("0"),
                            MaxPayoutPerMatch = item.MaxPayoutPerMatch.ToString("0"),
                            AgentMinBet = "0",
                            AgentMaxBet = "0",
                            AgentMaxPerMatch = "0",
                            AgentMaxPayoutPerMatch = "0",
                            IsRowSelected = false,
                            IsRowDisabled = false
                        };
                }

                BSRows.Add(sportbookRowVM);
            }

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSRowBaseViewModel> BSRows { get; set; }

        public BSRowBaseViewModel SportBetSetting { get; set; }
    }
}
