/* exported editBSModelFunc, editDBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc,
editBSNextFunc, editBSNextEnabilityFunc, editBSApplyForPlayerFunc, editBSNextConstraintsFunc */
"use strict";
// Model function
var editBSModelFunc = function ($scope, $http, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = {};
    $scope.agentId = shareSettingsService.getWorkingContext().AgentId;
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;

    function getAgentsHeader() {
        var res = "";
        var agentName = shareSettingsService.getWorkingContext().AgentName;
        var agentList = shareSettingsService.getWorkingContext().AgentList;

        if ($scope.agentId === 0) {
            if (agentList.length >= 7) {
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
                prodId: shareSettingsService.getWorkingContext().ProdId,
                agentId: $scope.agentId,
                option: $scope.option
            },
            headers: getAjaxHeader()
        })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));
            if ($scope.buttonStatus.IsBack) {
                $scope.editBS = shareSettingsService.getCurSettings();
                $scope.editBS.DBSRows = {};
                if ($scope.editBS.isCopyAllFromOne === true) {
                    $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
            }
            else {
                angular.extend($scope.editBS, data);
            }
        });
};
editBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];

var editDBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.editBS = {};
    $scope.isDBS = true;
    $scope.agentId = shareSettingsService.getWorkingContext().AgentId;

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
                custId: shareSettingsService.getWorkingContext().CustId,
                agentId: $scope.agentId === 0 ? null : $scope.agentId,
                productTypeId: shareSettingsService.getWorkingContext().ProdId
            },
            headers: getAjaxHeader()
        })
        .success(function (data) {
            var bsRows = {
                BSRows: []
            };

            $.each(data, function (index, element) {
                bsRows.BSRows.push({
                    MinBet: element.MinBet || '',
                    MaxBet: element.MaxBet || '',
                    MaxPerMatch: element.MaxPerMatch || '',
                    MaxPerBall: element.MaxPerBall || '',
                    MaxPayoutPerMatch: element.MaxPayoutPerMatch || '',
                    SportTypeId: element.SportTypeId,
                    BetTypeId: element.BetType,
                    SportTypeId: element.SportOrGame.Id,
                    SportTypeName: element.SportOrGame.Name,
                    IsRowDisabled: false,
                    IsRowSelected: false,
                    UpLineMaxBet: shareSettingsService.getCurSettings().BSRows[index].MaxBet,
                    UpLineMaxPayoutPerMatch: shareSettingsService.getCurSettings().BSRows[index].MaxPayoutPerMatch,
                    UpLineMaxPerMatch: shareSettingsService.getCurSettings().BSRows[index].MaxPerMatch,
                    UpLineMinBet: shareSettingsService.getCurSettings().BSRows[index].MinBet
                });
            });
            shareSettingsService.saveOrgSettings(angular.copy(bsRows));

            angular.extend($scope.editBS, bsRows);
        });
}
editDBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];

// Navigator function
var editBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
    // Redirect if wrong context
    var selectedContext = shareSettingsService.getWorkingContext();
    if (selectedContext.FuncName !== ContextFunc.BetSetting && selectedContext.FuncName !== ContextFunc.DefaultBetSetting) {
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
var editBSAllSportFunc = function ($scope, shareSettingsService) {

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
editBSAllSportFunc.$inject = ['$scope', 'shareSettingsService'];
var getNextEnable = function (scope, curBSRows, orgBSRows) {
    var arrValidRows = [];
    $.each(curBSRows, function (index, element) {
        if (element.IsRowSelected === true) {
            var orgRow = {
                MinBet: orgBSRows[index].MinBet,
                MaxBet: orgBSRows[index].MaxBet,
                MaxPerMatch: orgBSRows[index].MaxPerMatch,
                MaxPayoutPerMatch: orgBSRows[index].MaxPayoutPerMatch,
                UpLineMinBet: orgBSRows[index].UpLineMinBet,
                UpLineMaxBet: orgBSRows[index].UpLineMaxBet,
                UpLineMaxPerMatch: orgBSRows[index].UpLineMaxPerMatch,
                UpLineMaxPayoutPerMatch: orgBSRows[index].UpLineMaxPayoutPerMatch,
                MaxPerBall: orgBSRows[index].MaxPerBall !== undefined ? orgBSRows[index].MaxPerBall : undefined,
                IsSuperChecked: orgBSRows[index].IsSuperChecked !== undefined ? orgBSRows[index].IsSuperChecked : undefined,
                IsDownlineChecked: orgBSRows[index].IsDownlineChecked !== undefined ? orgBSRows[index].IsDownlineChecked : undefined
            };

            var curRow = {
                MinBet: curBSRows[index].MinBet,
                MaxBet: curBSRows[index].MaxBet,
                MaxPerMatch: curBSRows[index].MaxPerMatch,
                MaxPayoutPerMatch: curBSRows[index].MaxPayoutPerMatch,
                UpLineMinBet: curBSRows[index].UpLineMinBet,
                UpLineMaxBet: curBSRows[index].UpLineMaxBet,
                UpLineMaxPerMatch: curBSRows[index].UpLineMaxPerMatch,
                UpLineMaxPayoutPerMatch: curBSRows[index].UpLineMaxPayoutPerMatch,
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
            curBSRows[index].MaxPayoutPerMatch = orgBSRows[index].MaxPayoutPerMatch;
            curBSRows[index].IsSuperChecked = orgBSRows[index].IsSuperChecked;
            curBSRows[index].IsDownlineChecked = orgBSRows[index].IsDownlineChecked;
            curBSRows[index].UpLineMinBet = orgBSRows[index].UpLineMinBet;
            curBSRows[index].UpLineMaxBet = orgBSRows[index].UpLineMaxBet;
            curBSRows[index].UpLineMaxPerMatch = orgBSRows[index].UpLineMaxPerMatch;
            curBSRows[index].UpLineMaxPayoutPerMatch = orgBSRows[index].UpLineMaxPayoutPerMatch;
        }
    });

    if (arrValidRows.length !== 0) {
        var hasError = false;
        angular.forEach(arrValidRows, function (value) {
            if (value) {
                hasError = true;
            }
        });
        return scope.editBS.IsApplyForMembersChecked || !hasError;
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
    $scope.editBS.isCopyAllFromOne = false;

    $scope.copyAllFromOne = function () {
        $scope.editBS.isCopyAllFromOne = !$scope.editBS.isCopyAllFromOne;
        $scope.isAllSportChecked = $scope.editBS.isCopyAllFromOne;

        var copyElem = angular.element(document.querySelector('#copy_setting_icon'));
        if ($scope.editBS.isCopyAllFromOne === true) {
            copyElem.addClass('icon-copy-setting-checked');
            // TODO: Why ng-change not raised?
            $scope.checkAllSports();
            $.each($scope.editBS.BSRows, function (index, element) {
                // Disable all checkboxes 0 -> n
                if (index === 0) {
                    element.IsRowDisabled = false;
                    $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
                else {
                    element.IsRowDisabled = true;
                    element.IsSuperDisabled = element.IsSuperChecked;
                }
                element.IsRowSelected = true;
            });
        }
        else {
            // Reset AllSport
            copyElem.removeClass('icon-copy-setting-checked');
            $.each($scope.editBS.BSRows, function (index, element) {
                if (index === 0) {
                    $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
                element.IsRowSelected = false;
                element.IsRowDisabled = false;
            });
        }
    };

    $scope.copyBS = function () {
        if ($scope.isAllSportChecked === true) {
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
editBSRowCheckableFunc.$inject = ['$scope', 'shareSettingsService'];
// Row is checkable with super and down line
var editBSRowCheckableSuperDownlineFunc = function ($scope, $injector) {
    // Inherit editBSRowCheckableFunc
    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    // Override
    $scope.copyBS = function () {
        if ($scope.isAllSportChecked === true) {
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
editBSRowCheckableSuperDownlineFunc.$inject = ['$scope', '$injector'];

var editBSNextEnabilityFunc = function ($scope, $location, shareSettingsService) {
    // Private functions
    var checkDirty = function () {
        $scope.buttonStatus.isNextEnabled = false;
        // A little hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            var curBSRows = $scope.editBS.BSRows;
            if ($scope.isAllSportChecked === true) {
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

var editBSApplyForPlayerFunc = function ($scope, shareSettingsService) {
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
        var curBSRows = $scope.editBS.BSRows;
        var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
        var nextEnable = getNextEnable($scope, curBSRows, orgBSRows);
        if ($scope.editBS.BSRows.length === 1) {
            $scope.buttonStatus.isNextEnabled = $scope.editBS.IsApplyForMembersChecked || nextEnable;
        }
        else {
            $scope.buttonStatus.isNextEnabled = nextEnable;
        }
    };

    var checkApplyForMember = function () {
        if ($scope.editBS.applyForMember == 1) {
            $scope.editBS.existedMember = true;
            $scope.editBS.isNewMember = true;
        } else if ($scope.editBS.applyForMember == 2) {
            $scope.editBS.existedMember = false;
            $scope.editBS.isNewMember = true;
        } else {
            $scope.editBS.existedMember = false;
            $scope.editBS.isNewMember = false;
        }
    }
    $scope.$watch("editBS.applyForMember", checkApplyForMember, true);
}
editBSApplyForPlayerFunc.$inject = ['$scope', 'shareSettingsService'];

// Check Next constraints
var editBSNextConstraintsFunc = function ($scope, $location, shareSettingsService) {

    $scope.nextReviewBS = function () {
        // Check constraints on submit
        var hasError = false;
        var curBSRows = $scope.editBS.BSRows;

        for (var index = 0; index < curBSRows.length; index++) {
            // Check DBS
            if (($scope.isDBS === true && $scope.editBS.isCopyAllFromOne)
                && curBSRows[index].MinBet === ""
                && curBSRows[index].MaxBet === ""
                && curBSRows[index].MaxPerMatch === ""
                && curBSRows[index].MaxPayoutPerMatch === "") {
                break;
            }

            // Check valid data
            if (curBSRows[index].MinBet === ""
                || curBSRows[index].MaxBet === ""
                || curBSRows[index].MaxPerMatch === ""
            ) {
                hasError = true;
                break;
            }

            if (curBSRows[index].IsRowSelected === true) {
                // Check is dirty
                if (parseFloat(curBSRows[index].MinBet) > parseFloat(curBSRows[index].MaxBet)
                    || parseFloat(curBSRows[index].MaxBet) > parseFloat(curBSRows[index].MaxPerMatch)) {
                    hasError = true;
                    break;
                }

                // If Product = Sportsbook && agentId != 0 => Check
                if ($scope.agentId !== 0
                    && shareSettingsService.getWorkingContext().ProdId === 1
                    && parseFloat(curBSRows[index].MinBet) < parseFloat(curBSRows[index].UpLineMinBet)
                    || parseFloat(curBSRows[index].MaxBet) > parseFloat(curBSRows[index].UpLineMaxBet)
                    || parseFloat(curBSRows[index].MaxPerMatch) > parseFloat(curBSRows[index].UpLineMaxPerMatch)
                    || parseFloat(curBSRows[index].MaxPayoutPerMatch) > parseFloat(curBSRows[index].UpLineMaxPayoutPerMatch)
                ) {
                    hasError = true;
                    break;
                }

                // If MaxPerBall exists => Check
                if (curBSRows[index].MaxPerBall) {
                    if (curBSRows[index].MaxPerBall === ""
                        || parseFloat(curBSRows[index].MaxPerBall) > parseFloat(curBSRows[index].MaxPerMatch)
                        || parseFloat(curBSRows[index].MaxBet) > parseFloat(curBSRows[index].MaxPerBall)
                    ) {
                        hasError = true;
                        break;
                    }
                }

                // If MaxPayoutPerMatch exists => Check
                if (curBSRows[index].MaxPayoutPerMatch) {
                    if (curBSRows[index].MaxPayoutPerMatch === "" || parseFloat(curBSRows[index].MaxPerMatch) > parseFloat(curBSRows[index].MaxPayoutPerMatch)
                    ) {
                        hasError = true;
                        break;
                    }
                }
            }
        }

        if (hasError === true) {
            return;
        }

        if ($scope.isDBS === true) {
            angular.extend(shareSettingsService.getCurSettings(), { DBSRows: angular.copy($scope.editBS.BSRows) });
        } else {
            shareSettingsService.saveCurSettings($scope.editBS);
        }

        if (shareSettingsService.getWorkingContext().ProdId === 1) {
            shareSettingsService.getWorkingContext().Url = 'CheckBetSettingSportsbook';

            $scope.checkBS();
        } else {
            $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
        }
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
            $scope.buttonStatus.isNextEnabled = $scope.editBS.IsApplyForMembersChecked || getNextEnable($scope, curBSRows, orgBSRows);
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
                || $scope.editBS.IsApplyForMembersChecked
                || getNextEnable($scope, curBSRows, orgBSRows);
        }
    };
};
editBSNextConstraintsFunc.$inject = ['$scope', '$location', 'shareSettingsService'];