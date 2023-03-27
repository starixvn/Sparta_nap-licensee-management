namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Bet setting sport book view model.
    /// </summary>
    public class BSSportbookViewModel : BSBaseViewModel
    {
        public BSSportbookViewModel()
        {
        }

        public BSSportbookViewModel(BSSportbookItemWithSuperInfo items, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSRowBaseViewModel>();

            foreach (var key in dctGameType.Keys)
            {

                BSSportbookItem item = items.SuperItems.FirstOrDefault(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId);
                BSSportbookItem itemAgent = items.AgentItems.FirstOrDefault(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId);
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
                    UpLineMinBet = string.Empty,
                    UpLineMaxBet = string.Empty,
                    UpLineMaxPerMatch = string.Empty,
                    UpLineMaxPayoutPerMatch = string.Empty,
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
                            UpLineMinBet = item.MinBet.ToString("0"),
                            UpLineMaxBet = item.MaxBet.ToString("0"),
                            UpLineMaxPerMatch = item.MaxPerMatch.ToString("0"),
                            UpLineMaxPayoutPerMatch = item.MaxPayoutPerMatch.ToString("0"),
                            MinBet = itemAgent.MinBet.ToString("0"),
                            MaxBet = itemAgent.MaxBet.ToString("0"),
                            MaxPerMatch = itemAgent.MaxPerMatch.ToString("0"),
                            MaxPayoutPerMatch = itemAgent.MaxPayoutPerMatch.ToString("0"),
                            IsRowSelected = false,
                            IsRowDisabled = false,
                        }
                        : new BSRowBaseViewModel
                        {
                            SportTypeId = key.SportTypeId,
                            SportTypeName = dctGameType[key],
                            BetTypeId = key.BetTypeId,
                            BetTypeName = dctGameType[key],
                            UpLineMinBet = item.MinBet.ToString("0"),
                            UpLineMaxBet = item.MaxBet.ToString("0"),
                            UpLineMaxPerMatch = item.MaxPerMatch.ToString("0"),
                            UpLineMaxPayoutPerMatch = item.MaxPayoutPerMatch.ToString("0"),
                            MinBet = "0",
                            MaxBet = "0",
                            MaxPerMatch = "0",
                            MaxPayoutPerMatch = "0",
                            IsRowSelected = false,
                            IsRowDisabled = false
                        };
                }

                BSRows.Add(sportbookRowVM);
            }
        }

        public bool Option { get; set; }

        public bool IsNewMember { get; set; }

        public IList<BSRowBaseViewModel> BSRows { get; set; }

        public IList<BSRowBaseViewModel> DBSRows { get; set; }

        public BSRowBaseViewModel SportBetSetting { get; set; }
    }
}
