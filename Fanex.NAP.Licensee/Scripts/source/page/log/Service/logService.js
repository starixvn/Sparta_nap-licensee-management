/* global site, logSettings*/

(function () {
    'use strict';

    angular
        .module('logSettingsApp')
        .service('logService', logService);

    logService.$inject = ['$http'];

    function logService($http) {

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

        var formatDateString = function (date) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        }

        var configGridOptions = function () {
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

        var getSelectedLicenseeChange = function (vm) {
            site.invokeLoadingMsg(true);
            var licensee = vm.criteria.Licensee;
            var licenseeName = licensee ? licensee.Name : '';

            $http.get(
                'GetSuperLicenseeList',
                {
                    params: { siteName: licenseeName }
                }
            )
                .success(function (superWithCurrencies) {
                    vm.SuperWithCurrencies = superWithCurrencies;
                    superWithCurrencySetting(vm);

                    if (superWithCurrencies.length === 0) {
                        getSelectedSuperWithCurrencyChange(vm);
                    }
                }).error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var getSelectedSuperWithCurrencyChange = function (vm) {
            site.invokeLoadingMsg(true);
            var superLicensee = vm.criteria.SuperWithCurrency;
            var SRecommend = superLicensee !== undefined ? superLicensee.Id : -1;

            $http.get(
                'GetLicenseeAgentList',
                {
                    params: { SRecommend: SRecommend }
                }
            )
                .success(function (agents) {
                    agents = superLicensee !== undefined ? agents : [];
                    vm.Agents = agents;
                    agentSetting(vm);
                    site.invokeLoadingMsg(false);

                    vm.buttonStatus.disableButton = agents.length <= 0;
                }).error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var getSettings = function (vm) {
            site.invokeLoadingMsg(true);
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

                    if (vm.Licensees.length === 0) {
                        getSelectedSuperWithCurrencyChange(vm);
                    }
                }).error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var handleLogData = function (data, Func) {
            angular.forEach(data.Data, function (item) {
                var oldData = logSettings.formatData(item.OldData, item.ActionId, Func);
                var newData = logSettings.formatData(item.Data, item.ActionId, Func);

                item.Content = logSettings.createTable(oldData, newData);
            })
        }

        return {
            formatDateString: formatDateString,
            configGridOptions: configGridOptions,
            getSelectedLicenseeChange: getSelectedLicenseeChange,
            getSelectedSuperWithCurrencyChange: getSelectedSuperWithCurrencyChange,
            getSettings: getSettings,
            handleLogData: handleLogData
        }
    }
})();