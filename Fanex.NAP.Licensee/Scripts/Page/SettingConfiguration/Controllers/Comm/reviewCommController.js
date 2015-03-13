/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewCommCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
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
        $scope.IsUpdating = true;
        var CommRows = shareSettingsService.getCurSettings();
        var rowIndex = getRowIndex(CommRows, -1);
        if (rowIndex !== undefined) {
            postCommission(CommRows, rowIndex);
        }
    };

    $scope.backEditComm = function () {
        shareSettingsService.getWorkingContext().IsBack = true;
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
        $('.btn-primary').attr('disabled', 'disabled');
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
            $('.btn-primary').removeAttr("disabled");
            if (rowIndex !== undefined) {
                postCommission(CommRows, rowIndex);
            }
        })
        .error(function (data) {
            commRow.Status = shareSettingsService.getStatus().Fail;
            commRow.Message = data;
            $('.btn-primary').removeAttr("disabled");
        });
    };
} ]);
