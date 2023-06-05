(function () {
    'use strict';

    angular.module('logSettingsApp').controller('licenseeSettingLogCtrl', licenseeSettingLogCtrl);

    licenseeSettingLogCtrl.$inject = ['$http', 'logService'];

    function licenseeSettingLogCtrl($http, logService) {
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
