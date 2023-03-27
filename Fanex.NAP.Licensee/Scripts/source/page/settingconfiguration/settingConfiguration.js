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


