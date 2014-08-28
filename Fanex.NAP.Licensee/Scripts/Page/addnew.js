/* File Created: August 20, 2014 */
/* exported  addNew */
/* global MultiSelectControl */
var addNew = (function () {
    "use strict";

    var me = {};
    var initEvent = function () {
        var currencyTest = [];
        for (var i = 1; i < 15; i++) {
            var cur = {
                Id: i,
                Name: i + "USD",
                ParentId: 0


            };
            currencyTest.push(cur);
        }

        var currencyControllSetting = {
            ContainerId: "currency-control",
            IdProperty: "Id",
            NameProperty: "Name",
            ParentIdProperty: "ParentId",
            DefaultData: currencyTest,
            SelectedAllText: "All currencies",
            NoItemText: "None",
            SelectedText: "{0} selected",
            FilterEmptyText: "Please select currency!",
            IsFilterAllLevel: true

        };
        MultiSelectControl.renderControl(currencyControllSetting);
    };
    me.setup = function () {
        initEvent();
    };
    return me;
})();