"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editPTCtrl", function ($scope, $location, shareSettingsService) {
    $scope.message = "Test Edit PT View";
    //$scope.filterData.selectedLicensee

    $scope.updatePT = function () {
        //$rootScope.editSettings = "Form Edit PT";

        shareSettingsService.saveCurrentSettings("Form Edit PT");

        $location.path("/ReviewPT");
    };
});
