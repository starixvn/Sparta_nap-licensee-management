/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/*exported editingSetting */
/* global site */
var editingSetting = (function () {
    "use strict";
    var me = {};
    /*private variable*/
    var dataErrMsg = "Input data is invalid";
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
    var copySetting = function (table, checkbox) {
        var firstRow = table.find("tbody tr:eq(0)");
        /*reset*/
        var error = 0;
        firstRow.find("input[data-key=\"MaxBet\"]").removeClass("warning");
        firstRow.find("input[data-key=\"MaxPerMatch\"]").removeClass("warning");
        /*copy*/
        error = site.verifyBetSetting(firstRow);

        if (error > 0) {
            checkbox.prop("checked", false);
            alert(dataErrMsg);
        }
        else {
            /*update*/
            var maxBet = firstRow.find("input[data-key=\"MaxBet\"]").val();
            var maxPerMatch = firstRow.find("input[data-key=\"MaxPerMatch\"]").val();

            table.find("input[data-key=\"MaxBet\"]").val(maxBet);
            table.find("input[data-key=\"MaxPerMatch\"]").val(maxPerMatch);

            enableOrDisable(table, false);
        }
    };
    var enableOrDisable = function (table, enable) {
        if (enable) {
            $(table).find("input").removeAttr("disabled");
        } else {
            $(table).find("input").attr("disabled", "disabled");
        }
    };

    /*end-private UI method*/

    var initUI = function () {
        /*format number*/
        $('table.table tbody input[type="text"].txt-max').number(true, 2);
    };
    var initEvent = function () {
        $("#sb-area,#ng-area,#vs-area,#kn-area").click(function () {
            collapseorExpand($(this));
        });
        $("#copy-sb,#copy-vs,#copy-kn").click(function () {
            var isCheck = $(this).is(":checked");
            var table = $($(this).attr("data-key"));
            if (isCheck) {
                copySetting(table, $(this));
            } else {
                enableOrDisable(table, true);
            }
        });
        $("#btn-submit").click(function (event) {
            event.preventDefault();
            var isValid = site.verifyInputData() === 0;
            if (isValid) {
                var criteria = site.createNewViewModel();
                console.log(criteria);
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
                            alert("Successful");
                        }
                        else {
                            alert(data.Message);
                        }
                    },
                    error: function () {
                        invokeLoadingMsg(false);
                        alert("Error requesting page");
                    }
                });
            } else {
                alert(dataErrMsg);
            }
        });
    };

    /*UI function*/

    var collapseorExpand = function (root) {
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

    /*public method*/
    me.setup = function () {
        initUI();
        initEvent();
    };

    return me;
})();