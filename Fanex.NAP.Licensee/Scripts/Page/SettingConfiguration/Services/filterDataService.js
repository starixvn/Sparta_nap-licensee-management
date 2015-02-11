"use strict";

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