/* exported ContextFunc */
"use strict";
var settingConfigurationApp = settingConfigurationApp || {};
// Module
settingConfigurationApp = angular.module("settingConfiguration",
    ["ngRoute", "ngAnimate","settingConfiguration.services", "settingConfiguration.directives"]);

// Constant
settingConfigurationApp.constant("GetLicenseeListUrl", "GetLicenseeList");
settingConfigurationApp.constant("GetSuperLicenseeListUrl", "GetSuperLicenseeList");
settingConfigurationApp.constant("GetProductTypeListUrl", "GetProductTypeList");

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
    BetSetting: "Bet setting",
    Comm: "Comm",
    PT: "PT"
});



﻿/* exported editBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableFunc, editBSRowCheckableSuperDownlineFunc, 
editBSNextFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */
"use strict";
// Model function
var editBSModelFunc = function ($scope, $http, $location, shareSettingsService) {
    // Get common bet setting data
    $scope.editBS = {};
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;

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
﻿/* global settingConfigurationApp, editBSNavigatorFunc, editBSModelFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSKenoCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });

}]);

﻿/* global settingConfigurationApp, editBSNavigatorFunc, editBSModelFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSNumberGameCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);

﻿/* global settingConfigurationApp,  editBSModelFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableSuperDownlineFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSRacingCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableSuperDownlineFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);

﻿/* global settingConfigurationApp, editBSModelFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSSportbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
    // Inherit
   $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

   $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });
   
   $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);

﻿/* global settingConfigurationApp, editBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc,
editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";


// Edit PT controller
settingConfigurationApp.controller("editBSVirtualSportCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);

﻿/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

"use strict";

// Model function
var reviewBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;
    $scope.reviewBS = shareSettingsService.getCurSettings();
    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId
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
        $scope.selectedContext = shareSettingsService.getWorkingContext();
        if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.BetSetting) {
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
settingConfigurationApp.controller("reviewBSRacingCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
 function ($scope, $injector, $http, $location, $route, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });
    
    shareSettingsService.getWorkingContext().Url = "UpdateBetSettingRacing";

}]);

﻿/* global settingConfigurationApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSSportbookCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
 function ($scope, $injector, $http, $location, $route, shareSettingsService) {
     // Inherit
     $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

     $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

     shareSettingsService.getWorkingContext().Url = "UpdateBetSettingSportbook";
     
 } ]);

﻿/* global settingConfigurationApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSVirtualSportCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
function ($scope, $injector, $http, $location, $route, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

    shareSettingsService.getWorkingContext().Url = "UpdateBetSettingVirtualSport";

}]);

﻿/* global settingConfigurationApp */
"use strict";

// Edit Comm controller
settingConfigurationApp.controller("editCommCtrl", ['$scope', '$http', '$location', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.Comm) {
        $location.path('/');
        return;
    }

    $scope.EditCommRows = {};
    $scope.isCopyAll = false;
    $scope.buttonStatus.isNextEnabled = false;
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;

    $http.get(
            "GetEditCommData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));
            if ($scope.buttonStatus.IsBack) {
                $scope.EditCommRows = shareSettingsService.getCurSettings();
            }
            else {
                $scope.EditCommRows = data;
            }
        });

    $scope.copyAll = function () {
        if ($scope.isCopyAll) {
            $.each($scope.EditCommRows, function (index, element) {
                // Disable all checkboxes 1 -> n
                if (index === 0) {
                    element.IsChecked = true;
                }
                else {
                    element.IsChecked = true;
                    element.IsDisabled = true;
                    $scope.copyComm();
                }
            });
        }
        else {
            var orgComms = shareSettingsService.getOrgSettings();

            $.each($scope.EditCommRows, function (index, element) {
                element.IsChecked = false;
                element.IsDisabled = false;
                element.SelectedComm = orgComms[index].SelectedComm;
            });
        }
    };

    $scope.copyComm = function () {
        if ($scope.isCopyAll === true) {
            $.each($scope.EditCommRows, function (index, element) {
                element.SelectedComm = $scope.EditCommRows[0].SelectedComm;
            });
        }
    };

    $scope.$watch("EditCommRows", function () {
        $scope.buttonStatus.isNextEnabled = false;
        var orgCommList = shareSettingsService.getOrgSettings();
        var curCommList = $scope.EditCommRows;

        // A litle hack: Watch when it has data
        if (curCommList[0] !== undefined) {
            $scope.buttonStatus.isNextEnabled = $scope.isChanged(orgCommList, curCommList);
        }
    }, true);

    $scope.isChanged = function (orgCommList, curCommList) {
        var numberChangedComm = 0;
        var isChanged = true;

        $.each(curCommList, function (index, element) {
            if (element.IsChecked === true) {
                numberChangedComm++;
                if (curCommList[index].SelectedComm === orgCommList[index].SelectedComm) {
                    isChanged = false;
                }
            }
            else {
                curCommList[index].SelectedComm = orgCommList[index].SelectedComm;
            }
        });

        return (isChanged && numberChangedComm > 0) || $scope.isCopyAll;
    };

    $scope.nextReviewComm = function () {
        shareSettingsService.saveCurSettings($scope.EditCommRows);
        $location.path("/ReviewComm");
    };
} ]);

﻿/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewCommCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    $scope.supperUserName = $scope.selectedContext.CustName;

    if ($scope.selectedContext.FuncName !== ContextFunc.Comm) {
        $location.path('/');
        return;
    }

    $scope.reviewCommData = {
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgComm: shareSettingsService.getOrgSettings(),
        CurComm: shareSettingsService.getCurSettings()
    };

    $scope.updateComm = function () {
        $scope.buttonStatus.isUpdated = true;
        $scope.buttonStatus.isButtonEnable = false;
        var CommRows = shareSettingsService.getCurSettings();
        var rowIndex = getRowIndex(CommRows, -1);
        if (rowIndex !== undefined) {
            postCommission(CommRows, rowIndex);
        }
    };

    $scope.backEditComm = function () {
        if ($scope.buttonStatus.isUpdated) {
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isNextEnabled = false;
            $scope.buttonStatus.IsBack = false;
        }
        else {
            $scope.buttonStatus.IsBack = true;
        }
        $location.path("/EditComm");
    };

    var getRowIndex = function (CommRows, rowIndex) {
        for (var index = rowIndex + 1; index < CommRows.length; index++) {
            if (CommRows[index].IsChecked) {
                return index;
            }
        }
        return undefined;
    };

    var postCommission = function (CommRows, rowIndex) {
        var commRow = CommRows[rowIndex];
        commRow.Status = shareSettingsService.getStatus().Loading;
        $http.post(
            "UpdateComm",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                SportCommission: commRow
            })
        .success(function (data) {
            commRow.Message = data.Message;
            rowIndex = getRowIndex(CommRows, rowIndex);

            if (data.IsOk) {
                commRow.Status = shareSettingsService.getStatus().Success;
            }
            else {
                commRow.Status = shareSettingsService.getStatus().Fail;
            }

            if (rowIndex !== undefined) {
                postCommission(CommRows, rowIndex);
            }
            else {
                $scope.buttonStatus.isButtonEnable = true;
            }
        })
        .error(function (data) {
            commRow.Status = shareSettingsService.getStatus().Fail;
            commRow.Message = data;
        });
    };
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
 'GetLicenseeListUrl', 'GetSuperLicenseeListUrl', 'GetProductTypeListUrl', 'ContextFunc',
function ($scope, $http, $location, $route, $routeParams,
 shareSettingsService, GetLicenseeListUrl, GetSuperLicenseeListUrl, GetProductTypeListUrl, ContextFunc) {
    $scope.isButtonEnable = true;

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

    // Load licensees
    $http.get(GetLicenseeListUrl)
        .success(function (data) {
            $scope.filterData.licensees = data;
            $scope.filterData.selectedLicensee = data[0];
            $scope.selectedLicenseeChanged();
        });

    // Load products
    $http.get(GetProductTypeListUrl)
        .success(function (data) {
            $scope.filterData.productTypes = data;
            $scope.filterData.selectedProductType = data[0];
            $scope.selectedProductTypeChanged();
        });

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
        });
    };

    $scope.selectEventHandler = function () {
        // Save working context
        shareSettingsService.saveWorkingContext({
            FuncName: ContextFunc.PT,
            CustName: $scope.filterData.selectedSuperLicensee.Name,
            CustId: $scope.filterData.selectedSuperLicensee.Id,
            ProdId: $scope.filterData.selectedProductType.Id
        });

        // Refresh button on page.
        $scope.buttonStatus.IsBack = false;
        $scope.buttonStatus.isUpdated = false;
        $scope.buttonStatus.isButtonEnable = true;

        var curPath = $location.path();

        if ($scope.filterData.selectedFunction === ContextFunc.BetSetting) {
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;

            if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                $route.reload();
            }
            $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
        }
        else if ($scope.filterData.selectedFunction === ContextFunc.Comm) {
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.Comm;

            if (curPath === "/EditComm") {
                $route.reload();
                return;
            }
            $location.path("/EditComm");
        }
        else if ($scope.filterData.selectedFunction === ContextFunc.PT) {
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

    var getRowIndex = function (BSRows, rowIndex) {
        var setting = shareSettingsService.getCurSettings();

        // only one row and check apply exist member
        if (BSRows.length === 1 && setting.IsApplyExistingMemberChecked) {
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

    var postBetSetting = function (BSRows, rowIndex) {
        var bsRow = BSRows[rowIndex];
        bsRow.Status = shareSettingsService.getStatus().Loading;
        var updatedParams = {
            CustId: shareSettingsService.getWorkingContext().CustId,
            ProdId: shareSettingsService.getWorkingContext().ProdId,
            SportBetSetting: bsRow,
            IsApplyExistingMemberChecked: bsRow.IsRowSelected ? shareSettingsService.getCurSettings().IsApplyExistingMemberChecked : false,
            IsEnableChecked: shareSettingsService.getCurSettings().IsEnableChecked,
            IsDownlineChecked: shareSettingsService.getCurSettings().IsDownlineChecked
        };

        $http.post(shareSettingsService.getWorkingContext().Url, updatedParams)
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
} ]);

﻿"use strict";

angular.module('settingConfiguration.directives', []).directive('bsValidation', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ngModel) {

            var validFn = function (value) {
                var min = parseInt(attrs['min']);
                var max = parseInt(attrs['max']);

                var numValue = parseInt(value);
                return numValue >= min && (numValue <= max || attrs['max'] === "*");
            };

            attrs.$observe('min', function (newValue) {
                var valid = validFn($(elem).val());

                ngModel.$setValidity('bsValidation', valid);

                if (!valid) {
                    ngModel.$setDirty(true);

                }
                return newValue;

            });

            attrs.$observe('max', function (newValue) {
                var valid = validFn($(elem).val());

                ngModel.$setValidity('bsValidation', valid);

                if (!valid) {
                    ngModel.$setDirty(true);

                }
                return newValue;

            });

            ngModel.$parsers.push(function (inputValue) {
                var transformedText = inputValue.replace(/\D/g, '');
                if (transformedText !== inputValue) {
                    ngModel.$setViewValue(transformedText);
                    ngModel.$render();

                    return transformedText;
                }

                return inputValue;
            });

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);
                return value;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);

                return value;
            });
        }
    };
});
﻿"use strict";

// Define service module
var servicesModule = angular.module("settingConfiguration.services", []);

// Filter data service
servicesModule.service('filterDataService', [
"$http", "GetLicenseeListUrl", "GetProductTypeListUrl",
function ($http, GetLicenseeListUrl, GetProductTypeListUrl) {
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
        SportTypeId: -1,
        ProdId: -1,
        IsBack: false,
        Url: ""
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