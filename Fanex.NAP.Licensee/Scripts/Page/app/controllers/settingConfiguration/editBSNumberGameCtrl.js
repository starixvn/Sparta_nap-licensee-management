/* global ContextFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editBSSportbookCtrl", function ($scope, $http, $location, $routeParams, shareSettingsService) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.editPTData = {};

    $http.get(
            "GetEditPTData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    productId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings({
                OrgPT: data.SelectedPositionTaking
            });

            $scope.editPTData = data;
        });

    $scope.updateEventHandler = function () {
        shareSettingsService.saveCurSettings({
            CurPT: $scope.editPTData.SelectedPositionTaking
        });

        $location.path("/ReviewPT");
    };
});
