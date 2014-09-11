/// <reference path="/@JSense.js" />
/* File Created: August 20, 2014 */
/*exported editingSetting */
var editingSetting = (function () {
    "use strict";
    var me = {};
    /*private variable*/
    var dataErrMsg = "Input data is invalid";
    /*private method*/

    var createNewViewModel = function () {
        var viewModel =
            {
                Licensee: "",
                CurrencyItem: {
                    Id: 0,
                    Name: ""
                },
                AgentId: null,
                Sportbook: [],
                NumberGame: [],
                VirtualSport: [],
                Keno: []
            };
        return viewModel;
    };
    var initEvent = function () {
        $("#sb-area,#ng-area,#vs-area,#kn-area").click(function () {
            collapseorExpand($(this));
        });
        $("#copy-sb,#copy-vs,#copy-kn").click(function () {

            var isCheck = $(this).is(":checked");
            var table = $($(this).attr("data-key"));
            if (isCheck) {
                copySetting(table);
                enableOrDisable(table, false);
            } else {
                enableOrDisable(table, true);
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
    var copySetting = function (table) {
        var firstRow = table.find("tbody tr:eq(0)");
        var maxBet = firstRow.find("input[data-key=\"MaxBet\"]").val();
        var maxPerMatch = firstRow.find("input[data-key=\"MaxPerMatch\"]").val();
        if (!site.isNumber(maxBet)) {
            firstRow.find("input[data-key=\"MaxBet\"]").addClass("warning");
            alert(dataErrMsg);
            return;
        }

        if (!site.isNumber(maxPerMatch)) {

            alert(dataErrMsg);
            firstRow.find("input[data-key=\"MaxPerMatch\"]").addClass("warning");
            return;
        }
        /*update*/
        table.find("input[data-key=\"MaxBet\"]").val(maxBet);
        table.find("input[data-key=\"MaxPerMatch\"]").val(maxPerMatch);

    };
    var enableOrDisable = function (table, enable) {
        if (enable) {
            $(table).find("input").removeAttr("disabled");
        } else {
            $(table).find("input").attr("disabled", "disabled");
        }
    };

    /*public method*/
    me.setup = function () {
        initEvent();
    };

    return me;
})();