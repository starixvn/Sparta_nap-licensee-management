"use strict";

// Main controller
var settingConfigurationApp = angular.module("settingConfiguration");
settingConfigurationApp.controller("settingConfigurationCtrl", function ($scope, $http, $location, licenseeListUrl) {
    // Load data for ddls
    $scope.filterData = {
        // licensees
        // selectedLicensee
    };

    $http.get(licenseeListUrl)
        .success(function (data) {
            $scope.filterData.licensees = data;
            $scope.filterData.selectedLicensee = data[0];
        })
        .error(function (error) {
            $scope.filterData.licensees = error;
        });

    $scope.goToEdit = function () {
        $location.path("/EditPT");

    };
    $scope.goToComm = function () {
        $location.path("/EditComm");

    };
});
