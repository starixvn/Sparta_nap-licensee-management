/* exported editBSModelFunc, editDBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc,
editBSNextFunc, editBSNextEnabilityFunc, editBSApplyForPlayerFunc, editBSNextConstraintsFunc */
'use strict';
// Model function
var editBSModelFunc = function ($scope, $http, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = { DBSRows: [] };
    $scope.agentId = shareSettingsService.getWorkingContext().AgentId;

    function getAgentsHeader() {
        var res = '';
        var agentName = shareSettingsService.getWorkingContext().AgentName;
        var agentList = shareSettingsService.getWorkingContext().AgentList;

        if ($scope.agentId === 0) {
            if (agentList.length >= 8) {
                for (var i = 1; i < 7; i++) {
                    res += agentList[i].Name + ', ';
                }
                res += '...';
            }
            else {
                for (var j = 1; j < agentList.length; j++) {
                    if (j === agentList.length - 1) {
                        res += agentList[j].Name;
                    }
                    else {
                        res += agentList[j].Name + ', ';
                    }
                }
            }
        }
        else {
            res = agentName;
        }
        return res;
    }

    $scope.header = getAgentsHeader();

    function getAjaxHeader() {
        return {
            'FROM-ANGULAR': 'true',
            'X-Requested-With': 'XMLHttpRequest',
            'If-Modified-Since': '0'
        };
    }

    $http.get(
        'GetEditBetSettingData',
        {
            params: {
                custId: shareSettingsService.getWorkingContext().CustId,
                productTypeId: shareSettingsService.getWorkingContext().ProdId,
                agentId: $scope.agentId,
                option: $scope.option
            },
            headers: getAjaxHeader()
        })
        .success(function (data) {
            $scope.orgData.BSs = angular.copy(data.BSRows);
            shareSettingsService.saveOrgSettings(angular.copy(data));
            if ($scope.buttonStatus.IsBack) {
                $scope.editBS = shareSettingsService.getCurSettings();
            }
            else {
                $scope.editBS.BSRows = angular.copy(data.BSRows);
            }

            site.invokeLoadingMsg(false);
        })
        .error(function () {
            site.invokeLoadingMsg(false);
            alert(site.requestErrMsg);
        });;
};
editBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];

var editDBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.editBS = {};
    $scope.isDbsPage = true;

    function getAjaxHeader() {
        return {
            'FROM-ANGULAR': 'true',
            'X-Requested-With': 'XMLHttpRequest',
            'If-Modified-Since': '0'
        };
    }

    $http.get(
        'GetDefaultBetSetting',
        {
            params: {
                licenseeName: shareSettingsService.getWorkingContext().LicenseeName,
                currencyId: shareSettingsService.getWorkingContext().CurrencyId,
                agentId: $scope.agentIdByErrorCode === 0 ? null : $scope.agentIdByErrorCode,
                productTypeId: shareSettingsService.getWorkingContext().ProdId
            },
            headers: getAjaxHeader()
        })
        .success(function (data) {
            if (typeof data !== 'object') {
                site.invokeLoadingMsg(false);
                return;
            }

            var currentDbs = angular.copy(data);
            $scope.orgData.DBSs = angular.copy(data.BSRows);

            var currentBSs = shareSettingsService.getCurSettings().BSRows;
            var oldBSs = shareSettingsService.getOrgSettings().BSRows;
            var applyForPlayers = shareSettingsService.getCurSettings().IsApplyForMembersChecked;
            $.each(currentDbs.BSRows, function (index, element) {
                var isRowSelected = currentBSs[index].IsRowSelected;

                if (!applyForPlayers && isRowSelected) {
                    if (element.MinBet === '') {
                        var oldBS = oldBSs[index];
                        element.MinBet = oldBS.MinBet;
                        element.MaxBet = oldBS.MaxBet;
                        element.MaxPayoutPerMatch = oldBS.MaxPayoutPerMatch;
                        element.MaxPerMatch = oldBS.MaxPerMatch;
                        element.IsRowSelected = true;
                    }
                    element.IsRowReview = true;
                }

                var bsToUpdate = isRowSelected ? currentBSs[index] : oldBSs[index];
                element.UplineMinBet = bsToUpdate.MinBet;
                element.UplineMaxBet = bsToUpdate.MaxBet;
                element.UplineMaxPayoutPerMatch = bsToUpdate.MaxPayoutPerMatch;
                element.UplineMaxPerMatch = bsToUpdate.MaxPerMatch;
            });

            shareSettingsService.saveOrgSettings(angular.copy(data));
            $scope.editBS.BSRows = angular.copy(currentDbs.BSRows);
            $scope.buttonStatus.isNextEnabled = getNextEnable($scope, $scope.editBS.BSRows, $scope.orgData.DBSs);
            site.invokeLoadingMsg(false);
        })
        .error(function () {
            site.invokeLoadingMsg(false);
            alert(site.requestErrMsg);
        });
}
editDBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];

// Navigator function
var editBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
    // Redirect if wrong context
    var selectedContext = shareSettingsService.getWorkingContext();
    if (selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.backEditBS = function () {
        $scope.buttonStatus.IsBack = true;

        $scope.orgData.BSs = [];
        $scope.orgData.DBSs = [];
        shareSettingsService.getCurSettings().DBSRows = [];

        shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;
        $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
    };
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

    $scope.$watch('editBS.BSRows', syncAllSport, true);
};
editBSAllSportFunc.$inject = ['$scope'];

var getNextEnable = function (scope, curBSRows, orgBSRows) {
    var arrChangedData = [];
    $.each(curBSRows, function (index, element) {
        var hasChangeValue = false;
        var orgRow = {
            MinBet: orgBSRows[index].MinBet,
            MaxBet: orgBSRows[index].MaxBet,
            MaxPerMatch: orgBSRows[index].MaxPerMatch,
            MaxPayoutPerMatch: orgBSRows[index].MaxPayoutPerMatch
        };

        var curRow = {
            MinBet: curBSRows[index].MinBet,
            MaxBet: curBSRows[index].MaxBet,
            MaxPerMatch: curBSRows[index].MaxPerMatch,
            MaxPayoutPerMatch: curBSRows[index].MaxPayoutPerMatch
        };

        if (element.IsRowSelected) {
            scope.buttonStatus.isCopyDisabled = false;

            hasChangeValue = !angular.equals(curRow, orgRow);
            arrChangedData.push(hasChangeValue);
        } else {
            if (!!element.IsRowReview) {
                arrChangedData.push(true);
            }
        }
    });

    if (arrChangedData.length > 0) {
        var hasNotChangeValue = arrChangedData.find(function (value) {
            return !value;
        });

        if (hasNotChangeValue !== undefined) {
            return false;
        }

        /* check constraints */
        var hasViolate = false;

        $.each(curBSRows, function (index, element) {
            if (element.IsRowSelected === true) {
                // Check valid data
                if (element.MinBet === ''
                    || element.MaxBet === ''
                    || element.MaxPerMatch === ''
                    || element.MaxPayoutPerMatch === ''
                ) {
                    hasViolate = true;
                    return false;
                }

                // Check is dirty
                if (parseFloat(element.MinBet) > parseFloat(element.MaxBet)
                    || parseFloat(element.MaxBet) > parseFloat(element.MaxPerMatch)
                    || parseFloat(element.MaxPerMatch) > parseFloat(element.MaxPayoutPerMatch)
                ) {
                    hasViolate = true;
                    return false;
                }
            }
        });

        var isValidDBSData = curBSRows.every(function (_) {
            return (_.MinBet === ''
                && _.MaxBet === ''
                && _.MaxPerMatch === ''
                && (_.MaxPayoutPerMatch === ''));
        });

        // All rows DBS = ''
        if (scope.isDbsPage && isValidDBSData) {
            hasViolate = false;
        }
        /* end check constraints */

        return !hasViolate;
    }

    return false;
};

// Row is checkable
var editBSRowCheckableFunc = function ($scope) {
    $scope.copyAllFromOne = function () {
        if ($scope.buttonStatus.isCopyDisabled) {
            return;
        }

        var bsRows = $scope.editBS.BSRows;
        var firstIndex = bsRows.findIndex(function (row) {
            return !!row.IsRowSelected;
        });

        if (firstIndex !== -1) {
            for (var i = firstIndex + 1; i < bsRows.length; i++) {
                if (bsRows[i].IsRowSelected) {
                    bsRows[i].MinBet = bsRows[firstIndex].MinBet;
                    bsRows[i].MaxBet = bsRows[firstIndex].MaxBet;
                    bsRows[i].MaxPerMatch = bsRows[firstIndex].MaxPerMatch;
                    bsRows[i].MaxPayoutPerMatch = bsRows[firstIndex].MaxPayoutPerMatch;
                }
            }
        }
    };
};
editBSRowCheckableFunc.$inject = ['$scope'];

var editBSNextEnabilityFunc = function ($scope, shareSettingsService) {
    // Private functions
    var checkDirty = function () {
        $scope.buttonStatus.isNextEnabled = false;
        $scope.buttonStatus.isCopyDisabled = true;
        // A little hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            var curBSRows = $scope.editBS.BSRows;
            $scope.buttonStatus.isNextEnabled = getNextEnable($scope, curBSRows, orgBSRows);
        }
    };

    $scope.buttonStatus.isNextEnabled = false;

    $scope.$watch('editBS.BSRows', checkDirty, true);
};
editBSNextEnabilityFunc.$inject = ['$scope', 'shareSettingsService'];

var editBSApplyForPlayerFunc = function ($scope) {
    $scope.editBS.IsApplyForMembersChecked = $scope.option ? true : false;
    $scope.editBS.applyForMember = $scope.option ? 1 : -1;
    $scope.editBS.existedMember = false;
    $scope.editBS.isNewMember = false;

    $scope.applyForMembers = function () {
        if ($scope.editBS.IsApplyForMembersChecked) {
            $scope.editBS.applyForMember = 1;
        } else {
            $scope.editBS.applyForMember = -1;
        }
    };

    var checkApplyForMember = function () {
        if ($scope.editBS.applyForMember === 1) {
            $scope.editBS.existedMember = true;
            $scope.editBS.isNewMember = true;
        } else if ($scope.editBS.applyForMember === 2) {
            $scope.editBS.existedMember = false;
            $scope.editBS.isNewMember = true;
        } else if ($scope.editBS.applyForMember === 3) {
            $scope.editBS.existedMember = true;
            $scope.editBS.isNewMember = false;
        } else {
            $scope.editBS.existedMember = false;
            $scope.editBS.isNewMember = false;
        }
    }
    $scope.$watch('editBS.applyForMember', checkApplyForMember, true);
}
editBSApplyForPlayerFunc.$inject = ['$scope', 'shareSettingsService'];

// Check Next constraints
var editBSNextConstraintsFunc = function ($scope, shareSettingsService) {

    $scope.nextReviewBS = function () {
        if (!$scope.buttonStatus.isNextEnabled) {
            return;
        }

        if ($scope.isDbsPage === true) {
            angular.extend(shareSettingsService.getCurSettings(), { DBSRows: angular.copy($scope.editBS.BSRows) });
        } else {
            shareSettingsService.saveCurSettings($scope.editBS);
        }

        $scope.checkBS($scope.isDbsPage);
    };
};
editBSNextConstraintsFunc.$inject = ['$scope', 'shareSettingsService'];