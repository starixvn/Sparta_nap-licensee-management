
"use strict";

// Main controller
var settingConfigurationApp = angular.module("settingConfiguration");
settingConfigurationApp.controller("settingConfigurationCtrl", [
'$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
 'GetLicenseeListUrl', 'GetSuperLicenseeListUrl', 'GetProductTypeListUrl','ContextFunc',
function ($scope, $http, $location, $route, $routeParams,
 shareSettingsService, GetLicenseeListUrl, GetSuperLicenseeListUrl, GetProductTypeListUrl, ContextFunc) {
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
        // Save working context
        shareSettingsService.saveWorkingContext({
            FuncName: ContextFunc.PT,
            CustName: $scope.filterData.selectedSuperLicensee.Name,
            CustId: $scope.filterData.selectedSuperLicensee.Id,
            ProdId: $scope.filterData.selectedProductType.Id
        });

        var curPath = $location.path();

        if ($scope.filterData.selectedFunction === ContextFunc.BetSetting) {
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;

            if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                $route.reload();
            }
            $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
        }
        else if ($scope.filterData.selectedFunction === ContextFunc.Comm) {
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.Comm;

            if (curPath === "/EditComm") {
                $route.reload();
                return;
            }
            $location.path("/EditComm");
        }
        else if ($scope.filterData.selectedFunction === ContextFunc.PT) {
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.PT;

            if (curPath === "/EditPT") {
                $route.reload();
            }
            $location.path("/EditPT");
        }
    };

} ]);
