(function () {
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
                CustId: isNull(vm.criteria.SuperWithCurrency.CurrencyId, -1),
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
