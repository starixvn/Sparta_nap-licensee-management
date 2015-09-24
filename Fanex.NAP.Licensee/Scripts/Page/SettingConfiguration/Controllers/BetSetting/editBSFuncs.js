/* exported editBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc, 
editBSNextFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */
"use strict";
// Model function
var editBSModelFunc = function ($scope, $http, $location, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = {};

    function getAjaxHeader() {
        return {
            'FROM-ANGULAR': 'true',
            'X-Requested-With': 'XMLHttpRequest',
            'If-Modified-Since': '0'
        };
    }

    $http.get(
        "GetEditBetSettingData",
        {
            params: {
                custId: shareSettingsService.getWorkingContext().CustId,
                prodId: shareSettingsService.getWorkingContext().ProdId
            },
            headers: getAjaxHeader()
        })
    .success(function (data) {
        shareSettingsService.saveOrgSettings(angular.copy(data));
        if ($scope.buttonStatus.IsBack) {
            $scope.editBS = shareSettingsService.getCurSettings();
        }
        else {
            $scope.editBS = data;
        }
    });
};
editBSModelFunc.$inject = ['$scope', '$http', '$location', 'shareSettingsService'];
// Navigator function
var editBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
    // Redirect if wrong context
    var selectedContext = shareSettingsService.getWorkingContext();
    if (selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }
};
editBSNavigatorFunc.$inject = ['$scope', '$location', 'shareSettingsService', 'ContextFunc'];
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
        // A little hack: Watch when it has data
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
editBSAllSportFunc.$inject = ['$scope'];
var getNextEnable = function (scope, curBSRows, orgBSRows) {
    var arrValidRows = [];
    $.each(curBSRows, function (index, element) {
        if (element.IsRowSelected === true) {
            var orgRow = {
                MinBet: orgBSRows[index].MinBet,
                MaxBet: orgBSRows[index].MaxBet,
                MaxPerMatch: orgBSRows[index].MaxPerMatch,
                MaxPerBall: orgBSRows[index].MaxPerBall !== undefined ? orgBSRows[index].MaxPerBall : undefined,
                IsSuperChecked: orgBSRows[index].IsSuperChecked !== undefined ? orgBSRows[index].IsSuperChecked : undefined,
                IsDownlineChecked: orgBSRows[index].IsDownlineChecked !== undefined ? orgBSRows[index].IsDownlineChecked : undefined
            };

            var curRow = {
                MinBet: curBSRows[index].MinBet,
                MaxBet: curBSRows[index].MaxBet,
                MaxPerMatch: curBSRows[index].MaxPerMatch,
                MaxPerBall: curBSRows[index].MaxPerBall !== undefined ? curBSRows[index].MaxPerBall : undefined,
                IsSuperChecked: curBSRows[index].IsSuperChecked !== undefined ? curBSRows[index].IsSuperChecked : undefined,
                IsDownlineChecked: curBSRows[index].IsDownlineChecked !== undefined ? curBSRows[index].IsDownlineChecked : undefined
            };

            if (angular.equals(curRow, orgRow)) {
                arrValidRows.push(true);
            }
            else {
                arrValidRows.push(false);
            }

            if (curBSRows[index].IsSuperChecked !== undefined && !curBSRows[index].IsSuperChecked) {
                curBSRows[index].IsDownlineChecked = false;
            }
        }
        else {
            curBSRows[index].MinBet = orgBSRows[index].MinBet;
            curBSRows[index].MaxBet = orgBSRows[index].MaxBet;
            curBSRows[index].MaxPerMatch = orgBSRows[index].MaxPerMatch;
            curBSRows[index].MaxPerBall = orgBSRows[index].MaxPerBall;
            curBSRows[index].IsSuperChecked = orgBSRows[index].IsSuperChecked;
            curBSRows[index].IsDownlineChecked = orgBSRows[index].IsDownlineChecked;
        }
    });

    if (arrValidRows.length !== 0) {
        var hasError = false;
        angular.forEach(arrValidRows, function (value) {
            if (value) {
                hasError = true;
            }
        });
        return scope.editBS.IsApplyExistingMemberChecked || !hasError;
    }
    return false;
};
var editCheckedRows = function (curBSRows) {
    $.each(curBSRows, function (index, element) {
        if (element.IsSuperChecked !== undefined && !element.IsSuperChecked) {
            curBSRows[index].IsDownlineChecked = false;
        }
    });
};
// Row is checkable
var editBSRowCheckableFunc = function ($scope, shareSettingsService) {

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
                    element.IsSuperDisabled = element.IsSuperChecked;
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

    $scope.applyExistingMembers = function () {
        var curBSRows = $scope.editBS.BSRows;
        var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
        var nextEnable = getNextEnable($scope, curBSRows, orgBSRows);
        if ($scope.editBS.BSRows.length === 1) {
            $scope.buttonStatus.isNextEnabled = $scope.editBS.IsApplyExistingMemberChecked || nextEnable;
        }
        else {
            $scope.buttonStatus.isNextEnabled = nextEnable;
        }
    };
};
editBSRowCheckableFunc.$inject = ['$scope', 'shareSettingsService'];
// Row is checkable with super and down line
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
            });
        }
    };
};
editBSRowCheckableSuperDownlineFunc.$inject = ['$scope', '$injector'];
var editBSNextEnabilityFunc = function ($scope, $location, shareSettingsService) {
    // Private functions
    var checkDirty = function () {
        $scope.buttonStatus.isNextEnabled = false;
        // A little hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            var curBSRows = $scope.editBS.BSRows;

            if ($scope.isCopyAll === true) {
                editCheckedRows($scope.editBS.BSRows);
                $scope.buttonStatus.isNextEnabled = true;
                return;
            }
            $scope.buttonStatus.isNextEnabled = getNextEnable($scope, curBSRows, orgBSRows);
        }
    };

    $scope.buttonStatus.isNextEnabled = false;

    $scope.$watch("editBS.BSRows", checkDirty, true);
};
editBSNextEnabilityFunc.$inject = ['$scope', '$location', 'shareSettingsService'];
// Check Next constraints
var editBSNextConstraintsFunc = function ($scope, $location, shareSettingsService) {
    var getValidNumber = function (strValue) {
        if (strValue === null || strValue === "") {
            return "0";
        }
        else {
            return strValue;
        }
    };

    $scope.nextReviewBS = function () {
        // Check constraints on submit
        var hasError = false;
        var curBSRows = $scope.editBS.BSRows;
        $.each(curBSRows, function (index, element) {
            if (element.IsRowSelected === true) {

                // Check is dirty
                if (parseFloat(getValidNumber(curBSRows[index].MinBet)) > parseFloat(getValidNumber(curBSRows[index].MaxBet))
                || parseFloat(getValidNumber(curBSRows[index].MaxBet)) > parseFloat(getValidNumber(curBSRows[index].MaxPerMatch))) {
                    hasError = true;
                    return false;
                }

                // If MaxPerBall exists => Check
                if (curBSRows[index].MaxPerBall !== undefined) {
                    if (parseFloat(getValidNumber(curBSRows[index].MaxPerBall)) > parseFloat(getValidNumber(curBSRows[index].MaxPerMatch))
                    || parseFloat(getValidNumber(curBSRows[index].MaxBet)) > parseFloat(getValidNumber(curBSRows[index].MaxPerBall))) {
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

    $scope.changeNextButtonStatus = function () {
        if ($scope.editBS.IsEnableChecked) {
            $scope.buttonStatus.isNextEnabled = true;
            $scope.editBS.IsDownlineDisabled = false;
        }
        else {
            var curBSRows = $scope.editBS.BSRows;
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            $scope.editBS.IsDownlineDisabled = true;
            $scope.editBS.IsDownlineChecked = false;
            $scope.buttonStatus.isNextEnabled = $scope.editBS.IsApplyExistingMemberChecked || getNextEnable($scope, curBSRows, orgBSRows);
        }
    };

    $scope.enableMembers = function () {
        if ($scope.editBS.IsDownlineChecked) {
            $scope.buttonStatus.isNextEnabled = true;
        }
        else {
            var curBSRows = $scope.editBS.BSRows;
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            $scope.buttonStatus.isNextEnabled = ($scope.editBS.IsEnableChecked && !$scope.editBS.IsEnableDisabled)
                                                || $scope.editBS.IsApplyExistingMemberChecked
                                                || getNextEnable($scope, curBSRows, orgBSRows);
        }
    };
};
editBSNextConstraintsFunc.$inject = ['$scope', '$location', 'shareSettingsService'];