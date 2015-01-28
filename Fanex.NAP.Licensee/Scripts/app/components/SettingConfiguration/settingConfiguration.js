"use strict";

// Module
var settingConfigurationApp = angular.module("settingConfiguration", ["ngRoute", "services"]);

// Constant
settingConfigurationApp.constant("licenseeListUrl", "GetLicenseeList")

// Routing
settingConfigurationApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/EditPT', {
        templateUrl: 'EditPT',
        controller: 'editPTCtrl'
    });
    $routeProvider.when('/ReviewPT', {
        templateUrl: 'ReviewPT',
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

    $routeProvider.otherwise({
        redirectTo: 'EditPT'
    });
} ]);

// Fix IsAjaxRequest
settingConfigurationApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
} ]); 