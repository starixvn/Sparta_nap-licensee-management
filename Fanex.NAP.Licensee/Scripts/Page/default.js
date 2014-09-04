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
    var actionLinkTpl = "<a target='_blank' href=" + window.rootUrl + "BetSetting/Edit?licensee={lic}&currency={cur}&agentid={agt} class='icon-edit'></a>"
    +
    "<a target='_blank' href=" + window.rootUrl + "BetSetting/Delete?licensee={lic}&currency={cur}&agentid={agt} class='icon-delete'></a>";

    var currentGrid;
    var currentSelectedCurrency;
    var currentSelectedLicensee;
    var showSB = false;
    var showNG = false;
    var showVS = false;
    var showKN = false;
    /*end-private variable*/
    /*private method*/
    var initEvent = function () {
        $("#generate").click(function (event) {
            event.preventDefault();
            invokeGenerateButton();
        });
    };
    /* page function*/
    var invokeGenerateButton = function () {
        invokeErrMsg(false);
        currentSelectedCurrency = MultiSelectControl.getParentFilterId();
        currentSelectedLicensee = $("#licensee").val();
        showSB = $("#showSB").is(":checked");
        showNG = $("#showNG").is(":checked");
        showVS = $("#showVS").is(":checked");
        showKN = $("#showKN").is(":checked");

        if (!isValidInput()) {
            invokeErrMsg(true);
            return;
        }

        invokeLoadingMsg(true);
        renderGridData();
    };
    var isValidInput = function () {
        return (showSB || showKN || showNG || showVS) && currentSelectedCurrency !== undefined && currentSelectedCurrency.length > 0
        && currentSelectedLicensee !== undefined && currentSelectedLicensee.length > 0;
    };
    var setGenerateButtonStatus = function (disable) {
        if (disable) {
            $("#generate").attr("disabled", "disabled");
        } else {
            $("#generate").removeAttr("disabled");
        }
    };
    var invokeErrMsg = function (visible) {
        if (visible) {
            $("#errMsgBox").removeClass("hidden");
        }
        else {
            $("#errMsgBox").addClass("hidden");
        }
    };
    var invokeLoadingMsg = function (visible) {
        if (visible) {
            $("#loadingMsgBox").removeClass("hidden");
            setGenerateButtonStatus(true);
        }
        else {
            $("#loadingMsgBox").addClass("hidden");
            setGenerateButtonStatus(false);
        }
    };
    var generateActionLink = function (licensee, currencyId, agentId) {
        return actionLinkTpl.replace(/{lic}/g, licensee).replace(/{cur}/g,currencyId).replace(/{agt}/g,agentId);
    };
    var renderGridData = function () {
        var criteria = {
            Licensee: currentSelectedLicensee,
            Currency: currentSelectedCurrency.join(),
            ShowSportBook: showSB,
            ShowNumberGame: showNG,
            ShowVirtualSport: showVS,
            ShowKeno: showKN
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "BetSetting/Default",
            data: JSON.stringify(criteria),
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                console.log(data);
                gridOptions.bodyRows = converDataToFanexGridFormat(data);
                currentGrid = $("#gridId").fanexGrid(gridOptions);
                invokeLoadingMsg(false);
            },
            error: function () {
                invokeLoadingMsg(false);
                alert("Error requesting page");
            }
        });
    };
    var countItemInArray = function (countValue, startIndex, arrayData) {
        var counter = 0;
        if (countValue === undefined || countValue === null
        || countValue.length === 0 || arrayData === undefined
        || arrayData === null || arrayData.length === 0) {
            return counter;
        }
        var numOfComparator = countValue.length;
        var numOfRow = arrayData.length;

        for (var i = startIndex; i < numOfRow; i++) {
            var matched = true;
            for (var j = 0; j < numOfComparator; j++) {
                matched = matched && arrayData[i][countValue[j]["Key"]] === countValue[j]["Value"];
            }
            if (!matched) {
                break;
            }
            counter++;
        }
        return counter;
    };
    var converDataToFanexGridFormat = function (data) {
        var rows = [];
        if (data === undefined || data === null || data.length === 0) {
            return rows;
        }

        var numberRows = data.length;
        var evenClass = '';
        var licenseeMerRowNumber = 0;
        var currencyMerRowNumber = 0;
        var agentMerRowNumber = 0;
        for (var index = 0; index < numberRows; index++) {
            var currentColumms = [];
            if (licenseeMerRowNumber === 0) {
                licenseeMerRowNumber = countItemInArray([{ "Key": "Licensee", "Value": data[index]["Licensee"]}], index, data);

                currentColumms.push({ Name: "Licensee", Value: data[index]["Licensee"], MergeRowNumber: licenseeMerRowNumber });
                if (evenClass === 'freegrid-even') {
                    evenClass = '';
                }
                else {
                    evenClass = 'freegrid-even';
                }
            }

            if (currencyMerRowNumber === 0) {
                currencyMerRowNumber = countItemInArray(
                [{ "Key": "Licensee", "Value": data[index]["Licensee"] }, { "Key": "CurrencyID", "Value": data[index]["CurrencyID"]}], index, data);

                currentColumms.push({ Name: "Currency", Value: data[index]["Currency"], MergeRowNumber: currencyMerRowNumber });

            }

            if (agentMerRowNumber === 0) {

                agentMerRowNumber = countItemInArray(
                [{ "Key": "Licensee", "Value": data[index]["Licensee"] },
                { "Key": "CurrencyID", "Value": data[index]["CurrencyID"] },
                { "Key": "AgentID", "Value": data[index]["AgentID"] }
                ],
                index,
                data);
                var agentName = data[index]["AgentName"];
                currentColumms.push({ Name: "Agent",
                    Value: agentName === undefined || agentName === null ? "All" : agentName,
                  MergeRowNumber: agentMerRowNumber });

            }
            rows.push(
            {
                Columns: currentColumms.concat([
                    { Name: "SportGameType", Value: data[index]["SportGameType"] },
                    { Name: "MaxBet", Value: data[index]["MaxBet"] },
                    { Name: "MaxPerMatch", Value: data[index]["MaxPerMatch"] },
                    { Name: "MaxPerBall", Value: data[index]["MaxPerBall"] },
                    { Name: "Action", Value: generateActionLink(data[index]["Licensee"], data[index]["CurrencyID"], data[index]["AgentID"]) }

                ]),
                CssClass: evenClass
            }
             );

            if (licenseeMerRowNumber > 0) {
                licenseeMerRowNumber--;
            }
            if (currencyMerRowNumber > 0) {
                currencyMerRowNumber--;
            }
            if (agentMerRowNumber > 0) {
                agentMerRowNumber--;
            }
        }
        return rows;
    };
    /*end-page function*/

    /*end-private method*/

    me.setup = function () {
        initEvent();
        site.renderCurrencyList();
        site.renderLicenseeList();
    };

    return me;
})();