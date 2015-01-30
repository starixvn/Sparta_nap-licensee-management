"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Review comm controller
settingConfigurationApp.controller("reviewCommCtrl", function ($scope, $location, shareSettingsService) {
    $scope.param = shareSettingsService.getCurrentSettings();
    //$scope.param = $rootScope.editSettings;
    // $scope.filterData.selectedLicensee

    $scope.backEditComm = function () {
        $location.path("/EditComm");
    };
});
