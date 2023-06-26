var logConfig = (function () {

    var me = {};

    me.itemsMapping = [
        {
            ActionIds: "5574,5575,12,13,14,15,16,17",
            Configs: [
                {
                    Alias: "R",
                    Item: "Information"
                },
                {
                    Alias: "ExistingPlayers",
                    Item: "Existing Players"
                },
                {
                    Alias: "NewPlayers",
                    Item: "New Players"
                },
                {
                    Alias: "BL",
                    Item: "Bet Setting"
                },
                {
                    Alias: "MinBet",
                    Item: "Min Bet"
                },
                {
                    Alias: "MaxBet",
                    Item: "Max Bet"
                },
                {
                    Alias: "MaxPerMatch",
                    Item: "Max Per Match"
                },
                {
                    Alias: "MaxPerBall",
                    Item: "Max Per Ball"
                },
                {
                    Alias: "MaxPayoutPerMatch",
                    Item: "Max Payout Per Match"
                }
            ]
        }
    ];

    me.itemsIgnore = [
        {
            ActionIds: "5574,5575,12,13,14,15,16,17",
            Items: [
                "UserID",
                "IP",
                "CurrencyID",
                "Language",
                "Option",
                "SportType",
                "Bettype",
                "ErrMsg",
                "ErrCode"
            ]
        }
    ]

    return me;
})();