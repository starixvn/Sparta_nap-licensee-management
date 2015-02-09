/* global ContextFunc */
/* exported editBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc */
"use strict";

// Model function
var editBSModelFunc = function ($scope, $http, $location, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = {};

    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(JSON.parse(JSON.stringify(data)));
            $scope.editBS = data;
        });
};

// Navigator function
var editBSNavigatorFunc = function ($scope, $location, shareSettingsService) {
    // Redirect if wrong context
    var selectedContext = shareSettingsService.getWorkingContext();
    if (selectedContext.FuncName === "" || selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.nextReviewBS = function () {
        shareSettingsService.saveCurSettings($scope.editBS);
        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
    };
};

// AllSport function
var editBSAllSportFunc = function ($scope) {

    $scope.isAllSportChecked = false;

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
};

// Row is checkable
var editBSRowCheckableFunc = function ($scope) {

    $scope.isCopyAll = false;
    $scope.listener = null;

    $scope.copyAllFromOne = function () {
        if ($scope.isCopyAll === true) {
            $.each($scope.editBS.BSRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsRowSelected = true;
                    $scope.listener = $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
                else {
                    element.IsRowSelected = false;
                }
            });
        }
        else {
            $.each($scope.editBS.BSRows, function (index, element) {
                if (index === 0) {
                    $scope.listener();
                }
                element.IsRowSelected = false;
            });
        }
    };

    $scope.copyBS = function () {
        if ($scope.isCopyAll === true) {
            var firstRowData = $scope.editBS.BSRows[0];
            $.each($scope.editBS.BSRows, function (index, element) {
                element.MinBet = firstRowData.MinBet;
                element.MaxBet = firstRowData.MaxBet;
                element.MaxPerMatch = firstRowData.MaxPerMatch;
            });
        }
    };
};

// Row is checkable with super and downline
var editBSRowCheckableSuperDownlineFunc = function ($scope, $injector) {
    // Inherit editBSRowCheckableFunc
    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    // Override
    $scope.copyBS = function () {
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
};
