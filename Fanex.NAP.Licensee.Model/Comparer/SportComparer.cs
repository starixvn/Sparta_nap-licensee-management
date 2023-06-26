using Fanex.NAP.Licensee.Model.MetaModel;
using System.Collections.Generic;

namespace Fanex.NAP.Licensee.Model.Comparer
{
    public class SportComparer : IComparer<ISportGameMetaModel>
    {
        private const int Soccer = 1;
        private const int ESportId = 43;
        private const int Cricket = 50;
        private const int SabaSoccer = 9901;
        private const int SabaBasketBall = 9902;
        private const int SabaCricket = 9907;

        public const float ESportValue = 1.9f;
        public const float CricketValue = 10.1f;
        public const float SabaCricketValue = 10.2f;
        public const float ParlaySoccerValue = 1.5f;
        public const float SabaSoccerValue = 1.6f;
        public const float SabaBasketBallValue = 2.1f;


        public const int ParlayBetType = 9;

        public int Compare(ISportGameMetaModel x, ISportGameMetaModel y)
        {
            var xValue = ConvertToCompareValue(x);
            var yValue = ConvertToCompareValue(y);
            var sub = xValue - yValue;

            if (sub < 0)
            {
                return -1;
            }

            if (sub > 0)
            {
                return 1;
            }

            return 0;
        }

        private static float ConvertToCompareValue(ISportGameMetaModel value)
        {
            switch (value.SportGameTypeId)
            {
                case Soccer:
                    return value.BetType == ParlayBetType ? ParlaySoccerValue : value.SportGameTypeId;

                case ESportId:
                    return ESportValue;

                case SabaSoccer:
                    return SabaSoccerValue;

                case SabaBasketBall:
                    return SabaBasketBallValue;

                case Cricket:
                    return CricketValue;

                case SabaCricket:
                    return SabaCricketValue;

                default:
                    return value.SportGameTypeId;
            }
        }
    }
}