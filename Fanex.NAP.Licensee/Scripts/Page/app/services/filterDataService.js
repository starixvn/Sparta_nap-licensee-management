"use strict";

// Define service module
var servicesModule = angular.module("settingConfiguration.services", []);

// Filter data service
servicesModule.service('filterDataService', ["$http", "GetLicenseeListUrl", function ($http, GetLicenseeListUrl) {
    this.getLicensees = function () {
        $http.get(GetLicenseeListUrl)
        .success(function (data) {
            return data;
        })
        .error(function (error) {
            // TODO
        });
    };

    this.getProductTypes = function () {
        $http.get(GetProductTypeListUrl)
        .success(function (data) {
            return data;
        })
        .error(function (error) {
            // TODO
        });
    };
}
]);