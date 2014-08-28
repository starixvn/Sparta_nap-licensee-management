/* File Created: August 20, 2014 */
/* exported  viewLog */
var viewLog = (function () {
    "use strict";
    var me = {};
    var initEvent = function () {
        $("#to-date,#from-date").datepicker();
    };
    me.setup = function () {
        initEvent();
    };
    return me;
})();