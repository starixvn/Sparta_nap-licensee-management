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
    var copySetting = function (table, checkbox) {
        var firstRow = table.find("tbody tr:eq(0)");
        /*reset*/
        var error = 0;
        firstRow.find("input[data-key=\"MaxBet\"]").removeClass("warning");
        firstRow.find("input[data-key=\"MaxPerMatch\"]").removeClass("warning");
        /*copy*/
        var maxBet = firstRow.find("input[data-key=\"MaxBet\"]").val();
        var maxPerMatch = firstRow.find("input[data-key=\"MaxPerMatch\"]").val();

        if (!site.isNumber(maxBet) && maxBet.length > 0) {
            firstRow.find("input[data-key=\"MaxBet\"]").addClass("warning");
            error++;
        }

        if (!site.isNumber(maxPerMatch) && maxBet.length > 0) {
            firstRow.find("input[data-key=\"MaxPerMatch\"]").addClass("warning");
            error++;
        }

        if (error > 0) {
            checkbox.prop("checked", false);
            alert(dataErrMsg);
        }
        else {
            /*update*/

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

    /*public method*/
    me.setup = function () {
        initUI();
        initEvent();
    };

    return me;
})();