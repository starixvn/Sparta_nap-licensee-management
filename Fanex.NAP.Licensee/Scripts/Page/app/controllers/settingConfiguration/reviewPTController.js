"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", function ($scope, $http, $location, $routeParams, shareSettingsService) {
    //$scope.editPTData = {};

    // Load licensees
    $scope.reviewPTData = {
        OrgPT: shareSettingsService.getOrgSettings().OrgPT,
        CurPT: shareSettingsService.getCurrentSettings().selectedPositionTaking
    };

    $scope.updateEventHandler = function () {
        shareSettingsService.getCurrentSettings().selectedPositionTaking = $scope.editPTData.SelectedPositionTaking;
        $location.path("/ReviewPT");
    };

    $scope.backEditPT = function () {
        $location.path("/EditPT");
    };
});
