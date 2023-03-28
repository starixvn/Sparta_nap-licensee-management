/* exported ContextFunc */
"use strict";
var settingConfigurationApp = settingConfigurationApp || {};
// Module
settingConfigurationApp = angular.module("settingConfiguration",
    ["ngRoute", "ngAnimate", "settingConfiguration.services", "settingConfiguration.directives", "fanex.selectwithsearch"]);

// Constant
settingConfigurationApp.constant("GetLicenseeListUrl", "GetLicenseeList");
settingConfigurationApp.constant("GetSuperLicenseeListUrl", "GetSuperLicenseeList");
settingConfigurationApp.constant("GetProductTypeListUrl", "GetProductTypeList");
settingConfigurationApp.constant("GetSettingsUrl", "GetSettings");
settingConfigurationApp.constant("GetLicenseeAgentListUrl", "GetLicenseeAgentList");


// Routing
settingConfigurationApp.config(['$routeProvider', function ($routeProvider) {
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
settingConfigurationApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
} ]);

settingConfigurationApp.value("ContextFunc", {
    BetSetting: "Bet Setting",
    CurrencyBetSetting: "Currency Bet Setting",
    PlayerBetSetting: "Player Bet Setting",
    DefaultBetSetting: "DefaultBetSetting",
    Comm: "Comm",
    PT: "PT"
});



﻿/* exported editBSModelFunc, editDBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc,
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
﻿/* global settingConfigurationApp, editBSNavigatorFunc, editBSModelFunc, editBSApplyForPlayerFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSKenoCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });

}]);

﻿/* global settingConfigurationApp, editBSNavigatorFunc, editBSModelFunc, editBSApplyForPlayerFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSNumberGameCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);

﻿/* global settingConfigurationApp, editBSModelFunc, editBSApplyForPlayerFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSSportsbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
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

﻿/* global settingConfigurationApp, editDBSModelFunc, editBSApplyForPlayerFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editDBSSportsbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
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
var reviewBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;
    $scope.reviewBS = shareSettingsService.getCurSettings();

    $scope.isShowDBS = function () {
        var DBSRows = $scope.reviewBS.DBSRows;
        if (DBSRows === undefined || DBSRows === null || angular.equals({}, DBSRows)) {
            return false;
        }

        if (DBSRows[0].MinBet === '' && DBSRows[0].MaxBet === '' && DBSRows[0].MaxPerMatch === '' && DBSRows[0].MaxPayoutPerMatch === '') {
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
    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId,
                    agentId: shareSettingsService.getWorkingContext().AgentId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));
            $scope.editBS = data;
        });
};
    reviewBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];
// Navigator function
    var reviewBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
        // Redirect if wrong context
        var selectedContext = shareSettingsService.getWorkingContext();
        if (selectedContext.FuncName === "" || (selectedContext.FuncName !== ContextFunc.BetSetting && selectedContext.FuncName !== ContextFunc.DefaultBetSetting)) {
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
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;
            $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
        };
    };
reviewBSNavigatorFunc.$inject = ['$scope', '$location', 'shareSettingsService', 'ContextFunc'];

﻿/* global settingConfigurationApp,  reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSKenoCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
 function ($scope, $injector, $http, $location, $route, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

    shareSettingsService.getWorkingContext().Url = "UpdateBetSettingKeno";

}]);
﻿/* global settingConfigurationApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSNumberGameCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService', 
function ($scope, $injector, $http, $location, $route, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

    shareSettingsService.getWorkingContext().Url = "UpdateBetSettingNumberGame";

}]);

﻿/* global settingConfigurationApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSSportsbookCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
 function ($scope, $injector, $http, $location, $route, shareSettingsService) {
     // Inherit
     $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

     $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

     shareSettingsService.getWorkingContext().Url = "UpdateBetSettingSportsbook";
     
 } ]);

﻿/* global settingConfigurationApp */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editPTCtrl", ['$scope', '$http', '$location', 'shareSettingsService', 'ContextFunc',
 function ($scope, $http, $location, shareSettingsService, ContextFunc) {

     $scope.selectedContext = shareSettingsService.getWorkingContext();
     if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
         $location.path('/');
         return;
     }

     $scope.editPTData = {};
     $scope.buttonStatus.isNextEnabled = false;
     $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;

     $http.get(
            "GetEditPTData",
            {
                params: {
                    CustId: shareSettingsService.getWorkingContext().CustId,
                    ProdId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));
            if ($scope.buttonStatus.IsBack) {
                $scope.editPTData = shareSettingsService.getCurSettings();
            }
            else {
                $scope.editPTData = data;
            }
        });

     $scope.nextReviewPT = function () {
         shareSettingsService.saveCurSettings($scope.editPTData);
         $location.path("/ReviewPT");
     };

     $scope.$watch("editPTData.SelectedPositionTaking", function () {
         $scope.buttonStatus.isNextEnabled = false;
         // A little hack: Watch when it has data
         if ($scope.editPTData.SelectedPositionTaking !== undefined) {
             var orgSelectedPT = shareSettingsService.getOrgSettings().SelectedPositionTaking;
             var curSelectedPT = $scope.editPTData.SelectedPositionTaking;
             if (curSelectedPT !== orgSelectedPT) {
                 $scope.buttonStatus.isNextEnabled = true;
             }
         }
     }, true);
 } ]);

﻿/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {
    $scope.selectedContext = shareSettingsService.getWorkingContext();
    $scope.supperUserName = $scope.selectedContext.CustName;

    if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.reviewPTData = {
        ProductName: shareSettingsService.getCurSettings().ProductName,
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgPT: shareSettingsService.getOrgSettings().SelectedPositionTaking,
        CurPT: shareSettingsService.getCurSettings().SelectedPositionTaking
    };

    $scope.updatePT = function () {
        $scope.buttonStatus.isUpdated = true;
        $scope.buttonStatus.isButtonEnable = false;
        $http.post(
            "UpdatePT",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProductId: shareSettingsService.getWorkingContext().ProdId,
                PTValue: shareSettingsService.getCurSettings().SelectedPositionTaking
            })
        .success(function (data) {
            if (data.IsOk === true) {
                $scope.ptMessage = "Update PT successfully!";
                $scope.buttonStatus.isSuccess = true;
            }
            else {
                $scope.ptMessage = data.Message;
                $scope.buttonStatus.isSuccess = false;
            }
            $scope.buttonStatus.isButtonEnable = true;
        })
        .error(function (data) {
            $scope.ptMessage = data;
            $scope.buttonStatus.isSuccess = false;
        });
    };

    $scope.backEditPT = function () {
        if ($scope.buttonStatus.isUpdated) {
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isNextEnabled = false;
            $scope.buttonStatus.IsBack = false;
        }
        else {
            $scope.buttonStatus.IsBack = true;
        }
        $location.path("/EditPT");
    };
} ]);

﻿/* global settingConfigurationApp */

"use strict";

// Main controller

settingConfigurationApp.controller("settingConfigurationCtrl", [
    '$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl',
    function ($scope, $http, $location, $route, $routeParams, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl) {
        $scope.isButtonEnable = true;
        $scope.option = false;

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
                    $scope.superLicenseeRequiredSettings = { Require: false };
                    $scope.superLicenseeSettings = {
                        idMember: "Id",
                        nameMember: "Name",
                        sourceData: data
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
                            $scope.agentRequiredSettings = { Require: false };
                            $scope.agentSettings = {
                                idMember: "Id",
                                nameMember: "Name",
                                sourceData: data1
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
                    $scope.agentRequiredSettings = { Require: false };
                    $scope.agentSettings = {
                        idMember: "Id",
                        nameMember: "Name",
                        sourceData: data
                    }
                });
        };

        $http.get(GetSettingsUrl)
            .success(function (data) {
                $scope.filterData.licensees = data.LicenseeList;
                $scope.filterData.selectedLicensee = data.LicenseeList[0];
                $scope.licenseeRequiredSettings = { Require: false };
                $scope.licenseeSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.LicenseeList
                }

                $scope.filterData.productTypes = data.ProductTypeList;
                $scope.filterData.selectedProductType = data.ProductTypeList[0];
                $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];

                $scope.filterData.superLicensees = data.SuperLicenseeList;
                $scope.filterData.selectedSuperLicensee = data.SuperLicenseeList[0];
                $scope.superLicenseeRequiredSettings = { Require: false };
                $scope.superLicenseeSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.SuperLicenseeList
                }

                $scope.filterData.agents = data.AgentList;
                $scope.filterData.selectedAgent = data.AgentList[0];
                $scope.agentRequiredSettings = { Require: false };
                $scope.agentSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.AgentList
                }
            });

        $scope.selectEventHandler = function () {
            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting) {
                $scope.option = false;
            } else {
                $scope.option = true;
            }

            // Save working context
            shareSettingsService.saveWorkingContext({
                FuncName: ContextFunc.PT,
                CustName: $scope.filterData.selectedSuperLicensee.Name,
                LicenseeName: $scope.filterData.selectedLicensee.Name,
                CustId: $scope.filterData.selectedSuperLicensee.Id,
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
                shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting

                if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                    $route.reload();
                }
                $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
            } else if ($scope.filterData.selectedFunction === ContextFunc.PT) {
                shareSettingsService.getWorkingContext().FuncName = ContextFunc.PT;

                if (curPath === "/EditPT") {
                    $route.reload();
                }
                $location.path("/EditPT");
            }
        };

        $scope.updateBS = function () {
            $scope.buttonStatus.isUpdated = true;
            $scope.buttonStatus.isButtonEnable = false;
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var rowIndex = getRowIndex(BSRows, -1);
            if (rowIndex !== undefined) {
                postBetSetting(BSRows, rowIndex);
            }
        };

        $scope.checkBS = function () {
            var BSRows = shareSettingsService.getCurSettings().BSRows;

            var rows = [];
            for (var index = -1; index < BSRows.length; index ++) {
                var rowIndex = getRowIndex(BSRows, index);
                if (rowIndex !== undefined) {
                    rows.push(angular.copy(BSRows[rowIndex]));
                    index = rowIndex - 1;
                }
            };

            checkBetSetting(rows);
        }

        var getRowIndex = function (BSRows, rowIndex) {
            var setting = shareSettingsService.getCurSettings();

            // only one row and check apply exist member
            if (BSRows.length === 1 && setting.IsApplyForMembersChecked) {
                return 0;
            }

            for (var index = rowIndex + 1; index < BSRows.length; index++) {
                if (BSRows[index].IsRowSelected
                    || (setting.IsEnableChecked && !setting.IsEnableDisabled)
                    || (setting.IsDownlineChecked && !setting.IsDownlineDisabled)) {
                    return index;
                }
            }
            return undefined;
        };

        var updatedParams = function (bsRow) {
            return {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProdId: shareSettingsService.getWorkingContext().ProdId,
                SportBetSetting: bsRow,
                IsEnableChecked: shareSettingsService.getCurSettings().IsEnableChecked,
                IsDownlineChecked: shareSettingsService.getCurSettings().IsDownlineChecked,
                AgentId: shareSettingsService.getWorkingContext().AgentId,
                Option: $scope.option,
                ExistedMember: shareSettingsService.getCurSettings().existedMember,
                IsNewMember: shareSettingsService.getCurSettings().isNewMember,
                DBSRows: shareSettingsService.getCurSettings().DBSRows
            }
        };

        var goToEditDBPage = function (workingContext, contextFunc) {
            $("#confirm-box").removeClass("hidden");
            $("#confirm-box").dialog({
                resizable: false,
                height: 200,
                width: 420,
                modal: true,
                buttons: {
                    "OK": {
                        text: 'Yes',
                        'class': 'btn-primary btn-ok',
                        click: function () {
                            $("#confirm-box").addClass("hidden");
                            $(this).dialog("close");
                            if (workingContext.FuncName !== contextFunc.DefaultBetSetting) {
                                workingContext.FuncName = contextFunc.DefaultBetSetting;
                                location.href = "/SettingConfiguration/Index#/EditDefaultBetSetting/" + workingContext.ProdId;
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

        var checkBetSetting = function (BSRows) {
            var param = updatedParams();
            param.BSRows = BSRows;
            $http.post(shareSettingsService.getWorkingContext().Url, param)
                .success(function (data) {
                    if (data.IsOk) {
                        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
                    }
                    else {
                        if (data.Code === 103) {
                            goToEditDBPage(shareSettingsService.getWorkingContext(), ContextFunc);
                        } else {
                            alert(data.Message);
                        }
                    }
                }).error(function (data) {
                    alert(data.Message);
                })
        }

        var postBetSetting = function (BSRows, rowIndex) {
            var bsRow = BSRows[rowIndex];
            bsRow.Status = shareSettingsService.getStatus().Loading;

            $http.post(shareSettingsService.getWorkingContext().Url, updatedParams(bsRow))
                .success(function (data) {
                    bsRow.Message = data.Message;
                    rowIndex = getRowIndex(BSRows, rowIndex);

                    if (data.IsOk) {
                        bsRow.Status = shareSettingsService.getStatus().Success;
                    }
                    else {
                        bsRow.Status = shareSettingsService.getStatus().Fail;
                    }

                    if (rowIndex !== undefined && BSRows.length > 1) {
                        postBetSetting(BSRows, rowIndex);
                    }
                    else {
                        $scope.buttonStatus.isButtonEnable = true;
                    }
                })
                .error(function (data) {
                    bsRow.Status = shareSettingsService.getStatus().Fail;
                    bsRow.Message = data;
                });
        };
    }]);

﻿"use strict";

angular.module('settingConfiguration.directives', []).directive('bsValidation', ['$filter', function ($filter) {
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
var servicesModule = angular.module("settingConfiguration.services", []);

// Filter data service
servicesModule.service('filterDataService', [
    "$http", "GetLicenseeListUrl", "GetProductTypeListUrl", "GetLicenseeAgentListUrl",
function ($http, GetLicenseeListUrl, GetProductTypeListUrl, GetLicenseeAgentListUrl) {
    this.getLicensees = function () {
        $http.get(GetLicenseeListUrl)
        .success(function (data) {
            return data;
        })
        .error(function (error) {
            alert(error);
        });
    };

    this.getProductTypes = function () {
        $http.get(GetProductTypeListUrl)
        .success(function (data) {
            return data;
        })
        .error(function (error) {
            alert(error);
        });
    };

    this.getAgents = function (sRecommend) {
        $http.get(GetLicenseeAgentListUrl, { sRecommend: sRecommend})
            .success(function (data) {
                return data;
            })
            .error(function (error) {
                alert(error);
            });
    };
}
]);
﻿"use strict";

// Define service module
var servicesModule = angular.module("settingConfiguration.services");

// Edit Comm controller
servicesModule.factory("shareSettingsService", function () {
    var workingContext = {
        FuncName: "",
        CustId: -1,
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