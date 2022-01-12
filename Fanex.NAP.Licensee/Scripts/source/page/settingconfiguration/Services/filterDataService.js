"use strict";

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