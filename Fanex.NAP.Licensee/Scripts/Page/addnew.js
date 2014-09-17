/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/* exported  addNew */
/* global site */
var addNew = (function () {
    "use strict";
    var noneTemplate = "No found any templates";
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

                    var hasSetting = template[0].value;

                    if (hasSetting !== undefined && hasSetting.toLowerCase() === "true") {
                        goToEditingPage(criteria);
                    } else {
                        $("#template-content").html(data);
                        if (template.length > 1) {
                            setFooterControlStatus(true);
                        } else {
                            alert(noneTemplate);
                        }
                    }

                    invokeLoadingMsg(false);
                }
            });
        });

        /*insert*/
        $("#btn-submit").click(function () {
        
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