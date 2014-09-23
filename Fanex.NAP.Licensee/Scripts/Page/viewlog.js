/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/* exported  viewLog */
/* global site */
var viewLog = (function () {
    "use strict";
    var nodata = "Not found any records!";
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
                    else {
                        alert(nodata);
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