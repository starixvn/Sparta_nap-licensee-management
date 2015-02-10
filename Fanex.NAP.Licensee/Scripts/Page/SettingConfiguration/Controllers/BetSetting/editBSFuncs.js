/* global ContextFunc */
/* exported editBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc, 
editBSNextFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */
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

    var syncAllSport = function () {
        var isAllChecked = true;
        // A litle hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            $.each($scope.editBS.BSRows, function (index, element) {
                if (element.IsRowSelected === false) {
                    isAllChecked = false;
                }
            });
        }
        $scope.isAllSportChecked = isAllChecked;
    };

    $scope.$watch("editBS.BSRows", syncAllSport, true);
};

// Row is checkable
var editBSRowCheckableFunc = function ($scope) {

    $scope.isCopyAll = false;
    $scope.listener = null;

    $scope.copyAllFromOne = function () {
        if ($scope.isCopyAll === true) {
            // Reset AllSport
            $scope.isAllSportChecked = true;
            // TODO: Why ng-change not raised?
            $scope.checkAllSports();
            $.each($scope.editBS.BSRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsRowSelected = true;
                    $scope.listener = $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
                else {
                    element.IsRowSelected = true;
                    element.IsRowDisabled = true;
                }
            });
        }
        else {
            // Reset AllSport
            $scope.isAllSportChecked = false;
            $.each($scope.editBS.BSRows, function (index, element) {
                if (index === 0) {
                    $scope.listener();
                }
                element.IsRowSelected = false;
                element.IsRowDisabled = false;
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

var editBSNextEnabilityFunc = function ($scope, $location, shareSettingsService) {
    // Private functions
    var checkDirty = function () {
        $scope.isNextEnabled = false;
        // A litle hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            var curBSRows = $scope.editBS.BSRows;
            $.each(curBSRows, function (index, element) {
                if (element.IsRowSelected === true) {

                    // Check if min, max, maxPerMatch is dirty
                    if (curBSRows[index].MinBet.toString() !== orgBSRows[index].MinBet.toString()
                    || curBSRows[index].MaxBet.toString() !== orgBSRows[index].MaxBet.toString()
                    || curBSRows[index].MaxPerMatch.toString() !== orgBSRows[index].MaxPerMatch.toString()) {
                        $scope.isNextEnabled = true;
                        return false;
                    }

                    // If Super, Downline exists => Check
                    if (curBSRows[index].IsSuperChecked !== undefined && curBSRows[index].IsDownlineChecked !== undefined) {
                        if (curBSRows[index].IsSuperChecked !== orgBSRows[index].IsSuperChecked
                        || curBSRows[index].IsDownlineChecked !== orgBSRows[index].IsDownlineChecked) {
                            $scope.isNextEnabled = true;
                            return false;
                        }
                    }

                    // If MaxPerBall exists => Check
                    if (curBSRows[index].MaxPerBall !== undefined) {
                        if (curBSRows[index].MaxPerBall.toString() !== orgBSRows[index].MaxPerBall.toString()) {
                            $scope.isNextEnabled = true;
                            return false;
                        }
                    }
                }
            });
        }
    };

    $scope.isNextEnabled = false;

    $scope.$watch("editBS.BSRows", checkDirty, true);
};

// Check Next constraints
var editBSNextConstraintsFunc = function ($scope, $location, shareSettingsService) {
    $scope.nextReviewBS = function () {
        // Check constraints on submit
        var hasError = false;
        var curBSRows = $scope.editBS.BSRows;
        $.each(curBSRows, function (index, element) {
            if (element.IsRowSelected === true) {

                // Check is dirty
                if (parseFloat(curBSRows[index].MinBet) > parseFloat(curBSRows[index].MaxBet)
                || parseFloat(curBSRows[index].MaxBet) > parseFloat(curBSRows[index].MaxPerMatch)) {
                    alert("Please recheck: min bet <= max bet <= max per match!");
                    hasError = true;
                    return false;
                }

                // If MaxPerBall exists => Check
                if (curBSRows[index].MaxPerBall !== undefined) {
                    if (parseFloat(curBSRows[index].MaxPerMatch) > parseFloat(curBSRows[index].MaxPerBall)) {
                        alert("Please recheck: min bet <= max bet <= max per match <= max per ball!");
                        hasError = true;
                        return false;
                    }
                }
            }
        });

        if (hasError === true) {
            return;
        }

        shareSettingsService.saveCurSettings($scope.editBS);
        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
    };
};