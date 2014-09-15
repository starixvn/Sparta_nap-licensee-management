/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/*exported site */
/* global MultiSelectControl */
var site = (function () {
    "use strict";
    var me = {};
    //    me.renderSingleAgentList = function (licensee, currency) {
    //    };
    me.renderSingleCurrencyList = function () {
        $.getJSON(window.rootUrl + "BetSetting/GetCurrencyList", function (data) {
            var items = "";
            for (var i = 0; i < data.length; i++) {
                items += "<option value=\"" + data[i].Name + "\">" + data[i].Name + "</option>";
            }

            $("#currency").html(items);
        });
    };
    me.renderCurrencyList = function (selectedParentIdList) {
        var currencyControl = new MultiSelectControl();

        $.getJSON(window.rootUrl + "BetSetting/GetCurrencyList", function (data) {
            var currencies = [];
            for (var i = 0; i < data.length; i++) {
                var cur = {
                    Id: data[i].Id,
                    Name: data[i].Name,
                    ParentId: 0
                };
                currencies.push(cur);
            }

            var currencyControllSetting = {
                ContainerId: "currency-control",
                IdProperty: "Id",
                NameProperty: "Name",
                ParentIdProperty: "ParentId",
                SelectedParentIdList: selectedParentIdList,
                DefaultData: currencies,
                SelectedAllText: "All currencies",
                NoItemText: "None",
                SelectedText: "{0} selected",
                FilterEmptyText: "Please select currency!",
                IsFilterAllLevel: true,
                IsCloseControlWhenBlur: true,
                IsSearch: true
            };
            currencyControl.renderControl(currencyControllSetting);
        });
        return currencyControl;
    };
    me.isNumber = function (text) {
        var RE = /^-{0,1}\d*\.{0,1}\d+$/;
        var isnum = (RE.test(text));
        return isnum && parseFloat(text) > 0;
    };

    me.invokeErrMsg = function (visible) {
        if (visible) {
            $("#errMsgBox").removeClass("hidden");
        }
        else {
            $("#errMsgBox").addClass("hidden");
        }
    };
    me.renderLicenseeList = function (currentSelectedLicensee) {
        $.getJSON(window.rootUrl + "BetSetting/GetLicenseeList", function (data) {
            var items = "";
            for (var i = 0; i < data.length; i++) {
                var selected = data[i].Name.toLowerCase() === currentSelectedLicensee ? "selected = \"selected\"" : "";
                items += "<option " + selected + " value=\"" + data[i].Name + "\">" + data[i].Name + "</option>";
            }

            $("#licensee").html(items);
        });
    };
    me.verifyBetSetting = function ($row) {
        var error = 0;
        var maxBet = $row.find("input[data-key=\"MaxBet\"]").val();
        var maxPerMatch = $row.find("input[data-key=\"MaxPerMatch\"]").val();

        if (!site.isNumber(maxBet) && maxBet.length > 0) {
            $row.find("input[data-key=\"MaxBet\"]").addClass("warning");
            error++;
        }

        if (!site.isNumber(maxPerMatch) && maxBet.length > 0) {
            $row.find("input[data-key=\"MaxPerMatch\"]").addClass("warning");
            error++;
        }

        if (maxBet.length !== maxPerMatch.length) {
            if (maxBet.length === 0) {
                $row.find("input[data-key=\"MaxBet\"]").addClass("warning");
                error++;
            }
            if (maxPerMatch.length === 0) {
                $row.find("input[data-key=\"MaxPerMatch\"]").addClass("warning");
                error++;
            }
        }
        return error;
    };
    var verifyNumberBetSetting = function ($row) {
        var error = site.verifyBetSetting($row);
        var maxperBall = $row.find("input[data-key=\"MaxPerBall\"]").val();
        var maxBet = $row.find("input[data-key=\"MaxBet\"]").val();
        var maxPerMatch = $row.find("input[data-key=\"MaxPerMatch\"]").val();

        if (!site.isNumber(maxperBall) && maxperBall.length > 0) {
            $row.find("input[data-key=\"MaxPerBall\"]").addClass("warning");
            error++;
        }

        if (maxBet.length !== maxperBall.length) {
            if (maxBet.length === 0) {
                $row.find("input[data-key=\"MaxBet\"]").addClass("warning");
                error++;
            }
            if (maxperBall.length === 0) {
                $row.find("input[data-key=\"MaxPerBall\"]").addClass("warning");
                error++;
            }
        }
        if (maxPerMatch.length !== maxperBall.length) {
            if (maxPerMatch.length === 0) {
                $row.find("input[data-key=\"MaxPerMatch\"]").addClass("warning");
                error++;
            }
            if (maxperBall.length === 0) {
                $row.find("input[data-key=\"MaxPerBall\"]").addClass("warning");
                error++;
            }
        }
        return error;
    };
    me.verifyInputData = function () {
        /*sportbook,Virtual sport,Keno*/
        /*reset*/
        var error = 0;

        var productCodes = ['#sb', '#vs', '#kn'];
        for (var i = 0; i < productCodes.length; i++) {
            if ($(productCodes[i] + "-area").length > 0) {
                /*reset*/
                var table = $(productCodes[i] + "-table");
                table.find("tbody input[data-key=\"MaxBet\"]").removeClass("warning");
                table.find("tbody input[data-key=\"MaxPerMatch\"]").removeClass("warning");
                if ($(productCodes[i] + "-copy").is(":checked")) {
                    var firstRow = table.find("tbody tr:eq(0)");
                    error += site.verifyBetSetting(firstRow);
                }
                else {
                    var rows = table.find("tbody tr");
                    var numOfRows = rows.length;
                    for (var j = 0; j < numOfRows; j++) {
                        error += site.verifyBetSetting($(rows[j]));
                    }
                }
            }
        }
        /*number game*/
        if ($("#ng-area").length > 0) {
            /*reset*/
            var ngtable = $("ng-table");
            ngtable.find("tbody input[data-key=\"MaxPerBall\"]").removeClass("warning");
            var ngrows = ngtable.find("tbody tr");
            var numOfNgRows = ngrows.length;
            for (var k = 0; k < numOfNgRows; k++) {
                error += verifyNumberBetSetting($(ngrows[k]));
            }
        }

        return error;
    };
    me.getInputValue = function (code) {
        var result = [];
        var rows = $("#" + code + "-table tbody tr");
        var numOfRows = rows.length;
        for (var i = 0; i < numOfRows; i++) {
            var $row = $(rows[i]);
            result.push({
                SportOrGame: {
                    Id: $row.attr("data-sport"),
                    Name: ""
                },
                MaxBet: $row.find("input[data-key=\"MaxBet\"]").val(),
                MaxPerMatch: $row.find("input[data-key=\"MaxPerMatch\"]").val(),
                MaxPerBall: code === "ng" ? $row.find("input[data-key=\"MaxPerBall\"]").val() : null,
                Bettype: $row.attr("data-bettype")
            });
        }
        return result;
    };
    me.createNewViewModel = function () {
        var viewModel =
            {
                Licensee: $("#licensee").val(),
                Currency: {
                    Id: $("#currency").val(),
                    Name: $("#currency").text()
                },
                AgentId: $("agent").val() === undefined ? null : $("agent").val(),
                Sportbook: site.getInputValue("sb"),
                NumberGame: site.getInputValue("ng"),
                VirtualSport: site.getInputValue("vs"),
                Keno: site.getInputValue("kn")
            };

        return viewModel;
    };
    return me;
})();