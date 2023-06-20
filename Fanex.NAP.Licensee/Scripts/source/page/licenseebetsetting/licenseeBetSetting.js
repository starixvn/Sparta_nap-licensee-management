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