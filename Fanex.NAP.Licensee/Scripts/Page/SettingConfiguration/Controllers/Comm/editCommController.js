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
        if ($scope.isCopyAll === true) {
            $.each($scope.EditCommRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsChecked = true;
                }
                else {
                    element.IsChecked = true;
                    element.IsDisabled = true;
                    $scope.copyComm();
                }
            });
        }
        else {
            $.each($scope.EditCommRows, function (index, element) {
                element.IsChecked = false;
                element.IsDisabled = false;
            });
        }
    };

    $scope.copyComm = function () {
        if ($scope.isCopyAll === true) {
            $.each($scope.EditCommRows, function (index, element) {
                element.SelectedComm = $scope.EditCommRows[0].SelectedComm;
            });
        }
    };

    $scope.$watch("EditCommRows", function () {
        $scope.buttonStatus.isNextEnabled = false;
        var orgCommList = shareSettingsService.getOrgSettings();
        var curCommList = $scope.EditCommRows;

        // A litle hack: Watch when it has data
        if (curCommList[0] !== undefined) {
            $.each(curCommList, function (index, element) {
                if (element.IsChecked === true) {
                    if (curCommList[index].SelectedComm !== orgCommList[index].SelectedComm) {
                        $scope.buttonStatus.isNextEnabled = true;
                    }
                }
            });
        }
    }, true);

    $scope.nextReviewComm = function () {
        shareSettingsService.saveCurSettings($scope.EditCommRows);
        $location.path("/ReviewComm");
    };
} ]);
