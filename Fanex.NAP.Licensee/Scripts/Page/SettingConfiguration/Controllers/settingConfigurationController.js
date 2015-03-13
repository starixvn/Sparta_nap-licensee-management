/* global settingConfigurationApp */

"use strict";

// Main controller

settingConfigurationApp.controller("settingConfigurationCtrl", [
'$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
 'GetLicenseeListUrl', 'GetSuperLicenseeListUrl', 'GetProductTypeListUrl', 'ContextFunc',
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

    $scope.updateBS = function () {
        $scope.IsUpdating = true;
        var BSRows = shareSettingsService.getCurSettings().BSRows;
        var rowIndex = getRowIndex(BSRows, -1);
        if (rowIndex !== undefined) {
            postBetSetting(BSRows, rowIndex);
        }
    };

    var getRowIndex = function (BSRows, rowIndex) {
        for (var index = rowIndex + 1; index < BSRows.length; index++) {
            if (BSRows[index].IsRowSelected) {
                return index;
            }
        }
        return undefined;
    };

    var postBetSetting = function (BSRows, rowIndex) {
        var bsRow = BSRows[rowIndex],
            custId = shareSettingsService.getWorkingContext().CustId,
            prodId = shareSettingsService.getWorkingContext().ProdId,
            isApplyExistingMember = shareSettingsService.getCurSettings().IsApplyExistingMemberChecked;
        bsRow.Status = shareSettingsService.getStatus().Loading;

        $('.btn-primary').attr('disabled', 'disabled');

        $http.post(
            shareSettingsService.getWorkingContext().Url,
            {
                CustId: custId,
                ProdId: prodId,
                IsApplyExistingMemberChecked: isApplyExistingMember,
                SportBetSetting: bsRow
            })
        .success(function (data) {
            bsRow.Message = data.Message;
            rowIndex = getRowIndex(BSRows, rowIndex);

            if (data.IsOk) {
                bsRow.Status = shareSettingsService.getStatus().Success;
            }
            else {
                bsRow.Status = shareSettingsService.getStatus().Fail;
            }
            $('.btn-primary').removeAttr("disabled");
            if (rowIndex !== undefined) {
                postBetSetting(BSRows, rowIndex);
            }
        })
        .error(function (data) {
            bsRow.Status = shareSettingsService.getStatus().Fail;
            bsRow.Message = data;
            $('.btn-primary').removeAttr("disabled");
        });
    };
} ]);
