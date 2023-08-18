/* exported editBSModelFunc, editDBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc,
editBSNextFunc, editBSNextEnabilityFunc, editBSApplyForPlayerFunc, editBSNextConstraintsFunc */
"use strict";
// Model function
var editBSModelFunc = function ($scope, $http, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = {};
    $scope.agentId = shareSettingsService.getWorkingContext().AgentId;

    function getAgentsHeader() {
        var res = "";
        var agentName = shareSettingsService.getWorkingContext().AgentName;
        var agentList = shareSettingsService.getWorkingContext().AgentList;

        if ($scope.agentId === 0) {
            if (agentList.length >= 8) {
                for (var i = 1; i < 7; i++) {
                    res += agentList[i].Name + ", ";
                }
                res += "...";
            }
            else {
                for (var j = 1; j < agentList.length; j++) {
                    if (j === agentList.length - 1) {
                        res += agentList[j].Name;
                    }
                    else {
                        res += agentList[j].Name + ", ";
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
        "GetEditBetSettingData",
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
            shareSettingsService.saveOrgSettings(angular.copy(data));
            if ($scope.buttonStatus.IsBack) {
                $scope.editBS = shareSettingsService.getCurSettings();
                $scope.editBS.DBSRows = null;
                if ($scope.editBS.isCopyAllFromOne === true) {
                    $scope.listener = $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
            }
            else {
                angular.extend($scope.editBS, data);
            }
            $scope.$parent.invokeLoadingMsg(false);
        })
        .error(function () {
            $scope.$parent.invokeLoadingMsg(false);
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
        "GetDefaultBetSetting",
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
                return;
            }

            var currentBSs = shareSettingsService.getCurSettings().BSRows;
            var oldBSs = shareSettingsService.getOrgSettings().BSRows;
            var applyForPlayers = shareSettingsService.getCurSettings().IsApplyForMembersChecked;
            $.each(data.BSRows, function (index, element) {
                if (!applyForPlayers && currentBSs[index].IsRowSelected) {
                    if (element.MinBet === '') {
                        element.MinBet = oldBSs[index].MinBet;
                        element.MaxBet = oldBSs[index].MaxBet;
                        element.MaxPayoutPerMatch = oldBSs[index].MaxPayoutPerMatch;
                        element.MaxPerMatch = oldBSs[index].MaxPerMatch;
                        element.IsRowSelected = true;
                        element.IsEmptyRow = true;
                        element.IsRowUpdated = true;
                    } else {
                        element.IsRowReview = true;
                    }
                }

                element.UplineMinBet = currentBSs[index].MinBet;
                element.UplineMaxBet = currentBSs[index].MaxBet;
                element.UplineMaxPayoutPerMatch = currentBSs[index].MaxPayoutPerMatch;
                element.UplineMaxPerMatch = currentBSs[index].MaxPerMatch;
            });
            shareSettingsService.saveOrgSettings(angular.copy(data));
            $scope.editBS = data;
            $scope.buttonStatus.isNextEnabled = getNextEnable($scope, $scope.editBS.BSRows, $scope.editBS.BSRows);
            $scope.$parent.invokeLoadingMsg(false);
        })
        .error(function () {
            $scope.$parent.invokeLoadingMsg(false);
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

    $scope.$watch("editBS.BSRows", syncAllSport, true);
};
editBSAllSportFunc.$inject = ['$scope'];

var getNextEnable = function (scope, curBSRows, orgBSRows) {
    var arrValidRows = [];
    var hasChangeValues = false;
    $.each(curBSRows, function (index, element) {
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

        if (element.IsRowSelected === true) {
            if (angular.equals(curRow, orgRow) && !element.IsEmptyRow /* dbs is not empty */) {
                arrValidRows.push(true);
            }
            else {
                hasChangeValues = true;
                arrValidRows.push(false);
            }
        }
        else {
            if (element.IsRowReview) {
                arrValidRows.push(false);
            }
            if (!angular.equals(curRow, orgRow)) {
                curBSRows[index].MinBet = orgBSRows[index].MinBet;
                curBSRows[index].MaxBet = orgBSRows[index].MaxBet;
                curBSRows[index].MaxPerMatch = orgBSRows[index].MaxPerMatch;
                curBSRows[index].MaxPayoutPerMatch = orgBSRows[index].MaxPayoutPerMatch;
            }
        }
    });

    if (arrValidRows.length !== 0) {
        var hasError = false;
        angular.forEach(arrValidRows, function (value) {
            if (value) {
                hasError = true;
            }
        });

        /* check constraints */
        var hasViolate = false;

        $.each(curBSRows, function (index, element) {
            if (element.IsRowSelected === true) {
                // Check valid data
                if (element.MinBet === ""
                    || element.MaxBet === ""
                    || element.MaxPerMatch === ""
                    || element.MaxPayoutPerMatch === ""
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
            return (_.MinBet === ""
                && _.MaxBet === ""
                && _.MaxPerMatch === ""
                && (_.MaxPayoutPerMatch === ""));
        });

        // All rows DBS = ""
        if (scope.isDbsPage && isValidDBSData) {
            hasViolate = false;
        }
        /* end check constrants */

        if (hasChangeValues && scope.editBS.isCopyAllFromOne) {
            return !hasViolate;
        }

        return !hasError && !hasViolate;
    }

    return false;
};

// Row is checkable
var editBSRowCheckableFunc = function ($scope) {
    $scope.editBS.isCopyAllFromOne = false;
    $scope.listener = null;

    $scope.copyAllFromOne = function () {
        $scope.editBS.isCopyAllFromOne = !$scope.editBS.isCopyAllFromOne;

        var copyElem = angular.element(document.querySelector('#copy_setting_icon'));
        if ($scope.editBS.isCopyAllFromOne === true) {
            copyElem.addClass('icon-copy-setting-checked');
            // Reset AllSport
            $scope.isAllSportChecked = true;
            // TODO: Why ng-change not raised?
            $.each($scope.editBS.BSRows, function (index, element) {
                // Disable all checkboxes 0 -> n
                if (index === 0) {
                    element.IsRowDisabled = false;
                    $scope.listener = $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
                else {
                    element.IsRowDisabled = true;
                }
                element.IsRowSelected = true;
            });
        }
        else {
            copyElem.removeClass('icon-copy-setting-checked');
            // Reset AllSport
            $scope.isAllSportChecked = false;
            $.each($scope.editBS.BSRows, function (index, element) {
                if (index === 0) {
                    $scope.listener();
                }

                element.IsRowDisabled = false;
                element.IsRowSelected = false;
            });
        }
    };

    $scope.copyBS = function () {
        if ($scope.editBS.isCopyAllFromOne === true) {
            var firstRowData = $scope.editBS.BSRows[0];
            $.each($scope.editBS.BSRows, function (index, element) {
                element.MinBet = firstRowData.MinBet;
                element.MaxBet = firstRowData.MaxBet;
                element.MaxPerMatch = firstRowData.MaxPerMatch;
                element.MaxPayoutPerMatch = firstRowData.MaxPayoutPerMatch;
            });
        }
    };
};
editBSRowCheckableFunc.$inject = ['$scope'];

var editBSCheckboxState = function ($scope) {
    $scope.disableCheckbox = function (rowData, rowIndex) {
        if ($scope.isDbsPage && rowData.IsEmptyRow) {
            return true;
        }

        if (rowIndex === 0 && $scope.editBS.isCopyAllFromOne) {
            return true;
        }

        return rowData.IsRowDisabled;
    }
}
editBSCheckboxState.$inject = ['$scope'];

var editBSNextEnabilityFunc = function ($scope, shareSettingsService) {
    // Private functions
    var checkDirty = function () {
        $scope.buttonStatus.isNextEnabled = false;
        // A little hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            var curBSRows = $scope.editBS.BSRows;
            $scope.buttonStatus.isNextEnabled = getNextEnable($scope, curBSRows, orgBSRows);

            angular.forEach(curBSRows, function (row) {
                if (row.IsEmptyRow && !row.IsRowSelected) {
                    row.IsRowSelected = true;
                }
            });
        }
    };

    $scope.buttonStatus.isNextEnabled = false;

    $scope.$watch("editBS.BSRows", checkDirty, true);
};
editBSNextEnabilityFunc.$inject = ['$scope', 'shareSettingsService'];

var editBSApplyForPlayerFunc = function ($scope) {
    $scope.editBS.IsApplyForMembersChecked = $scope.option ? true : false;
    $scope.editBS.applyForMember = $scope.option ? 1 : null;
    $scope.editBS.existedMember = false;
    $scope.editBS.isNewMember = false;

    $scope.applyForMembers = function () {
        if ($scope.editBS.IsApplyForMembersChecked) {
            $scope.editBS.applyForMember = 1;
        } else {
            $scope.editBS.applyForMember = null;
        }
    };

    var checkApplyForMember = function () {
        if ($scope.editBS.applyForMember == 1) {
            $scope.editBS.existedMember = true;
            $scope.editBS.isNewMember = true;
        } else if ($scope.editBS.applyForMember == 2) {
            $scope.editBS.existedMember = false;
            $scope.editBS.isNewMember = true;
        } else if ($scope.editBS.applyForMember == 3) {
            $scope.editBS.existedMember = true;
            $scope.editBS.isNewMember = false;
        } else {
            $scope.editBS.existedMember = false;
            $scope.editBS.isNewMember = false;
        }
    }
    $scope.$watch("editBS.applyForMember", checkApplyForMember, true);
}
editBSApplyForPlayerFunc.$inject = ['$scope', 'shareSettingsService'];

// Check Next constraints
var editBSNextConstraintsFunc = function ($scope, shareSettingsService) {

    $scope.nextReviewBS = function () {
        var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
        var curBSRows = $scope.editBS.BSRows;

        $.each(curBSRows, function (index, row) {
            if (row.IsRowSelected) {
                if (row.MinBet === orgBSRows[index].MinBet
                    && row.MaxBet === orgBSRows[index].MaxBet
                    && row.MaxPerMatch === orgBSRows[index].MaxPerMatch
                    && row.MaxPayoutPerMatch === orgBSRows[index].MaxPayoutPerMatch
                    && !row.IsEmptyRow) {

                    row.IsRowUpdated = false;
                } else {
                    row.IsRowUpdated = true;
                }
            } else {
                if (row.IsRowUpdated) {
                    row.IsRowUpdated = false;
                }
            }
        });

        if ($scope.isDbsPage === true) {
            angular.extend(shareSettingsService.getCurSettings(), { DBSRows: angular.copy($scope.editBS.BSRows) });
        } else {
            shareSettingsService.saveCurSettings($scope.editBS);
        }

        $scope.checkBS($scope.isDbsPage);
    };
};
editBSNextConstraintsFunc.$inject = ['$scope', 'shareSettingsService'];