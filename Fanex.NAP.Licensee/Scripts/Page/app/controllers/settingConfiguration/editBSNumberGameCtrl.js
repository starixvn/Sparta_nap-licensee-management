/* global ContextFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editBSNumberGameCtrl", function ($scope, $http, $location, $routeParams, shareSettingsService) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.editBS = {};

    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(JSON.parse(JSON.stringify(data)));
            $scope.editBS = data;
        });

    $scope.nextReviewBS = function () {
        shareSettingsService.saveCurSettings($scope.editBS);
        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
    };
});
