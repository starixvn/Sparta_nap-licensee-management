/* global settingConfigurationApp */
"use strict";

// Edit Comm controller
settingConfigurationApp.controller("editCommCtrl", ['$scope', '$http', '$location', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.Comm) {
        $location.path('/');
        return;
    }

    $scope.EditCommRows = {};
    $scope.isCopyAll = false;
    $scope.buttonStatus.isNextEnabled = false;

    $http.get(
            "GetEditCommData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));
            if ($scope.buttonStatus.IsBack) {
                $scope.EditCommRows = shareSettingsService.getCurSettings();
            }
            else {
                $scope.EditCommRows = data;
            }
        });

    $scope.copyAll = function () {
        if ($scope.isCopyAll) {
            $.each($scope.EditCommRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsChecked = true;
                }
                else {
                    element.IsChecked = true;
                    element.IsDisabled = true;
                    element.SelectedComm = $scope.EditCommRows[0].SelectedComm;
                }
            });
        }
        else {
            var orgComms = shareSettingsService.getOrgSettings();

            $.each($scope.EditCommRows, function (index, element) {
                element.IsChecked = false;
                element.IsDisabled = false;
                element.SelectedComm = orgComms[index].SelectedComm;
            });
        }
    };

    $scope.$watch("EditCommRows", function () {
        $scope.buttonStatus.isNextEnabled = false;
        var orgCommList = shareSettingsService.getOrgSettings();
        var curCommList = $scope.EditCommRows;

        // A litle hack: Watch when it has data
        if (curCommList[0] !== undefined) {
            $scope.buttonStatus.isNextEnabled = $scope.isChanged(orgCommList, curCommList);
        }
    }, true);

    $scope.isChanged = function (orgCommList, curCommList) {
        var numberChangedComm = 0;
        var isChanged = true;

        $.each(curCommList, function (index, element) {
            if (element.IsChecked === true) {
                numberChangedComm++;
                if (curCommList[index].SelectedComm === orgCommList[index].SelectedComm) {
                    isChanged = false;
                }
            }
            else {
                curCommList[index].SelectedComm = orgCommList[index].SelectedComm;
            }
        });

        return (isChanged && numberChangedComm > 0) || $scope.isCopyAll;
    };

    $scope.nextReviewComm = function () {
        shareSettingsService.saveCurSettings($scope.EditCommRows);
        $location.path("/ReviewComm");
    };
} ]);
