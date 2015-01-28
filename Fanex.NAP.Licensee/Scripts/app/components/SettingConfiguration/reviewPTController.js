"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", function ($scope, $location, shareSettingsService) {
    $scope.param = shareSettingsService.getCurrentSettings();
    // $scope.filterData.selectedLicensee

    $scope.backEditPT = function () {
        $location.path("/EditPT");
    };
});
