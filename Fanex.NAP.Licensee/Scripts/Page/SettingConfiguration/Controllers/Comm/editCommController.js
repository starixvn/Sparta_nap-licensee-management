/* global ContextFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit Comm controller
settingConfigurationApp.controller("editCommCtrl", function ($scope, $http, $location, shareSettingsService) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.Comm) {
        $location.path('/');
        return;
    }

    $scope.EditCommRows = {};
    $scope.isCopyAll = false;
    $scope.isNextEnabled = false;

    $http.get(
            "GetEditCommData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(JSON.parse(JSON.stringify(data)));

            $scope.EditCommRows = data;
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
        $scope.isNextEnabled = false;
        var orgCommList = shareSettingsService.getOrgSettings();
        var curCommList = $scope.EditCommRows;

        // A litle hack: Watch when it has data
        if (curCommList[0] !== undefined) {
            $.each(curCommList, function (index, element) {
                if (element.IsChecked === true) {
                    if (curCommList[index].SelectedComm.toString() !== orgCommList[index].SelectedComm.toString()) {
                        $scope.isNextEnabled = true;
                    }
                }
            });
        }
    }, true);

    $scope.nextReviewComm = function () {
        shareSettingsService.saveCurSettings($scope.EditCommRows);
        $location.path("/ReviewComm");
    };
});
