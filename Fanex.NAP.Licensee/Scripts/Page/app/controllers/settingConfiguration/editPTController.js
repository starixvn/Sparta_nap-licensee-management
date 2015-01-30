"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editPTCtrl", function ($scope, $http, $location, $routeParams, shareSettingsService) {
    //$scope.editPTData = {};

    // Load licensees
    //if (JSON.stringify(shareSettingsService.getCurrentSettings()) == '{}') {
    $http.get(
            "GetEditPTData",
            {
                params: {
                    custId: shareSettingsService.getCurrentSettings().custId,
                    productId: shareSettingsService.getCurrentSettings().productId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings({
                OrgPT: data.SelectedPositionTaking
            });

            // Rebind data
            if (shareSettingsService.getCurrentSettings().selectedPositionTaking !== undefined) {
                data.SelectedPositionTaking = shareSettingsService.getCurrentSettings().selectedPositionTaking;
            }
            $scope.editPTData = data;
        });
    //}


    $scope.updateEventHandler = function () {
        shareSettingsService.getCurrentSettings().selectedPositionTaking = $scope.editPTData.SelectedPositionTaking;
        $location.path("/ReviewPT");
    };

    //    $scope.previousEventhandler = function () {
    //        $location.path("/");
    //    };
});
