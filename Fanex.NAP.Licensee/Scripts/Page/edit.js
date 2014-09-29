/// <reference path="/@JSense.js" />
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
        $('table.table tbody input[type="text"].txt-max').number(true, 2);
    };
    var initEvent = function () {
        $(".btn-back").on("click", function () {
            site.backToList();
        });
        $("#sb-area,#ng-area,#vs-area,#kn-area").click(function () {
            site.collapseorExpand($(this));
        });
        $("#copy-sb,#copy-vs,#copy-kn").click(function () {
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