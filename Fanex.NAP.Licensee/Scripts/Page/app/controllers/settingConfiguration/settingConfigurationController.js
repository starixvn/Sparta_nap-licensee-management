"use strict";

// Main controller
var settingConfigurationApp = angular.module("settingConfiguration");
settingConfigurationApp.controller("settingConfigurationCtrl", function ($scope, $http, $location, shareSettingsService,
                                    GetLicenseeListUrl, GetSuperLicenseeListUrl, GetProductTypeListUrl) {
    // Load data for ddls
    $scope.filterData = {
        // licensees
        // superLicensees
        // productTypes
        // selectedLicensee
        // selectedSuperLicensee
        // selectedProductType
        // selectedFunction
    };

    // Load licensees
    $http.get(GetLicenseeListUrl)
        .success(function (data) {
            $scope.filterData.licensees = data;
            $scope.filterData.selectedLicensee = data[0];
            $scope.selectedLicenseeChanged();
        });

    // Load products
    $http.get(GetProductTypeListUrl)
        .success(function (data) {
            $scope.filterData.productTypes = data;
            $scope.filterData.selectedProductType = data[0];
            $scope.selectedProductTypeChanged();
        });

    $scope.selectedProductTypeChanged = function () {
        $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
    };

    $scope.selectedLicenseeChanged = function () {
        $http.get(
            GetSuperLicenseeListUrl,
            {
                params: { siteName: $scope.filterData.selectedLicensee.Name }
            }
        )
        .success(function (data) {
            $scope.filterData.superLicensees = data;
            $scope.filterData.selectedSuperLicensee = data[0];
        });
    };

    $scope.selectEventHandler = function () {
        if ($scope.filterData.selectedFunction === "Bet setting") {
            // TODO: Pass data
            $location.path("/EditComm");
        }
        else if ($scope.filterData.selectedFunction === "Comm") {
            // TODO: Pass data
            $location.path("/EditComm");
        }
        else if ($scope.filterData.selectedFunction === "PT") {
            // TODO: Pass data
            shareSettingsService.saveCurrentSettings({
                custId: $scope.filterData.selectedSuperLicensee.Id,
                productId: $scope.filterData.selectedProductType.Id
            });

            $location.path("/EditPT");
        }

    };

});
