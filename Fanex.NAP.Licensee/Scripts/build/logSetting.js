(function () {
    'use strict';

    var logSettingsApp = logSettingsApp || {};

    logSettingsApp = angular.module('logSettingsApp',
        ['ngRoute', 'ngAnimate', 'fanex.dropdowntreesingle']);

    logSettingsApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }]);
})();
﻿var logConfig = (function () {

    var me = {};

    me.itemsMapping = [
        {
            ActionIds: "5574,5575,12,13,14,15,16,17",
            Configs: [
                {
                    Alias: "R",
                    Item: "Information"
                },
                {
                    Alias: "ExistingPlayers",
                    Item: "Existing Players"
                },
                {
                    Alias: "NewPlayers",
                    Item: "New Players"
                },
                {
                    Alias: "BL",
                    Item: "Bet Setting"
                },
                {
                    Alias: "MinBet",
                    Item: "Min Bet"
                },
                {
                    Alias: "MaxBet",
                    Item: "Max Bet"
                },
                {
                    Alias: "MaxPerMatch",
                    Item: "Max Per Match"
                },
                {
                    Alias: "MaxPerBall",
                    Item: "Max Per Ball"
                },
                {
                    Alias: "MaxPayoutPerMatch",
                    Item: "Max Payout Per Match"
                }
            ]
        }
    ];

    me.itemsIgnore = [
        {
            ActionIds: "5574,5575,12,13,14,15,16,17",
            Items: [
                "UserID",
                "IP",
                "CurrencyID",
                "Language",
                "Option",
                "SportType",
                "Bettype",
                "ErrMsg",
                "ErrCode"
            ]
        }
    ]

    return me;
})();
﻿
var logSettings = (function () {
    "use strict";

    var itemsMapping = logConfig.itemsMapping;
    var itemsIgnore = logConfig.itemsIgnore;

    var mimeType = 'application/xml';

    var me = {};

    // Function: init log setting
    var getAttributeFromNode = function (xmlNode) {
        var panel = xmlNode.nodeName;
        var content = [];
        $.each(xmlNode.attributes, function (index, attribute) {
            content.push({
                key: attribute.name,
                value: attribute.value
            });
        });

        return content.length === 0 ? undefined : { panel: panel, content: content };
    };

    var initLogSetting = function (setting) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(setting, mimeType);

        var settings = [
            // { panel, content }
        ];

        // set root data
        var rootNode = doc.firstChild;
        var attrs = getAttributeFromNode(rootNode);
        if (attrs !== undefined) {
            settings.push(attrs);
        }

        // set childs data
        if (rootNode.children.length > 0) {
            $.each(rootNode.children, function (index, xmlNode) {
                var childAttrs = getAttributeFromNode(xmlNode);

                if (childAttrs !== undefined) {
                    settings.push(childAttrs);
                }
            });
        }

        return settings;
    };
    // End-Function: init log setting

    // Function: replace setting names
    var replaceSettingNames = function (settings, actionId) {
        var config = itemsMapping.find(function (item) {
            return item.ActionIds.split(',').includes(actionId.toString());
        });

        if (config === undefined) return;

        if (config !== null) {
            $.each(settings, function (index, setting) {
                setting.panel = replacePropertyName(setting.panel, config.Configs);
                $.each(setting.content, function (index, value) {
                    value.key = replacePropertyName(value.key, config.Configs);
                });
            });
        }
    };

    var replacePropertyName = function (propertyName, configs) {
        var config = configs.find(function (item) {
            return item.Alias === propertyName;
        });

        if (config !== undefined) {
            propertyName = config.Item;
        }

        return propertyName;
    };
    // End-Function: replace setting names

    // Function: ignore properties
    var ignoreProperties = function (settings, actionId) {
        var item = itemsIgnore.find(function (value) {
            return value.ActionIds.split(',').includes(actionId.toString());
        });

        if (item === undefined) return;
        $.each(settings, function (index, setting) {
            setting.content = removeItems(setting.content, item.Items);
        });
    }

    var removeItems = function (array, items) {
        return array.filter(function (item) {
            return !items.includes(item.key);
        });
    }
    // End-Function: ignore properties

    me.formatData = function (xml, actionId, callBackFunc) {

        if (xml === null) {
            return undefined;
        }

        var settings = initLogSetting(xml);

        if (callBackFunc != undefined) {
            callBackFunc(settings);
        }

        ignoreProperties(settings, actionId);
        replaceSettingNames(settings, actionId);

        return settings;
    }

    // Function: create table data
    me.createTable = function (oldData, newData) {
        var detailContent = '';

        var rootData = oldData !== undefined ? oldData : newData;

        $.each(rootData, function (index, value) {
            var oldValue = oldData === undefined ? undefined : oldData[index];
            var newValue = newData === undefined ? undefined : newData[index];

            if (index === 0 || !compareSetting(oldValue, newValue)) {
                var table = '<table class="log-data-table">';

                table += createPanel(value.panel);
                table += createContentSetting(value, newValue);

                table += '</table>';

                detailContent += table;
            }
        })

        return detailContent;
    }

    var compareSetting = function (oldValue, newValue) {
        var isSame = true;

        if (oldValue === undefined || newValue === undefined || oldValue.content.length !== newValue.content.length) {
            return false;
        } else {
            oldValue.content.forEach(function (oldObj) {
                var index = newValue.content.findIndex(function (newObj) {
                    return newObj.key === oldObj.key && newObj.value === oldObj.value;
                });

                if (index === -1) {
                    isSame = false;
                }
            })
        }

        return isSame;
    }

    var createPanel = function (panel) {
        return '<tr class="panel-setting"><td class="log-panel" colSpan="6">' + panel + '</td></tr>';
    }

    var isNumeric = function (str) {
        if (typeof str != 'string') return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    var addCommas = function (nStr) {
        var number = parseFloat(nStr);

        return number.toLocaleString("en-US");;
    }

    var getContentValue = function (value) {
        return isNumeric(value) ? addCommas(value) : value;
    }

    var createContentColumn = function (obj, newObj) {
        var div = $('<div>')
        var td = $('<td>');

        td.addClass('log-value');
        if (newObj !== undefined && newObj.value !== obj.value) {

            if (obj.value === ' ') {
                td.append('<span>' + getContentValue(newObj.value) + '</span>');
            } else if (newObj.value == ' ') {
                td.append('<span>' + getContentValue(obj.value) + '</span>');
            } else {
                td.addClass('highlight-content');

                td.append('<span class="new-value">' + getContentValue(newObj.value) + '</span>');
                td.append('<br>');
                td.append('<span class="old-value">' + getContentValue(obj.value) + '</span>');
            }
        } else {
            td.append('<span>' + getContentValue(obj.value) + '</span>');
        }
        div.append(td);

        return div.html();
    }

    var createEmptyColumn = function (length) {
        var emptySetting = '';
        for (var i = 0; i < length; i++) {
            emptySetting += '<td class="log-title"></td><td class="log-value"></td>';
        }

        return emptySetting;
    }

    var createContentSetting = function (value, newValue) {
        var maxColumnsInline = 6;
        var countObj = 0;
        var contentSetting = '';
        var contentLength = value.content.length;
        var tr = '<tr class="content-setting">';

        $.each(value.content, function (index, item) {
            countObj += 1;
            tr += '<td class="log-title">' + item.key + '</td>';

            var newItem = undefined;
            if (newValue !== undefined) {
                newItem = newValue.content.find(function (i) {
                    return i.key === item.key;
                });
            };

            tr += createContentColumn(item, newItem);
            if (countObj % (maxColumnsInline / 2) === 0 || index === contentLength - 1) {
                if (countObj % (maxColumnsInline / 2) !== 0) {
                    var length = maxColumnsInline / 2 - countObj % (maxColumnsInline / 2);
                    tr += createEmptyColumn(length);
                }

                tr += '</tr>';
                contentSetting += tr;
                tr = '<tr class="content-setting">';
            }
        });

        return contentSetting;
    }

    // End-Function: create table data

    return me;
})();
﻿(function () {
    'use strict';

    angular.module('logSettingsApp').controller('dbsLogCtrl', dbsLogCtrl);

    dbsLogCtrl.$inject = ['$http', 'logService'];

    function dbsLogCtrl($http, logService) {
        var vm = this;

        vm.criteria = {};
        vm.formData = {};

        vm.gridOptions = logService.configGridOptions();

        function setSportNames(arr) {
            $.each(arr, function (index, settings) {
                if (index > 0 && settings !== null) {
                    var sportTypeId = settings.content[0].value;
                    var betTypeId = settings.content[1].value;

                    var length = vm.SportNames.Keys.length;
                    for (var i = 0; i < length; i++) {
                        if (sportTypeId == vm.SportNames.Keys[i].SportTypeId && betTypeId == vm.SportNames.Keys[i].BetTypeId) {
                            settings.content.unshift({
                                key: 'Sport/Game',
                                value: vm.SportNames.Values[i]
                            })
                        }
                    }
                }
            });
        }

        function getNormalizedFilter() {
            return {
                LicenseeId: isNull(vm.criteria.Licensee.Id, -1),
                CustId: isNull(vm.criteria.SuperWithCurrency.Id, -1),
                AgentId: vm.criteria.Agent.Id,
                FromDate: logService.formatDateString(vm.criteria.FromDate),
                ToDate: logService.formatDateString(vm.criteria.ToDate),
            }
        }

        function isNull(value, defaultValue) {
            return value !== null ? value : defaultValue;
        }

        function getReport() {
            logService.invokeLoadingMsg(true);
            $http.get('GetReport', { params: vm.formData })
                .success(function (data) {
                    logService.handleLogData(data, setSportNames);
                    vm.report = data;
                    logService.invokeLoadingMsg(false);
                })
                .error(function (data) {
                    logService.invokeLoadingMsg(false);
                    alert(data);
                });
        }

        vm.selectedLicenseeChange = function () {
            logService.getSelectedLicenseeChange(vm);
        };

        vm.selectedSuperWithCurrencyChange = function () {
            logService.getSelectedSuperWithCurrencyChange(vm);
        }

        vm.getReport = function () {;
            vm.formData = getNormalizedFilter();

            getReport();
        }


        function initialize() {
            logService.getSettings(vm);
        }

        initialize();
    }
})();

﻿(function () {
    'use strict';

    angular.module('logSettingsApp').controller('licenseeBetSettingLogCtrl', licenseeBetSettingLogCtrl);

    licenseeBetSettingLogCtrl.$inject = ['$http', 'logService'];

    function licenseeBetSettingLogCtrl($http, logService) {
        var vm = this;

        vm.criteria = {};
        vm.formData = {};

        vm.gridOptions = logService.configGridOptions();
        vm.gridOptions.pagerOption = {
            pagerSelectCallBack: function (pageIndex, itemsPerPage) {
                vm.formData.pageIndex = pageIndex;
                vm.formData.pageSize = itemsPerPage;
                getReport();
            }
        }

        function setSportNames(arr) {
            $.each(arr, function (index, settings) {
                if (index > 0 && settings !== null) {
                    var sportTypeId = settings.content[0].value;
                    var betTypeId = settings.content[1].value;

                    var length = vm.SportNames.Keys.length;
                    for (var i = 0; i < length; i++) {
                        if (sportTypeId == vm.SportNames.Keys[i].SportTypeId && betTypeId == vm.SportNames.Keys[i].BetTypeId) {
                            settings.content.unshift({
                                key: 'Sport/Game',
                                value: vm.SportNames.Values[i]
                            })
                        }
                    }
                }
            });
        }

        function getNormalizedFilter() {
            return {
                LicenseeId: isNull(vm.criteria.Licensee.Id, -1),
                CustId: isNull(vm.criteria.SuperWithCurrency.Id, -1),
                AgentId: isNull(vm.criteria.Agent.Id, -1),
                FromDate: logService.formatDateString(vm.criteria.FromDate),
                ToDate: logService.formatDateString(vm.criteria.ToDate),
                pageIndex: vm.criteria.PageIndex,
                pageSize: vm.criteria.PageSize
            }
        }

        function isNull(value, defaultValue) {
            return value !== null ? value : defaultValue;
        }

        function getReport() {
            logService.invokeLoadingMsg(true);
            $http.get('GetReport', { params: vm.formData })
                .success(function (data) {
                    logService.handleLogData(data, setSportNames);
                    vm.report = data;
                    vm.formData.TotalItem = data.TotalItem;
                    logService.invokeLoadingMsg(false);
                })
                .error(function (data) {
                    logService.invokeLoadingMsg(false);
                    alert(data);
                });
        }

        vm.selectedLicenseeChange = function () {
            logService.getSelectedLicenseeChange(vm);
        };

        vm.selectedSuperWithCurrencyChange = function () {
            logService.getSelectedSuperWithCurrencyChange(vm);
        }

        vm.getReport = function () {
            vm.formData.pageIndex = undefined;
            vm.formData.pageSize = undefined;
            vm.formData = getNormalizedFilter();

            getReport();
        }

        function initialize() {
            logService.getSettings(vm);
        }

        initialize();
    }
})();

﻿(function () {
    'use strict';

    function fanexgrid() {
        var scopeOptions = {
            report: '=',
            options: '=',
        };

        function generateGrid(scope, newValue) {
            grid.setDefaultOptions(scope.options);

            if (scope.options.pagerOption !== undefined) {
                grid.setPaging(scope.options, newValue);
            }

            scope.options.bodyRows = grid.genGridRows(newValue.Data, scope.options);
            $("#gridId").empty().removeClass('hide').fanexGrid(scope.options);
        }

        function initEvent() {
            var gridHeight = $('#gridId').height();
            var isCollapse = false;

            $(window).resize(function () {
                calculateGridHeight(gridHeight);
            });

            $('body').unbind().on('click', '.panel-setting', function (event) {
                event.preventDefault();
                $(this).nextAll('.content-setting').toggle();
                calculateGridHeight(gridHeight);
            });

            $('body').on('click', '.log-content', function (event) {
                event.preventDefault();

                if (!isCollapse) {
                    $('.content-setting').hide();
                } else {
                    $('.content-setting').show();
                }

                isCollapse = !isCollapse;
                calculateGridHeight(gridHeight);
            });
        }

        function calculateGridHeight(gridHeight) {
            if ($('.content-container').height() + $('.grid-pager').height() >= gridHeight) {
                $('#gridId').height(gridHeight);
                $('.grid-container').height(gridHeight - $('.x-scrollbar').height() - $('.grid-pager').height());
            } else {
                $('#gridId').height($('.content-container').height() + $('.x-scrollbar').height() + $('.grid-pager').height());
                $('.grid-container').height($('.content-container').height());
            }

            $('.free-bottom-right').css({ top: $('.grid-container').height() });
            $('.x-scrollbar').css({ top: $('.grid-container').height() });
            $('.grid-pager').css({ top: ($('.grid-container').height() + $('.x-scrollbar').height()) })
            $('.y-scrollbar').height($('#gridId').height() - $('.grid-pager').height() - $('.row-headers-background').height());
            $('.scrollbar-y-content').height($('.content-container').height() - $('.free-bottom-right').height());

            if ($('.y-scrollbar').height() < $('.scrollbar-y-content').height()) {
                $('.y-scrollbar').css("overflow-y", "scroll");
            }
        }

        return {
            restrict: 'A',
            scope: scopeOptions,
            link: function (scope) {
                scope.$watch('report', function (newValue) {
                    if (newValue) {
                        generateGrid(scope, newValue);
                        initEvent();
                    }
                });
            }
        };
    }

    angular.module('logSettingsApp').directive('logsFanexgrid', fanexgrid);
}());
﻿/* global logSettings*/

(function () {
    'use strict';

    angular
        .module('logSettingsApp')
        .service('logService', logService);

    logService.$inject = ['$http'];

    function logService($http) {

        /* private functions */
        function licenseeSetting(vm) {
            vm.criteria.Licensee = vm.Licensees[0];
            vm.LicenseeSetting = {
                idMember: "Id",
                nameMember: "Name",
                sourceData: vm.Licensees,
                hasToolbar: false,
                hasFilter: true,
                hasEnter: false,
                width: '100%',
            };
        }

        function superWithCurrencySetting(vm) {
            vm.criteria.SuperWithCurrency = vm.SuperWithCurrencies[0];
            vm.SuperWithCurrencySetting = {
                idMember: "Id",
                nameMember: "CurrencyWithSuper",
                sourceData: vm.SuperWithCurrencies,
                hasToolbar: false,
                hasFilter: true,
                hasEnter: false,
                width: '100%',
            };
        }

        function agentSetting(vm) {
            vm.criteria.Agent = vm.Agents[0];
            vm.AgentSetting = {
                idMember: "Id",
                nameMember: "Name",
                sourceData: vm.Agents,
                hasToolbar: false,
                hasFilter: true,
                hasEnter: false,
                width: '100%',
            };
        }

        function setGenerateButtonStatus (disable) {
            if (disable) {
                $("#generate").attr("disabled", "disabled");
            } else {
                $("#generate").removeAttr("disabled");
            }
        };

        /* public functions */
        this.formatDateString = function (date) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        }

        this.configGridOptions = function () {
            return {
                columns: [
                    {
                        HeaderText: "LogID", Width: 60, Name: "LogId", HeaderAlign: "center", CellAlign: "center", CanResize: false
                    },
                    {
                        HeaderText: "Log Date", Width: 90, Name: "LogDateString", HeaderAlign: "center", CellAlign: "center", CanResize: false
                    },
                    {
                        HeaderText: "Edited By", Width: 190, Name: "EditedBy", HeaderAlign: "center", CellAlign: "center", CanResize: false
                    },
                    {
                        HeaderText: "Action", Width: 210, Name: "ActionName", HeaderAlign: "center", CellAlign: "center", CanResize: false
                    },
                    {
                        HeaderText: "Detail", Width: 1240, Name: "Content", HeaderAlign: "center", CellAlign: "center", CanResize: false, CssClass: "log-content"
                    },
                ],
                headerColumnHeight: 25,
                marginRight: 0,
                showDistinctRow: false,
                showTitle: false,
                titleInfo: {
                    showExcelButton: false
                }
            }
        }

        this.getSelectedLicenseeChange = function (vm) {
            $http.get(
                'GetSuperLicenseeList',
                {
                    params: { siteName: vm.criteria.Licensee.Name }
                }
            )
                .success(function (superWithCurrencies) {
                    vm.SuperWithCurrencies = superWithCurrencies;
                    superWithCurrencySetting(vm);
                });
        }

        this.getSelectedSuperWithCurrencyChange = function (vm) {
            $http.get(
                'GetLicenseeAgentList',
                {
                    params: { SRecommend: vm.criteria.SuperWithCurrency.Id }
                }
            )
                .success(function (agents) {
                    vm.Agents = agents;
                    agentSetting(vm);
                });
        }

        this.getSettings = function (vm) {
            $http.get('GetLogSettings')
                .success(function (data) {
                    vm.Licensees = data.Licensees;
                    vm.SportNames = data.SportNames;

                    data.CurrentDate = new Date(data.CurrentDate);

                    vm.criteria.FromDate = data.CurrentDate;
                    vm.criteria.ToDate = data.CurrentDate;

                    licenseeSetting(vm);
                    vm.TextSettings = {
                        Filter: 'Search'
                    };
                });
        }

        this.handleLogData = function (data, Func) {
            angular.forEach(data.Data, function (item) {
                var oldData = logSettings.formatData(item.OldData, item.ActionId, Func);
                var newData = logSettings.formatData(item.Data, item.ActionId, Func);

                item.Content = logSettings.createTable(oldData, newData);
            })
        }

        this.invokeLoadingMsg = function (visible) {
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
    }
})();