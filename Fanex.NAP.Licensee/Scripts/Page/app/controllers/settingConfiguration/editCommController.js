"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit Comm controller
settingConfigurationApp.controller("editCommCtrl", function ($scope, $location, shareSettingsService) {
    $scope.message = "Test Edit Comm View";

    $scope.updateComm = function () {
        // $rootScope.editSettings = "From edit Comm";

        shareSettingsService.saveCurrentSettings("From edit Comm");
        $location.path("/ReviewComm");
    };
});
