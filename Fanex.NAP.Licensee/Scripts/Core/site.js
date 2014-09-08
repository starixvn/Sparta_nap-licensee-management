/* File Created: August 20, 2014 */
/*exported site */
/* global MultiSelectControl */
var site = (function () {
    "use strict";
    var me = {};

    me.renderCurrencyList = function () {
        var currencyControl = new MultiSelectControl();

        $.getJSON(window.rootUrl + "BetSetting/GetCurrencyList", function (data) {

            var currencies = [];
            for (var i = 1; i < data.length; i++) {
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

    me.renderLicenseeList = function () {
        $.getJSON(window.rootUrl + "BetSetting/GetLicenseeList", function (data) {
            var items = "";
            for (var i = 1; i < data.length; i++) {
                items += "<option value=\"" + data[i].Name + "\">" + data[i].Name + "</option>";
            }

            $("#licensee").html(items);
        });

    };
    return me;
})();