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

    $scope.lstEditCommRows = {};
    $scope.isCopyAll = false;

    $http.get(
            "GetEditCommData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings({
                OrgComm: JSON.parse(JSON.stringify(data))
            });

            $scope.lstEditCommRows = data;
        });

    $scope.copyAll = function () {
        if ($scope.isCopyAll === true) {
            $.each($scope.lstEditCommRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsChecked = true;
                }
                else {
                    element.IsChecked = false;
                    element.IsDisabled = true;
                    $scope.copyComm();
                }
            });
        }
        else {
            $.each($scope.lstEditCommRows, function (index, element) {
                element.IsChecked = false;
                element.IsDisabled = false;
            });
        }
    };

    $scope.copyComm = function () {
        if ($scope.isCopyAll === true) {
            $.each($scope.lstEditCommRows, function (index, element) {
                element.SelectedComm = $scope.lstEditCommRows[0].SelectedComm;
            });
        }
    };

    $scope.nextReviewComm = function () {
        shareSettingsService.saveCurSettings({
            CurComm: $scope.lstEditCommRows
        });
        $location.path("/ReviewComm");
    };
});
