/* global ContextFunc */

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
        if ($scope.filterData.selectedFunction === ContextFunc.BetSetting) {
            // TODO: Pass data
            $location.path("/EditComm");
        }
        else if ($scope.filterData.selectedFunction === ContextFunc.Comm) {
            // TODO: Pass data
            $location.path("/EditComm");
        }
        else if ($scope.filterData.selectedFunction === ContextFunc.PT) {
            // TODO: Pass data
            shareSettingsService.saveWorkingContext({
                FuncName: ContextFunc.PT,
                CustName: $scope.filterData.selectedSuperLicensee.Name,
                CustId: $scope.filterData.selectedSuperLicensee.Id,
                ProdId: $scope.filterData.selectedProductType.Id
            });

            $location.path("/EditPT");
        }
    };

});
