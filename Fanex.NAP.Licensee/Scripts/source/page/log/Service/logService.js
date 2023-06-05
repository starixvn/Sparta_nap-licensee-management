/* global logSettings*/

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

        function configDropdowns(vm) {
            licenseeSetting(vm);
            superWithCurrencySetting(vm);
            agentSetting(vm);

            vm.TextSettings = {
                Filter: 'Search'
            };
        }

        var setGenerateButtonStatus = function (disable) {
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
                    vm.SuperWithCurrencies = data.SuperWithCurrencies;
                    vm.Agents = data.Agents;
                    vm.SportNames = data.SportNames;

                    data.CurrentDate = new Date(data.CurrentDate);

                    vm.criteria.FromDate = data.CurrentDate;
                    vm.criteria.ToDate = data.CurrentDate;

                    configDropdowns(vm);
                })
                .error(function (data) {
                    alert(data);
                })
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