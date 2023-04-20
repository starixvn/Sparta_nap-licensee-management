namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Bet setting sports book view model.
    /// </summary>
    public class BSSportsbookViewModel : BSBaseViewModel
    {
        public BSSportsbookViewModel()
        {
        }

        public BSSportsbookViewModel(BSSportsbookItemWithSuperInfo items, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSRowBaseViewModel>();

            foreach (var key in dctGameType.Keys)
            {

                BSSportsbookItem uplineItem = items.SuperItems.FirstOrDefault(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId);
                BSSportsbookItem item = items.AgentItems.FirstOrDefault(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId);
                BSRowBaseViewModel sportsbookRowVM = new BSRowBaseViewModel
                {
                    SportTypeId = key.SportTypeId,
                    SportTypeName = dctGameType[key],
                    BetTypeId = key.BetTypeId,
                    BetTypeName = dctGameType[key],
                    MinBet = string.Empty,
                    MaxBet = string.Empty,
                    MaxPerMatch = string.Empty,
                    MaxPayoutPerMatch = string.Empty,
                    UplineMinBet = string.Empty,
                    UplineMaxBet = string.Empty,
                    UplineMaxPerMatch = string.Empty,
                    UplineMaxPayoutPerMatch = string.Empty,
                    IsRowSelected = false,
                    IsRowDisabled = false
                };

                if (uplineItem != null)
                {
                    sportsbookRowVM = item != null
                        ? new BSRowBaseViewModel
                        {
                            SportTypeId = key.SportTypeId,
                            SportTypeName = dctGameType[key],
                            BetTypeId = key.BetTypeId,
                            BetTypeName = dctGameType[key],
                            UplineMinBet = uplineItem.MinBet.ToString("0"),
                            UplineMaxBet = uplineItem.MaxBet.ToString("0"),
                            UplineMaxPerMatch = uplineItem.MaxPerMatch.ToString("0"),
                            UplineMaxPayoutPerMatch = uplineItem.MaxPayoutPerMatch.ToString("0"),
                            MinBet = item.MinBet.ToString("0"),
                            MaxBet = item.MaxBet.ToString("0"),
                            MaxPerMatch = item.MaxPerMatch.ToString("0"),
                            MaxPayoutPerMatch = item.MaxPayoutPerMatch.ToString("0"),
                            IsRowSelected = false,
                            IsRowDisabled = false,
                        }
                        : new BSRowBaseViewModel
                        {
                            SportTypeId = key.SportTypeId,
                            SportTypeName = dctGameType[key],
                            BetTypeId = key.BetTypeId,
                            BetTypeName = dctGameType[key],
                            UplineMinBet = uplineItem.MinBet.ToString("0"),
                            UplineMaxBet = uplineItem.MaxBet.ToString("0"),
                            UplineMaxPerMatch = uplineItem.MaxPerMatch.ToString("0"),
                            UplineMaxPayoutPerMatch = uplineItem.MaxPayoutPerMatch.ToString("0"),
                            MinBet = "0",
                            MaxBet = "0",
                            MaxPerMatch = "0",
                            MaxPayoutPerMatch = "0",
                            IsRowSelected = false,
                            IsRowDisabled = false
                        };
                }

                BSRows.Add(sportsbookRowVM);
            }
        }

        public BSSportsbookViewModel(IList<BetSettingBySport> dbsItems)
        {
            BSRows = new List<BSRowBaseViewModel>();
            foreach (var item in dbsItems)
            {
                var dbsSportsbookRowVm = new BSRowBaseViewModel
                {
                    SportTypeId = item.SportGameTypeId,
                    SportTypeName = item.SportOrGame.Name,
                    BetTypeId = item.BetType,
                    BetTypeName = item.SportOrGame.Name,
                    MinBet = item.MinBet.HasValue ? item.MinBet.Value.ToString("0") : string.Empty,
                    MaxBet = item.MaxBet.HasValue ? item.MaxBet.Value.ToString("0") : string.Empty,
                    MaxPerMatch = item.MaxPerMatch.HasValue ? item.MaxPerMatch.Value.ToString("0") : string.Empty,
                    MaxPayoutPerMatch = item.MaxPayoutPerMatch.HasValue ? item.MaxPayoutPerMatch.Value.ToString("0") : string.Empty,
                    IsRowDisabled = false,
                    IsRowSelected = false
                };
                BSRows.Add(dbsSportsbookRowVm);
            }
        }

        public bool Option { get; set; }

        public bool IsNewMember { get; set; }

        public IList<BSRowBaseViewModel> BSRows { get; set; }

        public IList<BSRowBaseViewModel> DBSRows { get; set; }
    }
}
