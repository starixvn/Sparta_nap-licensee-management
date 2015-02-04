/* exported ContextFunc */
"use strict";

// Module
var settingConfigurationApp = angular.module("settingConfiguration", ["ngRoute", "ngAnimate", "settingConfiguration.services"]);

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

    $routeProvider.otherwise({
        redirectTo: '/'
    });
} ]);

// Fix IsAjaxRequest
settingConfigurationApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
} ]);

// Constants
var ContextFunc = {
    BetSetting: "Bet setting",
    Comm: "Comm",
    PT: "PT"
};

