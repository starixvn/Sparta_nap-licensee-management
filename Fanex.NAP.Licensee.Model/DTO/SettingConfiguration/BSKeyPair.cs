namespace Fanex.NAP.Licensee.Model.DTO.SettingConfiguration
{
    /// <summary>
    /// Bet setting key pair.
    /// </summary>
    public class BSKeyPair
    {
        public BSKeyPair(int sportTypeId, int betTypeId)
        {
            SportTypeId = sportTypeId;
            BetTypeId = betTypeId;
        }

        public int SportTypeId { get; set; }

        public int BetTypeId { get; set; }
    }
}
