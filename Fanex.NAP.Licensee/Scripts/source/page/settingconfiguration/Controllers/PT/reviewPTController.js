/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {
    $scope.selectedContext = shareSettingsService.getWorkingContext();
    $scope.supperUserName = $scope.selectedContext.CustName;

    if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.reviewPTData = {
        ProductName: shareSettingsService.getCurSettings().ProductName,
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgPT: shareSettingsService.getOrgSettings().SelectedPositionTaking,
        CurPT: shareSettingsService.getCurSettings().SelectedPositionTaking
    };

    $scope.updatePT = function () {
        $scope.buttonStatus.isUpdated = true;
        $scope.buttonStatus.isButtonEnable = false;
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
                $scope.buttonStatus.isSuccess = true;
            }
            else {
                $scope.ptMessage = data.Message;
                $scope.buttonStatus.isSuccess = false;
            }
            $scope.buttonStatus.isButtonEnable = true;
        })
        .error(function (data) {
            $scope.ptMessage = data;
            $scope.buttonStatus.isSuccess = false;
        });
    };

    $scope.backEditPT = function () {
        if ($scope.buttonStatus.isUpdated) {
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isNextEnabled = false;
            $scope.buttonStatus.IsBack = false;
        }
        else {
            $scope.buttonStatus.IsBack = true;
        }
        $location.path("/EditPT");
    };
} ]);
