(function () {
    'use strict';

    var logSettingsApp = logSettingsApp || {};

    logSettingsApp = angular.module('logSettingsApp',
        ['ngRoute', 'ngAnimate', 'fanex.dropdowntreesingle']);

    logSettingsApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }]);
})();