/* global ContextFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", function ($scope, $http, $location, $routeParams, shareSettingsService) {
    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.reviewPTData = {};

    $scope.reviewPTData = {
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgPT: shareSettingsService.getOrgSettings().OrgPT,
        CurPT: shareSettingsService.getCurSettings().CurPT
    };

    $scope.updateEventHandler = function () {
        shareSettingsService.getCurSettings().selectedPositionTaking = $scope.editPTData.SelectedPositionTaking;
        $location.path("/ReviewPT");
    };

    $scope.updatePT = function () {
        $http.get(
            "UpdatePT",
            {
                params: {
                    CustId: shareSettingsService.getWorkingContext().CustId,
                    ProductId: shareSettingsService.getWorkingContext().ProdId,
                    PTValue: shareSettingsService.getCurSettings().CurPT
                }
            })
        .success(function (data) {
            if (data.IsOk === true) {
                alert("Update PT successfully!");

            }
            else {
                alert("<strong>Error:</strong> <br/>" + data.Message);
            }

            $location.path("/");
        })
        .error(function (data) {
            alert(data);
        });
    };

    $scope.backEditPT = function () {
        $location.path("/EditPT");
    };
});
