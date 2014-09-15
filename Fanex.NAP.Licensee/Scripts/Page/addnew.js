/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/* exported  addNew */
/* global site */
var addNew = (function () {
    "use strict";

    var me = {};
    var initUI = function () {
        site.renderLicenseeList(1);
        site.renderSingleCurrencyList();
    };
    var initEvent = function () {
    };
    /*private UI function*/
//    var setGenerateButtonStatus = function (disable) {
//        if (disable) {
//            $("#generate").attr("disabled", "disabled");
//        } else {
//            $("#generate").removeAttr("disabled");
//        }
//    };

//    var invokeLoadingMsg = function (visible) {
//        if (visible) {
//            if ($("#loadingMsgBox").is(":hidden")) {
//                $("#loadingMsgBox").removeClass("hidden");
//                setGenerateButtonStatus(true);
//            }
//        }
//        else {
//            $("#loadingMsgBox").addClass("hidden");
//            setGenerateButtonStatus(false);
//        }
//    };
    me.setup = function () {
        initUI();
        initEvent();
    };
    return me;
})();