/* exported ContextFunc */
"use strict";
var licenseeBetSettingApp = licenseeBetSettingApp || {};
// Module
licenseeBetSettingApp = angular.module("licenseeBetSetting",
    ["ngRoute", "ngAnimate", "ngSanitize", "licenseeBetSetting.services", "licenseeBetSetting.directives", "fanex.dropdowntreesingle"]);

// Constant
licenseeBetSettingApp.constant("GetLicenseeListUrl", "GetLicenseeList");
licenseeBetSettingApp.constant("GetSuperLicenseeListUrl", "GetSuperLicenseeList");
licenseeBetSettingApp.constant("GetProductTypeListUrl", "GetProductTypeList");
licenseeBetSettingApp.constant("GetSettingsUrl", "GetSettings");
licenseeBetSettingApp.constant("GetLicenseeAgentListUrl", "GetLicenseeAgentList");
licenseeBetSettingApp.constant("SportsbookDBSErrCode", {
    Currency_Agent_NotIncludePlayer_ViolatedAgentDBSCode: 103,
    Currency_Agent_NotIncludePlayer_ViolatedCurrencyDBSCode: 106,
    Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode: 107,
    Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode: 108
});

// Routing
licenseeBetSettingApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/EditBetSetting/:productTypeId', {
        templateUrl: function (params) {
            return 'EditBetSetting/?productTypeId=' + params.productTypeId;
        }
    });
    $routeProvider.when('/EditDefaultBetSetting/:productTypeId', {
        templateUrl: function (params) {
            return 'EditDefaultBetSetting/?productTypeId=' + params.productTypeId;
        }
    });
    $routeProvider.when('/ReviewBetSetting/:productTypeId', {
        templateUrl: function (params) {
            return 'ReviewBetSetting/?productTypeId=' + params.productTypeId;
        }
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
} ]);

// Fix IsAjaxRequest
licenseeBetSettingApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
} ]);

licenseeBetSettingApp.value("ContextFunc", {
    BetSetting: "Bet Setting",
    CurrencyBetSetting: "Currency Bet Setting",
    PlayerBetSetting: "Player Bet Setting"
});
﻿/* exported editBSModelFunc, editDBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc,
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
﻿/* global licenseeBetSettingApp, editBSModelFunc, editBSApplyForPlayerFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
licenseeBetSettingApp.controller("editBSSportsbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });
}]);

﻿/* global licenseeBetSettingApp, editDBSModelFunc, editBSApplyForPlayerFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
licenseeBetSettingApp.controller("editDBSSportsbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editDBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });

    $injector.invoke(editBSCheckboxState, this, { $scope: $scope });
}]);

﻿/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

"use strict";

// Model function
var reviewBSModelFunc = function ($scope, shareSettingsService) {
    $scope.reviewBS = shareSettingsService.getCurSettings();

    $scope.isShowDBS = function () {
        var DBSRows = $scope.reviewBS.DBSRows;
        if (DBSRows === undefined || DBSRows === null || angular.equals({}, DBSRows)) {
            return false;
        }

        var isValidDBSData = DBSRows.every(function (_) {
            return (_.MinBet === ""
                && _.MaxBet === ""
                && _.MaxPerMatch === ""
                && (_.MaxPayoutPerMatch === ""));
        });

        if (isValidDBSData) {
            return false;
        }

        return true;
    }

    function getAgentsHeader() {
        var res = "";
        var agentId = shareSettingsService.getWorkingContext().AgentId;
        var agentName = shareSettingsService.getWorkingContext().AgentName;
        var agentList = shareSettingsService.getWorkingContext().AgentList;

        if (agentId === 0) {
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
};
reviewBSModelFunc.$inject = ['$scope', 'shareSettingsService'];
// Navigator function
var reviewBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
    // Redirect if wrong context
    var selectedContext = shareSettingsService.getWorkingContext();
    if (selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.backEditBS = function () {
        if ($scope.buttonStatus.isUpdated) {
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isNextEnabled = false;
            $scope.buttonStatus.IsBack = false;
        }
        else {
            $scope.buttonStatus.IsBack = true;
        }

        $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
    };
};
reviewBSNavigatorFunc.$inject = ['$scope', '$location', 'shareSettingsService', 'ContextFunc'];

﻿/* global licenseeBetSettingApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

licenseeBetSettingApp.controller("reviewBSSportsbookCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
 function ($scope, $injector, $http, $location, $route, shareSettingsService) {
     // Inherit
     $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

     $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

     shareSettingsService.getWorkingContext().Url = "UpdateBetSettingSportsbook";
     
 } ]);

﻿"use strict";

// Main controller

licenseeBetSettingApp.controller("licenseeBetSettingCtrl", [
    '$scope', '$http', '$location', '$route', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl', 'SportsbookDBSErrCode',
    function ($scope, $http, $location, $route, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl, SportsbookDBSErrCode) {
        $scope.option = 0;
        $scope.invertedSymbol = false; // to set DBS UI
        $scope.agentIdByErrorCode = -1; // to get DBS

        // Load data for ddls
        $scope.filterData = {
            // licensees
            // superLicensees
            // productTypes
            // selectedLicensee
            // selectedSuperLicensee
            // selectedProductType
            // selectedFunction
        };

        $scope.invokeLoadingMsg = function (visible) {
            $.blockUI.defaults.overlayCSS.opacity = 0;
            $.blockUI.defaults.css = {};

            if (visible) {
                $.blockUI({ message: '<div class="icon-loading"></div>' });

                $scope.buttonStatus.isButtonEnable = false;
            }
            else {
                $.unblockUI();
                $scope.buttonStatus.isButtonEnable = true;
            }
        };

        $scope.buttonStatus = {
            isNextEnabled: false,
            isBack: false,
            isUpdated: false,
            isButtonEnable: false,
            isSuccess: true
        };

        $scope.TextSettings = {
            Filter: 'Search'
        };

        $scope.selectedProductTypeChanged = function () {
            $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
        };

        $scope.selectedLicenseeChanged = function () {
            $scope.invokeLoadingMsg(true);
            $http.get(
                GetSuperLicenseeListUrl,
                {
                    params: { siteName: $scope.filterData.selectedLicensee.Name }
                }
            )
                .success(function (data) {
                    $scope.filterData.superLicensees = data;
                    $scope.filterData.selectedSuperLicensee = data[0];
                    $scope.superLicenseeSettings = {
                        idMember: "Id",
                        nameMember: "CurrencyWithSuper",
                        sourceData: data,
                        hasToolbar: false,
                        hasFilter: true,
                        hasEnter: false,
                        width: '100%',
                    }

                    if (data.length === 0) {
                        $scope.filterData.selectedAgent = undefined;
                        $scope.agentSettings = {
                            idMember: "Id",
                            nameMember: "Name",
                            sourceData: [],
                            hasToolbar: false,
                            hasFilter: true,
                            hasEnter: false,
                            width: '100%',
                        };
                    }
                });
        };

        $scope.selectedSuperLicenseeChanged = function (SRecommend) {
            $scope.invokeLoadingMsg(true);
            $http.get(
                GetLicenseeAgentListUrl,
                {
                    params: { SRecommend: SRecommend }
                }
            )
                .success(function (data) {
                    $scope.filterData.agents = data;
                    $scope.filterData.selectedAgent = data[0];
                    $scope.agentSettings = {
                        idMember: "Id",
                        nameMember: "Name",
                        sourceData: data,
                        hasToolbar: false,
                        hasFilter: true,
                        hasEnter: false,
                        width: '100%',
                    };

                    $scope.invokeLoadingMsg(false);
                });
        };

        $http.get(GetSettingsUrl)
            .success(function (data) {
                $scope.filterData.licensees = data.LicenseeList;
                $scope.filterData.selectedLicensee = data.LicenseeList[0];
                $scope.licenseeSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.LicenseeList,
                    hasToolbar: false,
                    hasFilter: true,
                    hasEnter: false,
                    width: '100%',
                }

                if (data.LicenseeList.length === 0) {
                    $scope.filterData.selectedSuperLicensee = undefined;
                    $scope.superLicenseeSettings = {
                        idMember: "Id",
                        nameMember: "CurrencyWithSuper",
                        sourceData: [],
                        hasToolbar: false,
                        hasFilter: true,
                        hasEnter: false,
                        width: '100%',
                    }
                }

                $scope.filterData.productTypes = data.ProductTypeList;
                $scope.filterData.selectedProductType = data.ProductTypeList[0];
                $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
            });

        $scope.selectEventHandler = function () {
            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting) {
                $scope.option = 0; // Currency Bet Setting
            } else if ($scope.filterData.selectedFunction === ContextFunc.PlayerBetSetting) {
                $scope.option = 1; // Player Bet Setting
            }

            // Save working context
            shareSettingsService.saveWorkingContext({
                FuncName: ContextFunc.BetSetting,
                LicenseeName: $scope.filterData.selectedLicensee.Name,
                CustId: $scope.filterData.selectedSuperLicensee.Id,
                CurrencyId: $scope.filterData.selectedSuperLicensee.CurrencyId,
                ProdId: $scope.filterData.selectedProductType.Id,
                AgentId: $scope.filterData.selectedAgent.Id,
                AgentName: $scope.filterData.selectedAgent.Name,
                AgentList: $scope.filterData.agents
            });

            // Refresh button on page.
            $scope.buttonStatus.IsBack = false;
            $scope.buttonStatus.isUpdated = false;
            $scope.invokeLoadingMsg(true);

            var curPath = $location.path();

            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting || $scope.filterData.selectedFunction === ContextFunc.PlayerBetSetting) {
                shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;

                if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                    $route.reload();
                }
                $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
            }
        };

        $scope.updateBS = function () {
            $scope.buttonStatus.isUpdated = true;
            $scope.buttonStatus.isButtonEnable = false;

            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            var startIndex = 0;
            postBetSetting(editedBSRows, editedDBSRows, startIndex);
        };

        $scope.checkBS = function (isDbsPage) {
            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            checkBetSetting(editedBSRows, editedDBSRows, isDbsPage);
        }

        var getEditedRows = function () {
            var bsRows = shareSettingsService.getCurSettings().BSRows;
            var dbsRows = shareSettingsService.getCurSettings().DBSRows;
            var result = {
                BSRows: [],
                DBSRows: []
            };

            for (var i = 0; i < bsRows.length; i++) {
                if ((bsRows[i].IsRowSelected && bsRows[i].IsRowUpdated) || (dbsRows != null && dbsRows[i].IsRowSelected && dbsRows[i].IsRowUpdated)) {
                    bsRows[i].Index = i;
                    result.BSRows.push(bsRows[i]);
                    if (dbsRows !== null) {
                        dbsRows[i].Index = i;
                        result.DBSRows.push(dbsRows[i]);
                    }
                }
            }

            return result;
        }

        var updatedParams = function () {
            return {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProdId: shareSettingsService.getWorkingContext().ProdId,
                AgentId: shareSettingsService.getWorkingContext().AgentId,
                Option: $scope.option,
                ExistedMember: shareSettingsService.getCurSettings().existedMember,
                IsNewMember: shareSettingsService.getCurSettings().isNewMember
                // BSRows
                // DBRows
            }
        };

        var goToEditDBPage = function (workingContext) {
            $("#confirm-box").removeClass("hidden");
            $("#confirm-box").dialog({
                resizable: false,
                height: 200,
                width: 540,
                modal: true,
                buttons: {
                    "OK": {
                        text: 'Yes',
                        'class': 'btn-primary btn-ok',
                        click: function () {
                            $("#confirm-box").addClass("hidden");
                            $(this).dialog("close");
                            var curPath = location.pathname;
                            if (curPath !== "/EditDefaultBetSetting/" + workingContext.ProdId) {
                                $scope.invokeLoadingMsg(true);
                                location.href = window.rootUrl + "LicenseeBetSetting/Index#/EditDefaultBetSetting/" + workingContext.ProdId;
                            }
                        }
                    },
                    Cancel: {
                        text: 'No',
                        'class': 'btn-red',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                }
            });
        };

        var isViolatedDBS = function (errCode) {
            var result = false;
            Object.values(SportsbookDBSErrCode).forEach(function (value) {
                if (value === errCode) {
                    result = true;
                }
            });

            return result;
        }

        var isLoadCurrencyDBS = function (errCode) {
            var result = false;
            var errCodes = [
                SportsbookDBSErrCode.Currency_Agent_NotIncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ];

            angular.forEach(errCodes, function (value) {
                if (value === errCode) {
                    result = true;
                }
            });

            return result;
        }

        var invertedSymbol = function (errCode) {
            var result = false;
            var errCodes = [
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ];

            angular.forEach(errCodes, function (value) {
                if (value === errCode) {
                    result = true;
                }
            });

            return result;
        }

        var checkBetSetting = function (editedBSRows, editedDBSRows, isDbsPage) {
            $scope.errMessage = '';

            var param = updatedParams();
            param.BSRows = editedBSRows;
            param.DBSRows = editedDBSRows;

            $scope.invokeLoadingMsg(true);
            $http.post('CheckBetSettingSportsbook', param)
                .success(function (data) {
                    $scope.invokeLoadingMsg(false);
                    var reviewDBSMessage = 'Please check value of Default Bet Setting which is applied for new players!';
                    var applyForPlayers = shareSettingsService.getCurSettings().IsApplyForMembersChecked;
                    $scope.agentIdByErrorCode = shareSettingsService.getWorkingContext().AgentId;
                    $scope.invertedSymbol = invertedSymbol(data.Code);

                    if (data.IsOk) {
                        if (!applyForPlayers && !isDbsPage) {
                            $scope.errMessage = reviewDBSMessage;
                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
                        }
                    }
                    else {
                        if (isViolatedDBS(data.Code) && !isDbsPage) {
                            if (!applyForPlayers) {
                                $scope.errMessage = reviewDBSMessage;
                            } else {
                                $scope.errMessage = '<b>' + data.SportOrBetTypeName + '</b>:' + data.Message;
                            }

                            if (isLoadCurrencyDBS(data.Code)) {
                                $scope.agentIdByErrorCode = 0;
                            }

                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            alert(data.SportOrBetTypeName.bold() + ': ' + data.Message);
                        }
                    }
                })
                .error(function () {
                    $scope.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var postBetSetting = function (editedBSRows, editedDBSRows, index) {

            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var bsRow = (editedBSRows[index].IsRowSelected && editedBSRows[index].IsRowUpdated) ? BSRows[editedBSRows[index].Index] : {};
            var dbsRow = (editedDBSRows.length > 0 && editedDBSRows[index].IsRowSelected && editedDBSRows[index].IsRowUpdated) ? DBSRows[editedDBSRows[index].Index] : {};

            var param = updatedParams();
            param.BSRows = angular.equals({}, bsRow) ? null : [bsRow];
            param.DBSRows = angular.equals({}, dbsRow) ? null : [dbsRow];

            bsRow.Status = shareSettingsService.getStatus().Loading;
            dbsRow.Status = shareSettingsService.getStatus().Loading;

            $http.post(shareSettingsService.getWorkingContext().Url, param)
                .success(function (data) {

                    if (data.IsOk) {
                        bsRow.Status = shareSettingsService.getStatus().Success;
                        dbsRow.Status = shareSettingsService.getStatus().Success;
                    } else {
                        bsRow.Status = shareSettingsService.getStatus().Fail;
                        dbsRow.Status = shareSettingsService.getStatus().Fail;

                        bsRow.Message = data.Message;
                        if (isViolatedDBS(data.Code)) {
                            dbsRow.Message = data.Message;
                        }
                    }

                    if (index < editedBSRows.length - 1) {
                        postBetSetting(editedBSRows, editedDBSRows, index + 1);
                    } else {
                        $scope.buttonStatus.isButtonEnable = true;
                    }
                })
                .error(function () {
                    $scope.buttonStatus.isButtonEnable = true;

                    var message = 'Please re-update this row as soon as possible!'

                    bsRow.Status = shareSettingsService.getStatus().Fail;
                    bsRow.Message = message;

                    dbsRow.Status = shareSettingsService.getStatus().Fail;
                    dbsRow.Message = message;
                });
        };
    }]);

﻿"use strict";

angular.module('licenseeBetSetting.directives', []).directive('bsValidation', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            agentId: "=",
            isDbsPage: "="
        },
        link: function (scope, elem, attrs, ngModel) {

            function formatNumber(value) {
                var transformedText = value.replace(/\D/g, '');
                var number = transformedText.replace(/[\,\.]/g, '');

                return number;
            }

            var validFn = function (value) {
                if (value === "") {
                    return false;
                }
                var min = parseInt(formatNumber(attrs['min']));
                var max = parseInt(formatNumber(attrs['max']));
                var uplinemin = parseInt(formatNumber(attrs['uplinemin']));
                var uplinemax = parseInt(formatNumber(attrs['uplinemax']));

                var numValue = parseInt(formatNumber(value));
                return numValue >= min
                    && (numValue <= max || attrs['max'] === "*")
                    && (numValue >= uplinemin || attrs['uplinemin'] === "*")
                    && (numValue <= uplinemax || attrs['uplinemax'] === "*");
            };

            var setValidation = function (newValue) {
                var valid = validFn($(elem).val());

                ngModel.$setValidity('bsValidation', valid);

                if (!valid) {
                    ngModel.$setDirty(true);
                }

                return newValue;
            }

            attrs.$observe('min', setValidation);

            attrs.$observe('max', setValidation);

            attrs.$observe('uplinemin', setValidation);

            attrs.$observe('uplinemax', setValidation);

            ngModel.$parsers.unshift(function (inputValue) {
                if (inputValue === "") {
                    return "";
                }

                var number = formatNumber(inputValue);
                var el = elem[0];

                var formartNumber = $filter('number')(number);

                if (formartNumber !== inputValue) {
                    var start = el.selectionStart + 1;
                    var end = el.selectionEnd + formartNumber.length - inputValue.length;

                    ngModel.$setViewValue(formartNumber);
                    ngModel.$render();
                    el.setSelectionRange(start, end);
                }

                return number;
            });

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);

                return value;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {
                if (scope.agentId === 0 && !scope.isDbsPage) {
                    return "";
                }
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);

                if (value === "") {
                    return "";
                }

                var number = formatNumber(value);

                return $filter('number')(number);
            });
        }
    };
}]);
﻿"use strict";

// Define service module
var servicesModule = angular.module("licenseeBetSetting.services", []);

// Edit Comm controller
servicesModule.factory("shareSettingsService", function () {
    var workingContext = {
        FuncName: "",
        CustId: -1,
        CurrencyId: -1,
        CustName: "",
        LicenseeName: "",
        SportTypeId: -1,
        ProdId: -1,
        IsBack: false,
        Url: "",
        AgentId: -1,
        AgentName: "",
        AgentList: []
    };
    var settings = {
        OrgSettings: {},
        CurSettings: {}
    };
    var status = {
        Loading: 'glyphicon-refresh glyphicon-refresh-animate',
        Success: 'glyphicon-ok',
        Fail: 'glyphicon-remove'
    };

    return {
        saveOrgSettings: function (orgSettings) {
            settings.OrgSettings = orgSettings;
        },
        saveCurSettings: function (curSettings) {
            settings.CurSettings = curSettings;
        },
        getOrgSettings: function () {
            return settings.OrgSettings;

        },
        getCurSettings: function () {
            return settings.CurSettings;
        },

        saveWorkingContext: function (curContext) {
            workingContext = curContext;
        },
        getWorkingContext: function () {
            return workingContext;
        },
        getStatus: function () {
            return status;
        }
    };
});