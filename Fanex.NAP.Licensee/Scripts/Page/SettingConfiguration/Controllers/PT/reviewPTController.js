
"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", function ($scope, $http, $location, $route, $routeParams, shareSettingsService, ContextFunc) {
    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.reviewPTData = {};

    $scope.reviewPTData = {
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgPT: shareSettingsService.getOrgSettings().SelectedPositionTaking,
        CurPT: shareSettingsService.getCurSettings().SelectedPositionTaking
    };

    $scope.updatePT = function () {
        $http.post(
            "UpdatePT",
            {
                params: {
                    CustId: shareSettingsService.getWorkingContext().CustId,
                    ProductId: shareSettingsService.getWorkingContext().ProdId,
                    PTValue: shareSettingsService.getCurSettings().SelectedPositionTaking
                }
            })
        .success(function (data) {
            if (data.IsOk === true) {
                alert("Update PT successfully!", false, function () {
                    $location.path("/");
                    $route.reload();
                });
            }
            else {
                alert("<strong>Error:</strong> <br/>" + data.Message, false, function () {
                    $location.path("/");
                    $route.reload();
                });
            }
        })
        .error(function (data) {
            alert(data);
        });
    };

    $scope.backEditPT = function () {
        $location.path("/EditPT");
    };
});
