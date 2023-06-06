/* exported ContextFunc */
"use strict";
var licenseeBetSettingApp = licenseeBetSettingApp || {};
// Module
licenseeBetSettingApp = angular.module("licenseeBetSetting",
    ["ngRoute", "ngAnimate", "licenseeBetSetting.services", "licenseeBetSetting.directives", "fanex.dropdowntreesingle"]);

// Constant
licenseeBetSettingApp.constant("GetLicenseeListUrl", "GetLicenseeList");
licenseeBetSettingApp.constant("GetSuperLicenseeListUrl", "GetSuperLicenseeList");
licenseeBetSettingApp.constant("GetProductTypeListUrl", "GetProductTypeList");
licenseeBetSettingApp.constant("GetSettingsUrl", "GetSettings");
licenseeBetSettingApp.constant("GetLicenseeAgentListUrl", "GetLicenseeAgentList");


// Routing
licenseeBetSettingApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/EditPT', {
        templateUrl: "EditPT",
        controller: "editPTCtrl"
    });
    $routeProvider.when('/ReviewPT', {
        templateUrl: "ReviewPT",
        controller: 'reviewPTCtrl'
    });

    $routeProvider.when('/EditComm', {
        templateUrl: 'EditComm',
        controller: 'editCommCtrl'
    });
    $routeProvider.when('/ReviewComm', {
        templateUrl: 'ReviewComm',
        controller: 'reviewCommCtrl'
    });

    $routeProvider.when('/EditBetSetting/:sportType', {
        templateUrl: function (params) {
            return 'EditBetSetting/?sportType=' + params.sportType;
        }
    });
    $routeProvider.when('/EditDefaultBetSetting/:productType', {
        templateUrl: function (params) {
            return 'EditDefaultBetSetting/?productType=' + params.productType;
        }
    });
    $routeProvider.when('/ReviewBetSetting/:sportType', {
        templateUrl: function (params) {
            return 'ReviewBetSetting/?sportType=' + params.sportType;
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
                $scope.editBS.DBSRows = null;
                if ($scope.editBS.isCopyAllFromOne === true) {
                    $scope.listener = $scope.$watch("editBS.BSRows[0]", $scope.copyBS, true);
                }
            }
            else {
                angular.extend($scope.editBS, data);
            }
        })
        .error(function (data) {
            alert(site.requestErrMsg);
        });;
};
editBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];

var editDBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.editBS = {};
    $scope.isDBS = true;

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

            $.each(data.BSRows, function (index, element) {
                element.UplineMinBet = shareSettingsService.getCurSettings().BSRows[index].MinBet;
                element.UplineMaxBet = shareSettingsService.getCurSettings().BSRows[index].MaxBet;
                element.UplineMaxPayoutPerMatch = shareSettingsService.getCurSettings().BSRows[index].MaxPayoutPerMatch;
                element.UplineMaxPerMatch = shareSettingsService.getCurSettings().BSRows[index].MaxPerMatch;
            });
            shareSettingsService.saveOrgSettings(angular.copy(data));
            $scope.editBS = data;
        })
        .error(function (data) {
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
    $.each(curBSRows, function (index, element) {
        if (element.IsRowSelected === true) {
            var orgRow = {
                MinBet: orgBSRows[index].MinBet,
                MaxBet: orgBSRows[index].MaxBet,
                MaxPerMatch: orgBSRows[index].MaxPerMatch,
                MaxPayoutPerMatch: orgBSRows[index].MaxPayoutPerMatch,
                UplineMinBet: orgBSRows[index].UplineMinBet,
                UplineMaxBet: orgBSRows[index].UplineMaxBet,
                UplineMaxPerMatch: orgBSRows[index].UplineMaxPerMatch,
                UplineMaxPayoutPerMatch: orgBSRows[index].UplineMaxPayoutPerMatch,
                MaxPerBall: orgBSRows[index].MaxPerBall !== undefined ? orgBSRows[index].MaxPerBall : undefined,
            };

            var curRow = {
                MinBet: curBSRows[index].MinBet,
                MaxBet: curBSRows[index].MaxBet,
                MaxPerMatch: curBSRows[index].MaxPerMatch,
                MaxPayoutPerMatch: curBSRows[index].MaxPayoutPerMatch,
                UplineMinBet: curBSRows[index].UplineMinBet,
                UplineMaxBet: curBSRows[index].UplineMaxBet,
                UplineMaxPerMatch: curBSRows[index].UplineMaxPerMatch,
                UplineMaxPayoutPerMatch: curBSRows[index].UplineMaxPayoutPerMatch,
                MaxPerBall: curBSRows[index].MaxPerBall !== undefined ? curBSRows[index].MaxPerBall : undefined,
            };

            if (angular.equals(curRow, orgRow)) {
                arrValidRows.push(true);
            }
            else {
                arrValidRows.push(false);
            }
        }
        else {
            curBSRows[index].MinBet = orgBSRows[index].MinBet;
            curBSRows[index].MaxBet = orgBSRows[index].MaxBet;
            curBSRows[index].MaxPerMatch = orgBSRows[index].MaxPerMatch;
            curBSRows[index].MaxPerBall = orgBSRows[index].MaxPerBall;
            curBSRows[index].MaxPayoutPerMatch = orgBSRows[index].MaxPayoutPerMatch;
            curBSRows[index].UplineMinBet = orgBSRows[index].UplineMinBet;
            curBSRows[index].UplineMaxBet = orgBSRows[index].UplineMaxBet;
            curBSRows[index].UplineMaxPerMatch = orgBSRows[index].UplineMaxPerMatch;
            curBSRows[index].UplineMaxPayoutPerMatch = orgBSRows[index].UplineMaxPayoutPerMatch;
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
        if (scope.isDBS && isValidDBSData) {
            hasViolate = false;
        }
        /*end check constrants*/

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
            $scope.checkAllSports();
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
                element.IsRowSelected = false;
                element.IsRowDisabled = false;
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

var editBSNextEnabilityFunc = function ($scope, shareSettingsService) {
    // Private functions
    var checkDirty = function () {
        $scope.buttonStatus.isNextEnabled = false;
        // A little hack: Watch when it has data
        if ($scope.editBS.BSRows !== undefined) {
            var orgBSRows = shareSettingsService.getOrgSettings().BSRows;
            var curBSRows = $scope.editBS.BSRows;
            if ($scope.editBS.isCopyAllFromOne === true) {
                $scope.buttonStatus.isNextEnabled = true;
                return;
            }
            $scope.buttonStatus.isNextEnabled = getNextEnable($scope, curBSRows, orgBSRows);
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
        if ($scope.isDBS === true) {
            angular.extend(shareSettingsService.getCurSettings(), { DBSRows: angular.copy($scope.editBS.BSRows) });
        } else {
            shareSettingsService.saveCurSettings($scope.editBS);
        }

        $scope.checkBS();
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
    '$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl',
    function ($scope, $http, $location, $route, $routeParams, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl) {
        $scope.isButtonEnable = true;
        $scope.option = 0;
        $scope.SportOrBetTypeName = '';
        $scope.agentIdByErrorCode = -1; // to get DBS

        var DBSErrCode = {
            AgentCode: '103',
            CurrencyCode: '106,107'
        }

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
            isSuccess: true
        };

        $scope.TextSettings = {
            Filter: 'Search'
        };

        $scope.selectedProductTypeChanged = function () {
            $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
        };

        $scope.selectedLicenseeChanged = function () {
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
                    $http.get(
                        GetLicenseeAgentListUrl,
                        {
                            params: { SRecommend: $scope.filterData.selectedSuperLicensee.Id }
                        }
                    )
                        .success(function (data1) {
                            $scope.filterData.agents = data1
                            $scope.filterData.selectedAgent = data1[0];
                            $scope.agentSettings = {
                                idMember: "Id",
                                nameMember: "Name",
                                sourceData: data1,
                                hasToolbar: false,
                                hasFilter: true,
                                hasEnter: false,
                                width: '100%',
                            }
                        });
                });
        };

        $scope.selectedSuperLicenseeChanged = function (SRecommend) {

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
                    }
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

                $scope.filterData.productTypes = data.ProductTypeList;
                $scope.filterData.selectedProductType = data.ProductTypeList[0];
                $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];

                $scope.filterData.superLicensees = data.SuperLicenseeList;
                $scope.filterData.selectedSuperLicensee = data.SuperLicenseeList[0];
                $scope.superLicenseeSettings = {
                    idMember: "Id",
                    nameMember: "CurrencyWithSuper",
                    sourceData: data.SuperLicenseeList,
                    hasToolbar: false,
                    hasFilter: true,
                    hasEnter: false,
                    width: '100%',
                }

                $scope.filterData.agents = data.AgentList;
                $scope.filterData.selectedAgent = data.AgentList[0];
                $scope.agentSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.AgentList,
                    hasToolbar: false,
                    hasFilter: true,
                    hasEnter: false,
                    width: '100%',
                }
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
            $scope.buttonStatus.isButtonEnable = true;

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
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var editedRows = getEditedRows(BSRows, DBSRows);
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            var startIndex = 0;
            postBetSetting(editedBSRows, editedDBSRows, startIndex);
        };

        $scope.checkBS = function () {
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var editedRows = getEditedRows(BSRows, DBSRows);
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            checkBetSetting(editedBSRows, editedDBSRows);
        }

        var getEditedRows = function (bsRows, dbsRows) {
            var result = {
                BSRows: [],
                DBSRows: []
            };

            for (var i = 0; i < bsRows.length; i++) {
                if (bsRows[i].IsRowSelected || (dbsRows != null && dbsRows[i].IsRowSelected)) {
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

        var checkBetSetting = function (editedBSRows, editedDBSRows) {
            var param = updatedParams();
            param.BSRows = editedBSRows;
            param.DBSRows = editedDBSRows;

            $http.post('CheckBetSettingSportsbook', param)
                .success(function (data) {
                    if (data.IsOk) {
                        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
                    }
                    else {
                        data.Code = data.Code.toString();
                        if (DBSErrCode.AgentCode.split(',').includes(data.Code) || DBSErrCode.CurrencyCode.split(',').includes(data.Code)) {
                            $scope.SportOrBetTypeName = data.SportOrBetTypeName;
                            $scope.agentIdByErrorCode = DBSErrCode.CurrencyCode.split(',').includes(data.Code) ? 0 : shareSettingsService.getWorkingContext().AgentId;

                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            alert(data.SportOrBetTypeName.bold() + ': ' + data.Message);
                        }
                    }
                })
                .error(function (data) {
                    alert(site.requestErrMsg);
                });
        }

        var postBetSetting = function (editedBSRows, editedDBSRows, index) {

            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var bsRow = editedBSRows[index].IsRowSelected ? BSRows[editedBSRows[index].Index] : {};
            var dbsRow = (editedDBSRows.length > 0 && editedDBSRows[index].IsRowSelected) ? DBSRows[editedDBSRows[index].Index] : {};

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
                        if (data.Code === dbsErrorCode) {
                            dbsRow.Message = data.Message;
                        }
                    }
                    $scope.buttonStatus.isButtonEnable = true;

                    if (index < editedBSRows.length - 1) {
                        postBetSetting(editedBSRows, editedDBSRows, index + 1);
                    }
                })
                .error(function (data) {
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
            isDefault: "="
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
                if (scope.agentId === 0 && !scope.isDefault) {
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