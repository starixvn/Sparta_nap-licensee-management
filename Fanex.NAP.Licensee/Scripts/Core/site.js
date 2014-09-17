/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/*exported site */
/* global MultiSelectControl */
var site = (function () {
    "use strict";
    var me = {};
    me.dataErrMsg = "Input data is invalid.";
    me.requestErrMsg = "Error requesting page.";
    me.requestSuccess = "Successful";
    /* filter componenet*/
    me.renderSingleAgentList = function (licensee, currency, callback) {
        $.getJSON(window.rootUrl + "BetSetting/GetAgents?Licensee=" + licensee + "&currencyid=" + currency, function (data) {
            var items = "";
            for (var i = 0; i < data.length; i++) {
                items += "<option value=\"" + data[i].Id + "\">" + data[i].Name + "</option>";
            }

            $("#agent").html(items);
            if (callback !== undefined && callback !== null) {
                callback();
            }
        });
    };
    me.renderSingleCurrencyList = function (callback) {
        $.getJSON(window.rootUrl + "BetSetting/GetCurrencyList", function (data) {
            var items = "";
            for (var i = 0; i < data.length; i++) {
                items += "<option value=\"" + data[i].Id + "\">" + data[i].Name + "</option>";
            }

            $("#currency").html(items);
            if (callback !== undefined && callback !== null) {
                callback(arguments[0], arguments[1]);
            }
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

    me.renderLicenseeList = function (currentSelectedLicensee, callback) {
        $.getJSON(window.rootUrl + "BetSetting/GetLicenseeList", function (data) {
            var items = "";
            for (var i = 0; i < data.length; i++) {
                var selected = data[i].Name.toLowerCase() === currentSelectedLicensee ? "selected = \"selected\"" : "";
                items += "<option " + selected + " value=\"" + data[i].Name + "\">" + data[i].Name + "</option>";
            }

            $("#licensee").html(items);
            if (callback !== undefined && callback !== null) {
                callback();
            }
        });
    };
    /* end-filter componenet*/

    /*Functions: verifing template*/
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
    /*End-Functions: verifing template*/

    /*UI function*/
    me.copySetting = function (table, checkbox) {
        var firstRow = table.find("tbody tr:eq(0)");
        /*reset*/
        var error = 0;
        firstRow.find("input[data-key=\"MaxBet\"]").removeClass("warning");
        firstRow.find("input[data-key=\"MaxPerMatch\"]").removeClass("warning");
        /*copy*/
        error = site.verifyBetSetting(firstRow);

        if (error > 0) {
            checkbox.prop("checked", false);
            alert(site.dataErrMsg);
        }
        else {
            /*update*/
            var maxBet = firstRow.find("input[data-key=\"MaxBet\"]").val();
            var maxPerMatch = firstRow.find("input[data-key=\"MaxPerMatch\"]").val();

            table.find("input[data-key=\"MaxBet\"]").val(maxBet);
            table.find("input[data-key=\"MaxPerMatch\"]").val(maxPerMatch);

            site.enableOrDisable(table, false);
        }
    };
    me.enableOrDisable = function (table, enable) {
        if (enable) {
            $(table).find("input").removeAttr("disabled");
        } else {
            $(table).find("input").attr("disabled", "disabled");
        }
    };

    me.collapseorExpand = function (root) {
        if (root.length <= 0)
        { return; }
        var icon = root.find("i[data-key=\"area-icon\"]");
        var content = root.next("div[data-key=\"area-content\"]");
        var isExpanded = icon.hasClass("icon-collapse");
        if (isExpanded) {
            icon.addClass("icon-expand").removeClass("icon-collapse");
            content.slideUp();
        }
        else {
            icon.addClass("icon-collapse").removeClass("icon-expand");
            content.slideDown();
        }
    };
    /*End-UI function*/

    me.createNewViewModel = function () {
        var viewModel =
            {
                Licensee: $("#licensee").val(),
                Currency: {
                    Id: $("#currency").val(),
                    Name: $("#currency").text()
                },
                Agent:
                {
                    Id: $("#agent").val() === '' ? null : $("#agent").val(),
                    Name: $("#agent").text()
                },
                Sportbook: site.getInputValue("sb"),
                NumberGame: site.getInputValue("ng"),
                VirtualSport: site.getInputValue("vs"),
                Keno: site.getInputValue("kn")
            };

        return viewModel;
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
    me.backToList = function () {
        location.href = window.rootUrl + "BetSetting/Default";

        return false;
    };
    return me;
})();