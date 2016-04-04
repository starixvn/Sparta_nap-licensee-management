/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewCommCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    $scope.supperUserName = $scope.selectedContext.CustName;

    if ($scope.selectedContext.FuncName !== ContextFunc.Comm) {
        $location.path('/');
        return;
    }

    $scope.reviewCommData = {
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgComm: shareSettingsService.getOrgSettings(),
        CurComm: shareSettingsService.getCurSettings()
    };

    $scope.updateComm = function () {
        $scope.buttonStatus.isUpdated = true;
        $scope.buttonStatus.isButtonEnable = false;
        var CommRows = shareSettingsService.getCurSettings();
        var rowIndex = getRowIndex(CommRows, -1);
        if (rowIndex !== undefined) {
            postCommission(CommRows, rowIndex);
        }
    };

    $scope.backEditComm = function () {
        if ($scope.buttonStatus.isUpdated) {
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isNextEnabled = false;
            $scope.buttonStatus.IsBack = false;
        }
        else {
            $scope.buttonStatus.IsBack = true;
        }
        $location.path("/EditComm");
    };

    var getRowIndex = function (CommRows, rowIndex) {
        for (var index = rowIndex + 1; index < CommRows.length; index++) {
            if (CommRows[index].IsChecked) {
                return index;
            }
        }
        return undefined;
    };

    var postCommission = function (CommRows, rowIndex) {
        var commRow = CommRows[rowIndex];
        commRow.Status = shareSettingsService.getStatus().Loading;
        $http.post(
            "UpdateComm",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                SportCommission: commRow
            })
        .success(function (data) {
            commRow.Message = data.Message;
            rowIndex = getRowIndex(CommRows, rowIndex);

            if (data.IsOk) {
                commRow.Status = shareSettingsService.getStatus().Success;
            }
            else {
                commRow.Status = shareSettingsService.getStatus().Fail;
            }

            if (rowIndex !== undefined) {
                postCommission(CommRows, rowIndex);
            }
            else {
                $scope.buttonStatus.isButtonEnable = true;
            }
        })
        .error(function (data) {
            commRow.Status = shareSettingsService.getStatus().Fail;
            commRow.Message = data;
        });
    };
} ]);
