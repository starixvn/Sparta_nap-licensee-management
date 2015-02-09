"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editBSKenoCtrl", function ($scope, $http, $location, shareSettingsService) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.editBS = {
        // IsApplyExistingMemberChecked
        // BSRows
    };
    $scope.isAllSportChecked = false;
    $scope.isCopyAll = false;
    // Private variables
    var listener = null;

    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings({
                OrgBS: JSON.parse(JSON.stringify(data))
            });

            $scope.editBS.IsApplyExistingMemberChecked = data.IsApplyExistingMemberChecked;
            $scope.editBS.BSRows = data.BSRows;
        });

    $scope.checkAllSports = function () {
        if ($scope.isAllSportChecked === true) {
            $.each($scope.editBS.BSRows, function (index, element) {
                element.IsRowSelected = true;
            });
        }
        else {
            $.each($scope.editBS.BSRows, function (index, element) {
                element.IsRowSelected = false;
            });
        }
    };

    $scope.copyAllFromOne = function () {
        if ($scope.isCopyAll === true) {
            $.each($scope.editBS.BSRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsRowSelected = true;
                    listener = $scope.$watch("editBS.BSRows[0]", copyBS, true);
                }
                else {
                    element.IsRowSelected = false;
                }
            });
        }
        else {
            $.each($scope.editBS.BSRows, function (index, element) {
                if (index === 0) {
                    listener();
                }
                element.IsRowSelected = false;
            });
        }
    };

    // Private functions
    function copyBS(newValue) {
        if ($scope.isCopyAll === true) {
            var firstRowData = $scope.editBS.BSRows[0];
            $.each($scope.editBS.BSRows, function (index, element) {
                element.MinBet = firstRowData.MinBet;
                element.MaxBet = firstRowData.MaxBet;
                element.MaxPerMatch = firstRowData.MaxPerMatch;

                element.IsSuperChecked = firstRowData.IsSuperChecked;
                element.IsDownlinesChecked = firstRowData.IsDownlinesChecked;
            });
        }
    };

    $scope.nextReviewBS = function () {
        shareSettingsService.saveCurSettings($scope.editBS);
        //            IsApplyExistingMemberChecked: $scope.editBS.IsApplyExistingMemberChecked,
        //            BSRows: $scope.editBS.BSRows
        //        });
        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
    };
});
