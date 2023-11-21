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
'use strict';
// Model function
var editBSModelFunc = function ($scope, $http, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = { DBSRows: [] };
    $scope.agentId = shareSettingsService.getWorkingContext().AgentId;
    $scope.isExceedingThreshold = false;

    if (angular.equals(shareSettingsService.getWorkingContext(), shareSettingsService.orgWorkingContext)) {
        return;
    }

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
        .success(function (response) {
            $scope.orgData.BSs = angular.copy(response.Data.BSRows);
            shareSettingsService.saveOrgSettings(angular.copy(response.Data));
            if ($scope.buttonStatus.IsBack) {
                $scope.editBS = shareSettingsService.getCurSettings();
            }
            else {
                $scope.editBS.BSRows = angular.copy(response.Data.BSRows);
            }

            if ($scope.option === 1 && !response.IsSuccess) {
                $scope.isExceedingThreshold = true;
                $scope.editBS.applyForMember = -1;
                alert(response.Error);
            }

            site.invokeLoadingMsg(false);
        })
        .error(function () {
            site.invokeLoadingMsg(false);
            alert(site.requestErrMsg);
        });
};
editBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];

var editDBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.editBS = {};
    $scope.isDbsPage = true;

    if (angular.equals(shareSettingsService.getWorkingContext(), shareSettingsService.orgWorkingContext)) {
        return;
    }

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

﻿/* global licenseeBetSettingApp, editDBSModelFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
licenseeBetSettingApp.controller("editDBSSportsbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editDBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);

﻿/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

'use strict';

// Model function
var reviewBSModelFunc = function ($scope, shareSettingsService) {
    $scope.reviewBS = shareSettingsService.getCurSettings();
    $scope.orgBSs = $scope.orgData.BSs;
    $scope.orgDBSs = $scope.orgData.DBSs;

    $scope.isShowDBS = function () {
        var DBSRows = $scope.reviewBS.DBSRows;
        if (DBSRows === undefined || DBSRows === null || DBSRows.length === 0) {
            return false;
        }

        var isValidDBSData = DBSRows.every(function (_) {
            return (_.MinBet === ''
                && _.MaxBet === ''
                && _.MaxPerMatch === ''
                && (_.MaxPayoutPerMatch === ''));
        });

        if (isValidDBSData) {
            return false;
        }

        return true;
    }

    function getAgentsHeader() {
        var res = '';
        var agentId = shareSettingsService.getWorkingContext().AgentId;
        var agentName = shareSettingsService.getWorkingContext().AgentName;
        var agentList = shareSettingsService.getWorkingContext().AgentList;

        if (agentId === 0) {
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
        if (!$scope.buttonStatus.isButtonEnable) {
            return;
        }

        $scope.orgData.BSs = [];
        $scope.orgData.DBSs = [];
        shareSettingsService.getCurSettings().DBSRows = [];

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
    '$scope', '$q', '$http', '$location', '$route', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl', 'SportsbookDBSErrCode',
    function ($scope, $q, $http, $location, $route, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl, SportsbookDBSErrCode) {
        $scope.option = 0;
        $scope.invertedSymbol = false; // to set DBS UI
        $scope.agentIdByErrorCode = -1; // to get DBS

        $scope.orgData = {
            BSs: [],
            DBSs: []
        };

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

        $scope.buttonStatus = {
            isNextEnabled: false,
            isBack: false,
            isUpdated: false,
            isButtonEnable: true,
            isSuccess: true,
            isCopyDisabled: true 
        };

        $scope.TextSettings = {
            Filter: 'Search'
        };

        $scope.selectedProductTypeChanged = function () {
            $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
        };

        $scope.selectedLicenseeChanged = function () {
            site.invokeLoadingMsg(true);
            var licensee = $scope.filterData.selectedLicensee;
            var licenseeName = licensee ? licensee.Name : '';

            $http.get(
                GetSuperLicenseeListUrl,
                {
                    params: { siteName: licenseeName }
                }
            )
                .success(function (data) {
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
                        $scope.selectedSuperLicenseeChanged();
                    }
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    $scope.buttonStatus.isButtonEnable = false;
                    alert(site.requestErrMsg);
                });
        };

        $scope.selectedSuperLicenseeChanged = function () {
            site.invokeLoadingMsg(true);
            var superLicensee = $scope.filterData.selectedSuperLicensee;
            var SRecommend = superLicensee !== undefined ? superLicensee.Id : -1;

            $http.get(
                GetLicenseeAgentListUrl,
                {
                    params: { SRecommend: SRecommend }
                }
            )
                .success(function (data) {
                    data = superLicensee !== undefined ? data : [];
                    $scope.filterData.agents = data
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

                    site.invokeLoadingMsg(false);
                    $scope.buttonStatus.isButtonEnable = data.length > 0;
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    $scope.buttonStatus.isButtonEnable = false;
                    alert(site.requestErrMsg);
                });
        };

        $scope.selectEventHandler = function () {
            if (!$scope.buttonStatus.isButtonEnable) {
                return;
            }

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
            site.invokeLoadingMsg(true);

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
            if ($scope.buttonStatus.isUpdated) {
                return;
            }

            $scope.buttonStatus.isUpdated = true;
            $scope.buttonStatus.isButtonEnable = false;

            postBetSetting();
        };

        $scope.checkBS = function (isDbsPage) {
            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            checkBetSetting(editedBSRows, editedDBSRows, isDbsPage);
        }

        var getEditedRows = function () {
            var currentData = angular.copy(shareSettingsService.getCurSettings());

            var bsRows = currentData.BSRows;
            var dbsRows = currentData.DBSRows;
            var result = {
                BSRows: [],
                DBSRows: []
            };

            for (var i = 0; i < bsRows.length; i++) {
                if (bsRows[i].IsRowSelected || (dbsRows.length > 0 && dbsRows[i].IsRowSelected)) {
                    bsRows[i].Index = i;
                    result.BSRows.push(bsRows[i]);
                    if (dbsRows.length > 0) {
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
                                site.invokeLoadingMsg(true);
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
            return Object.values(SportsbookDBSErrCode).includes(errCode);
        }

        var checkBetSetting = function (editedBSRows, editedDBSRows, isDbsPage) {
            $scope.errMessage = '';

            var param = updatedParams();
            param.BSRows = editedBSRows;
            param.DBSRows = editedDBSRows;

            var loadCurrencyDbsErrCode = [
                SportsbookDBSErrCode.Currency_Agent_NotIncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ];

            var invertSymbolErrCodes = [
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ]

            site.invokeLoadingMsg(true);
            $http.post('CheckBetSettingSportsbook', param)
                .success(function (data) {
                    site.invokeLoadingMsg(false);
                    var reviewDBSMessage = 'Please check value of Default Bet Setting which is applied for new players!';
                    var applyForPlayers = shareSettingsService.getCurSettings().IsApplyForMembersChecked;
                    $scope.agentIdByErrorCode = shareSettingsService.getWorkingContext().AgentId;
                    $scope.invertedSymbol = invertSymbolErrCodes.includes(data.Code);

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

                            if (loadCurrencyDbsErrCode.includes(data.Code)) {
                                $scope.agentIdByErrorCode = 0;
                            }

                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            var sportName = data.SportOrBetTypeName === '' ? '' : data.SportOrBetTypeName.bold() + ': ';
                            alert(sportName + data.Message);
                        }
                    }
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var postBetSetting = function () {
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            var promises = [];

            $.each(editedBSRows, function (index) {

                var bsRow = (editedBSRows[index].IsRowSelected) ? BSRows[editedBSRows[index].Index] : {};
                var dbsRow = (editedDBSRows.length > 0 && editedDBSRows[index].IsRowSelected) ? DBSRows[editedDBSRows[index].Index] : {};

                var param = updatedParams();
                param.BSRows = angular.equals({}, bsRow) ? null : [bsRow];
                param.DBSRows = angular.equals({}, dbsRow) ? null : [dbsRow];

                bsRow.Status = shareSettingsService.getStatus().Loading;
                dbsRow.Status = shareSettingsService.getStatus().Loading;

                var promise = $http.post(shareSettingsService.getWorkingContext().Url, param)
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
                    })
                    .error(function () {
                        var message = 'Please re-update this row as soon as possible!'

                        bsRow.Status = shareSettingsService.getStatus().Fail;
                        bsRow.Message = message;

                        dbsRow.Status = shareSettingsService.getStatus().Fail;
                        dbsRow.Message = message;
                    });
                promises.push(promise);
            });

            $q.all(promises).then(function () {
                $scope.buttonStatus.isButtonEnable = true;
            }).catch(function () {
                $scope.buttonStatus.isButtonEnable = true;
            });

        };

        function init() {
            site.invokeLoadingMsg(true);
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

                    $scope.filterData.productTypes = data.ProductTypeList;
                    $scope.filterData.selectedProductType = data.ProductTypeList[0];
                    $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];

                    if (data.LicenseeList.length === 0) {
                        $scope.selectedLicenseeChanged();
                    }
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        init();
    }]);

﻿'use strict';

angular.module('licenseeBetSetting.directives', []).directive('bsValidation', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            oldValue: '='
        },
        link: function (scope, elem, attrs, ngModel) {

            function formatNumber(value) {
                if (value === undefined) {
                    return '';
                }
                var transformedText = value.replace(/\D/g, '');
                var number = transformedText.replace(/[\,\.]/g, '');

                return number;
            }

            var validFn = function (value) {
                if (value === '') {
                    return false;
                }
                var min = parseInt(formatNumber(attrs['min']));
                var max = parseInt(formatNumber(attrs['max']));
                var uplinemin = parseInt(formatNumber(attrs['uplinemin']));
                var uplinemax = parseInt(formatNumber(attrs['uplinemax']));

                var numValue = parseInt(formatNumber(value));
                return numValue >= min
                    && (numValue <= max || attrs['max'] === '*')
                    && (numValue >= uplinemin || attrs['uplinemin'] === '*')
                    && (numValue <= uplinemax || attrs['uplinemax'] === '*');
            };

            function validateField(oldData, newData) {
                var valid = validFn(newData);
                ngModel.$setValidity('bsValidation', valid);

                var oldValue = parseInt(formatNumber(oldData));
                var newValue = parseInt(formatNumber(newData));

                if (oldValue !== newValue || !valid) {
                    ngModel.$setDirty(true);
                } else {
                    ngModel.$setPristine(true);
                }
            }

            var setValidation = function (newValue) {
                validateField(scope.oldValue, $(elem).val());
                return newValue;
            }

            attrs.$observe('min', setValidation);

            attrs.$observe('max', setValidation);

            attrs.$observe('uplinemin', setValidation);

            attrs.$observe('uplinemax', setValidation);

            ngModel.$parsers.unshift(function (inputValue) {
                if (inputValue === '') {
                    return '';
                }

                var number = formatNumber(inputValue);
                var el = elem[0];

                var format = $filter('number')(number);

                if (format !== inputValue) {
                    var start = el.selectionStart + 1;
                    var end = el.selectionEnd + format.length - inputValue.length;

                    ngModel.$setViewValue(format);
                    ngModel.$render();
                    el.setSelectionRange(start, end);
                }

                return number;
            });

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                validateField(scope.oldValue, value);

                return value;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {

                validateField(scope.oldValue, value);

                if (value === '') {
                    return '';
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
        orgWorkingContext: workingContext,

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