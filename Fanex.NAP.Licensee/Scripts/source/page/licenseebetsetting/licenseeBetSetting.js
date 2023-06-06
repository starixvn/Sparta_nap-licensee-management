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