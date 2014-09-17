/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/* exported  viewLog */
/* global site */
var viewLog = (function () {
    "use strict";
    var me = {};
    var initEvent = function () {
        $(".btn-back").on("click", function () {
            site.backToList();
        });
        $("#to-date,#from-date").datepicker();
    };
    me.setup = function () {
        initEvent();
    };
    return me;
})();