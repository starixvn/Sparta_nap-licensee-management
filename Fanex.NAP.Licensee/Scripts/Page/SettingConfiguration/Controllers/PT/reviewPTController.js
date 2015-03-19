/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {
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
        $scope.isUpdateEnable = false;
        $scope.isButtonEnable = false;
        $http.post(
            "UpdatePT",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProductId: shareSettingsService.getWorkingContext().ProdId,
                PTValue: shareSettingsService.getCurSettings().SelectedPositionTaking
            })
        .success(function (data) {
            if (data.IsOk === true) {
                $scope.ptMessage = "Update PT successfully!";
                $scope.isSuccess = true;
            }
            else {
                $scope.ptMessage = data.Message;
                $scope.isSuccess = false;
            }
            $scope.isButtonEnable = true;
        })
        .error(function (data) {
            $scope.ptMessage = data;
            $scope.isSuccess = false;
            $scope.isButtonEnable = true;
        });
    };

    $scope.backEditPT = function () {
        $scope.buttonStatus.IsBack = true;
        $location.path("/EditPT");
    };
} ]);
