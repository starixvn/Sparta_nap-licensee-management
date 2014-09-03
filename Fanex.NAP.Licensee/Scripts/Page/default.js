/* File Created: August 20, 2014 */
/*exported defaultSetting */
/* global MultiSelectControl,site */

var defaultSetting = (function () { // jshint ignore:line

    "use strict";
    var me = {};
    /*private variable*/
    var gridOptions =
    {

        columns: [

            { HeaderText: "Licensee", Width: 120, Name: "Licensee", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Currency", Width: 120, Name: "Currency", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Agent", Width: 150, Name: "Agent", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Sport Type / Game Type", Width: 200, Name: "SportGameType", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Max Bet", Width: 150, Name: "MaxBet", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Max Per Match", Width: 150, Name: "MaxPerMatch", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Max Per Ball", Width: 150, Name: "MaxPerBall", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Action", Width: 132, Name: "Action", HeaderAlign: "center", CellAlign: "center" },
        ],
        bodyRows: [],
        gridExpandHeight: 150,
        bodyRowHeight: 30,
        showDistinctRow: false,
        autoResizeColumn: true
    };
    var currentGrid;
    /*end-private variable*/
    /*private method*/
    var initEvent = function () {

    };
    var generateActionLink = function (licensee, currencyId, agentId) {
        return "<a href='home/index' class='icon-edit'></a><a href='home/index' class='icon-delete'></a>";
    };
    var renderGridData = function () {
        gridOptions.bodyRows = getGridData();
        currentGrid = $("#gridId").fanexGrid(gridOptions);
    };
    var getGridData = function () {

        var numberRows = 100;
        var rows = [];

        var currentMerRowNumber = 0;
        var evenClass = '';
        for (var index = 0; index < numberRows; index++) {
            var currentColumms = [];

            if (currentMerRowNumber === 0) {
                currentMerRowNumber = Math.round(Math.random() * 5) + 2;
                //if(currentColumms + index < 0)
                currentColumms.push({ Name: "Licensee", Value: "12bet", MergeRowNumber: currentMerRowNumber });
                if (evenClass === 'freegrid-even') {
                    evenClass = '';
                }
                else {
                    evenClass = 'freegrid-even';
                }
            }
            rows.push(
            {
                Columns: currentColumms.concat([
                // {Name: "Licensee", Value: "12bet"},
                    {Name: "Currency", Value: "US$" },
                    { Name: "Agent", Value: "12BetUS$01" },
                    { Name: "SportGameType", Value: "Bond Girl A ha" },
                    { Name: "MaxBet", Value: (Math.random() * 1000).toFixed(3) },
                    { Name: "MaxPerMatch", Value: (index % 2 === 0 ? (Math.random() * 500).toFixed(3) : (Math.random() * 500 * -1).toFixed(3)) },
                    { Name: "MaxPerBall", Value: (index % 2 === 0 ? (Math.random() * 500).toFixed(3) : (Math.random() * 500 * -1).toFixed(3)) },
                    { Name: "Action", Value: generateActionLink("12bet", 13, 13454) }

                ]),
                CssClass: evenClass
            }
        );
            currentMerRowNumber--;
        }
        return rows;


    };
    /*end-private method*/

    me.setup = function () {
        initEvent();
        site.renderCurrencyList();
        site.renderLicenseeList();
    };

    return me;

})();

