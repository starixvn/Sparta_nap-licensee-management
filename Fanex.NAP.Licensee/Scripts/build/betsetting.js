/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/* exported  addNew */
/* global site */
var addNew = (function () {
    "use strict";
    var noneTemplate = "No found any templates";
    var notAllBlankFiled = "Please enter at least one sport setting";
    var me = {};
    var initUI = function () {
        invokeLoadingMsg(true);
        site.renderLicenseeList(1, function () {
            site.renderSingleCurrencyList(function () {
                if ($("#licensee option").length > 0 && $("#licensee option").length > 0) {
                    var licensee = $("#licensee").val();
                    var currency = $("#currency").val();
                    site.renderSingleAgentList(licensee, currency,
                 function () {
                     invokeLoadingMsg(false);
                 });
                } else {
                    invokeLoadingMsg(false);
                    setGenerateButtonStatus(true);
                }
            });
        });
    };
    var initEvent = function () {
        $(".btn-back").on("click", function () {
            site.backToList();
        });
        $("#licensee,#currency").change(function () {
            invokeLoadingMsg(true);
            var licensee = $("#licensee").val();
            var currency = $("#currency").val();
            site.renderSingleAgentList(licensee, currency,
                 function () {
                     invokeLoadingMsg(false);
                 });
        });
        $("body").on("click", "#sb-area,#ng-area,#vs-area,#kn-area", function (event) {
            event.preventDefault();

            site.collapseorExpand($(this));
        });
        site.registerCopySettingEvent();
        $("body").on("click", "#copy-sb,#copy-vs,#copy-kn", function () {
            var isCheck = $(this).is(":checked");
            var table = $($(this).attr("data-key"));
            if (isCheck) {
                site.copySetting(table, $(this));
            } else {
                site.enableOrDisable(table, true);
            }
        });

        $("#btn-loadtemplate").click(function () {
            $("#template-content").html("");
            setFooterControlStatus(false);
            var criteria = {
                Licensee: $("#licensee").val(),
                CurrencyID: $("#currency").val(),
                AgentID: $("#agent").val() === '' ? null : $("#agent").val()
            };
            $.ajax({
                type: "POST",
                url: window.rootUrl + "BetSetting/LoadTeamplate",
                data: criteria,
                datatype: "html",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                beforeSend: function () {
                    invokeLoadingMsg(true);
                },
                error: function () {
                    invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                },
                success: function (data) {
                    var template = $.parseHTML(data);
                    if (template.length > 1) {
                        var hasSetting = template[0].value;

                        if (hasSetting !== undefined && hasSetting.toLowerCase() === "true") {
                            goToEditingPage(criteria);
                        } else {
                            $("#template-content").html(data);

                            setFooterControlStatus(true);
                            /*format number*/
                            $('table.table tbody input[type="text"].txt-max').number(true, 0);
                        }
                    }
                    else {
                        alert(noneTemplate);
                    }
                    invokeLoadingMsg(false);
                }
            });
        });

        /*insert*/
        $("#btn-submit").click(function (event) {
            event.preventDefault();
            var isValid = site.verifyInputData() === 0;
            if (isValid) {
                if (hasInputValues()) {
                    var criteria = site.createNewViewModel();

                    $.ajax({
                        type: "POST",
                        url: window.rootUrl + "BetSetting/AddNew",
                        data: JSON.stringify(criteria),
                        datatype: "json",
                        contentType: "application/json; charset=utf-8",
                        cache: false,
                        beforeSend: function () {
                            invokeLoadingMsg(true);
                        },
                        success: function (data) {
                            invokeLoadingMsg(false);
                            if (data.IsOk) {
                                alert(site.requestSuccess);
                            }
                            else {
                                alert(data.Message);
                            }
                        },
                        error: function () {
                            invokeLoadingMsg(false);
                            alert(site.requestErrMsg);
                        }
                    });
                }
                else {
                    alert(notAllBlankFiled);
                }
            } else {
                alert(site.dataErrMsg);
            }
        });
    };
    var goToEditingPage = function (criteria) {
        $("#confirm-box").removeClass("hidden");
        $("#confirm-box").dialog({
            resizable: false,
            height: 200,
            width: 420,
            modal: true,
            buttons: {
                "OK": {
                    text: 'Yes',
                    'class': 'btn-primary btn-ok',
                    click: function () {
                        $(this).dialog("close");
                        location.href = window.rootUrl + "BetSetting/Edit?licensee=" + criteria.Licensee
                        + "&currencyId=" + criteria.CurrencyID + "&agentid=" + criteria.AgentID;
                    }
                },
                Cancel: {
                    text: 'No',
                    'class': 'btn-red',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            }
        });
    };
    var hasInputValues = function () {
        var items = $('table.table tbody input[type="text"].txt-max');
        var count = 0;
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).val()) {
                count++;
            }
        }
        return count > 0;
    };
    /*private UI function*/
    var setGenerateButtonStatus = function (disable) {
        if (disable) {
            $("#btn-loadtemplate,#btn-submit").attr("disabled", "disabled");
        } else {
            $("#btn-loadtemplate,#btn-submit").removeAttr("disabled");
        }
    };

    var invokeLoadingMsg = function (visible) {
        if (visible) {
            if ($("#loadingMsgBox").is(":hidden")) {
                $("#loadingMsgBox").removeClass("hidden");
                setGenerateButtonStatus(true);
            }
        }
        else {
            $("#loadingMsgBox").addClass("hidden");
            setGenerateButtonStatus(false);
        }
    };
    var setFooterControlStatus = function (visible) {
        if (visible) {
            if ($("#footer-control").is(":hidden")) {
                $("#footer-control").removeClass("hidden");
            }
        }
        else {
            $("#footer-control").addClass("hidden");
        }
    };
    me.setup = function () {
        initUI();
        initEvent();
    };
    return me;
})();
﻿/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/*exported defaultSetting */
/* global site */

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
        autoResizeColumn: true, showHighlightRow: false
    };
    var actionLinkTpl = "<a href=" + window.rootUrl + "BetSetting/Edit?licensee={lic}&currencyId={cur}&agentid={agt} class='icon-edit'></a>";

    var currencyListControl;
    var currentGrid;
    var currentSelectedCurrency = "";
    var currentSelectedLicensee;
    var showSB = false;
    var showNG = false;
    var showVS = false;
    var showKN = false;
    /*end-private variable*/
    /*private method*/
    var updateFilterControl = function () {
        $("#showSB").prop("checked", showSB);
        $("#showNG").prop("checked", showNG);
        $("#showVS").prop("checked", showVS);
        $("#showKN").prop("checked", showKN);
    };
    var initEvent = function () {
        $("#generate").click(function (event) {
            event.preventDefault();
            invokeGenerateButton();
        });
    };
    /* page function*/
    var invokeGenerateButton = function () {
        site.invokeErrMsg(false);
        currentSelectedCurrency = currencyListControl.getParentFilterId();
        currentSelectedLicensee = $("#licensee").val();
        showSB = $("#showSB").is(":checked");
        showNG = $("#showNG").is(":checked");
        showVS = $("#showVS").is(":checked");
        showKN = $("#showKN").is(":checked");

        if (!isValidInput()) {
            site.invokeErrMsg(true);
            return;
        }

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

    var invokeLoadingMsg = function (visible) {
        if (visible) {
            if ($("#loadingMsgBox").is(":hidden")) {
                $("#loadingMsgBox").removeClass("hidden");
                setGenerateButtonStatus(true);
            }
        }
        else {
            $("#loadingMsgBox").addClass("hidden");
            setGenerateButtonStatus(false);
        }
    };
    var generateActionLink = function (licensee, currencyId, agentId) {
        return actionLinkTpl.replace(/{lic}/g, licensee).replace(/{cur}/g, currencyId).replace(/{agt}/g, agentId);
    };
    /* load data*/
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
            beforeSend: function () {
                invokeLoadingMsg(true);
            },
            success: function (data) {
                gridOptions.bodyRows = converDataToFanexGridFormat(data);
                currentGrid = $("#gridId").fanexGrid(gridOptions);
                invokeLoadingMsg(false);
            },
            error: function () {
                invokeLoadingMsg(false);
                alert(site.requestErrMsg);
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
        var actionMerRowNumber = 0;
        for (var index = 0; index < numberRows; index++) {
            var currentColumms = [];
            if (licenseeMerRowNumber === 0) {
                licenseeMerRowNumber = countItemInArray([{ "Key": "Licensee", "Value": data[index]["Licensee"]}], index, data);

                currentColumms.push({ Name: "Licensee", Value: data[index]["Licensee"], MergeRowNumber: licenseeMerRowNumber });
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
                    MergeRowNumber: agentMerRowNumber
                });
            }
            currentColumms = currentColumms.concat([
                    { Name: "SportGameType", Value: data[index]["SportGameType"] === null ? data[index]["SportGameType"] : data[index]["SportGameType"].toLocaleString('en') },
                    { Name: "MaxBet", Value: data[index]["MaxBet"] === null ? data[index]["MaxBet"]: data[index]["MaxBet"].toLocaleString('en')},
                    { Name: "MaxPerMatch", Value: data[index]["MaxPerMatch"] === null ? data[index]["MaxPerMatch"] : data[index]["MaxPerMatch"].toLocaleString('en') },
                    { Name: "MaxPerBall", Value: data[index]["MaxPerBall"] === null ? data[index]["MaxPerBall"] : data[index]["MaxPerBall"].toLocaleString('en') }
                ]);

            if (actionMerRowNumber === 0) {
                actionMerRowNumber = agentMerRowNumber;
                currentColumms.push({ Name: "Action", Value: generateActionLink(data[index]["Licensee"], data[index]["CurrencyID"], data[index]["AgentID"]),
                    MergeRowNumber: actionMerRowNumber
                });
            }
            rows.push(
            {
                Columns: currentColumms,
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
            if (actionMerRowNumber > 0) {
                actionMerRowNumber--;
            }
        }
        return rows;
    };
    /*end-load data*/
    /*end-page function*/

    /*end-private method*/
    me.setup = function () {
        initEvent();
        currencyListControl = site.renderCurrencyList(currentSelectedCurrency);
        site.renderLicenseeList(currentSelectedLicensee);
        updateFilterControl();
    };

    return me;
})();
﻿/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/*exported editingSetting */
/* global site */
var editingSetting = (function () {
    "use strict";
    var me = {};

    /*private method*/
    /*private UI method*/
    var setGenerateButtonStatus = function (disable) {
        if (disable) {
            $("#btn-submit").attr("disabled", "disabled");
        } else {
            $("#btn-submit").removeAttr("disabled");
        }
    };

    var invokeLoadingMsg = function (visible) {
        if (visible) {
            if ($("#loadingMsgBox").is(":hidden")) {
                $("#loadingMsgBox").removeClass("hidden");
                setGenerateButtonStatus(true);
            }
        }
        else {
            $("#loadingMsgBox").addClass("hidden");
            setGenerateButtonStatus(false);
        }
    };

    /*end-private UI method*/

    var initUI = function () {
        /*format number*/
        $('table.table tbody input[type="text"].txt-max').number(true, 0);
    };
    var initEvent = function () {
        $(".btn-back").on("click", function () {
            site.backToList();
        });
        $("#sb-area,#ng-area,#vs-area,#kn-area").click(function () {
            site.collapseorExpand($(this));
        });
        $("body").on("click", "#copy-sb,#copy-vs,#copy-kn", function () {
            var isCheck = $(this).is(":checked");
            var table = $($(this).attr("data-key"));
            if (isCheck) {
                site.copySetting(table, $(this));
            } else {
                site.enableOrDisable(table, true);
            }
        });
        site.registerCopySettingEvent();

        $("#btn-submit").click(function (event) {
            event.preventDefault();
            var isValid = site.verifyInputData() === 0;
            if (isValid) {
                var criteria = site.createNewViewModel();
                $.ajax({
                    type: "POST",
                    url: window.rootUrl + "BetSetting/Edit",
                    data: JSON.stringify(criteria),
                    datatype: "json",
                    contentType: "application/json; charset=utf-8",
                    cache: false,
                    beforeSend: function () {
                        invokeLoadingMsg(true);
                    },
                    success: function (data) {
                        invokeLoadingMsg(false);
                        if (data.IsOk) {
                            alert(site.requestSuccess);
                        }
                        else {
                            alert(data.Message);
                        }
                    },
                    error: function () {
                        invokeLoadingMsg(false);
                        alert(site.requestErrMsg);
                    }
                });
            } else {
                alert(site.dataErrMsg);
            }
        });
    };

    /*public method*/
    me.setup = function () {
        initUI();
        initEvent();
    };

    return me;
})();
﻿/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/* exported  viewLog */
/* global site */
var viewLog = (function () {
    "use strict";
    var me = {};
    /*private function*/
    var setGenerateButtonStatus = function (disable) {
        if (disable) {
            $("#generate").attr("disabled", "disabled");
        } else {
            $("#generate").removeAttr("disabled");
        }
    };

    var invokeLoadingMsg = function (visible) {
        if (visible) {
            if ($("#loadingMsgBox").is(":hidden")) {
                $("#loadingMsgBox").removeClass("hidden");
                setGenerateButtonStatus(true);
            }
        }
        else {
            $("#loadingMsgBox").addClass("hidden");
            setGenerateButtonStatus(false);
        }
    };
    var initEvent = function () {
        $(".btn-back").on("click", function () {
            site.backToList();
        });
        $("#to-date,#from-date").datepicker();
        $("#table-toggle").click(function () {
            if ($(this).hasClass("icon-collapse-all")) {
                $(this).addClass("icon-expand-all").removeClass("icon-collapse-all");
                $(".child-setting").show();
            } else {
                $(this).addClass("icon-collapse-all").removeClass("icon-expand-all");
                $(".child-setting").hide();
            }
        });

        $("body").on("click", ".table-title", function (event) {
            event.preventDefault();

            $(this).next().toggle();
        });
        $("#licensee,#currency").change(function () {
            invokeLoadingMsg(true);
            var licensee = $("#licensee option:selected").text();
            var currency = $("#currency").val();
            site.renderSingleAgentList(licensee, currency,
                 function () {
                     invokeLoadingMsg(false);
                 });
        });
        $("#generate").click(function (event) {
            event.preventDefault();
            var container = $("#table-content tbody");
            container.html("");
            var criteria = {
                LicenseeID: $("#licensee").val(),
                CurrencyID: $("#currency").val(),
                AgentID: $("#agent").val() === '' ? null : $("#agent").val(),
                FromDate: $.datepicker.formatDate('mm/dd/yy', $("#from-date").datepicker('getDate')),
                ToDate: $.datepicker.formatDate('mm/dd/yy', $("#to-date").datepicker('getDate'))
            };
            $.ajax({
                type: "POST",
                url: window.rootUrl + "BetSetting/Logs",
                data: criteria,
                datatype: "html",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                beforeSend: function () {
                    invokeLoadingMsg(true);
                },
                error: function () {
                    invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                },
                success: function (data) {
                    if (data.length > 1) {
                        container.html(data);
                        $("body .child-setting").toggle();
                    }

                    invokeLoadingMsg(false);
                }
            });
        });
    };
    var initUI = function () {
        /* render licensee*/
        invokeLoadingMsg(true);
        $.getJSON(window.rootUrl + "BetSetting/GetLicenseeList", function (data) {
            var items = "";
            for (var i = 0; i < data.length; i++) {
                items += "<option value=\"" + data[i].Id + "\">" + data[i].Name + "</option>";
            }

            $("#licensee").html(items);
            site.renderSingleCurrencyList(function () {
                if ($("#licensee option").length > 0 && $("#licensee option").length > 0) {
                    var licensee = $("#licensee option:selected").text();
                    var currency = $("#currency").val();
                    site.renderSingleAgentList(licensee, currency,
                 function () {
                     invokeLoadingMsg(false);
                 });
                } else {
                    invokeLoadingMsg(false);
                    setGenerateButtonStatus(true);
                }
            });
        });
    };
    /* public funtion*/
    me.setup = function () {
        initUI();
        initEvent();
    };
    return me;
})();