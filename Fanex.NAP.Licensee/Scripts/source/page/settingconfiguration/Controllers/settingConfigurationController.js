/* global settingConfigurationApp */

"use strict";

// Main controller

settingConfigurationApp.controller("settingConfigurationCtrl", [
'$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl',
    function ($scope, $http, $location, $route, $routeParams, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl) {
    $scope.isButtonEnable = true;
    $scope.isAgentOnly = false;

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

    $scope.buttonStatus = {
        isNextEnabled: false,
        isBack: false,
        isUpdated: false,
        isButtonEnable: true,
        isSuccess: true
        };

    $scope.selectedProductTypeChanged = function () {
        $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
        $scope.isEnableAgentListSelectAndAgentOnlyCheckbox = $scope.filterData.selectedProductType.Id === 1 && $scope.filterData.selectedFunction === "Bet setting";
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
            $scope.superLicenseeRequiredSettings = { Require: false };
            $scope.superLicenseeSettings = {
                idMember: "Id",
                nameMember: "Name",
                sourceData: data
            }
            $http.get(
                GetLicenseeAgentListUrl,
                {
                    params: { SRecommend: $scope.filterData.selectedSuperLicensee.Id }
                }
            )
                .success(function (data1) {
                    $scope.filterData.agents = data1
                    $scope.filterData.selectedAgent = data1[0];
                    $scope.agentRequiredSettings = { Require: false };
                    $scope.agentSettings = {
                        idMember: "Id",
                        nameMember: "Name",
                        sourceData: data1
                    }
                });
        });
    };

    $scope.selectedSuperLicenseeChanged = function (SRecommend) {


        $http.get(
            GetLicenseeAgentListUrl,
            {
                params: { SRecommend: SRecommend  }
            }
        )
            .success(function (data) {
                $scope.filterData.agents = data;
                $scope.filterData.selectedAgent = data[0];
                $scope.agentRequiredSettings = { Require: false };
                $scope.agentSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data
                }
            });
    };

    $scope.selectedFunctionChanged = function () {
        $scope.isEnableAgentListSelectAndAgentOnlyCheckbox = $scope.filterData.selectedProductType.Id === 1 && $scope.filterData.selectedFunction === "Bet setting";
        };

    $http.get(GetSettingsUrl)
        .success(function (data) {
            $scope.filterData.licensees = data.LicenseeList;
            $scope.filterData.selectedLicensee = data.LicenseeList[0];
            $scope.licenseeRequiredSettings = { Require: false };
            $scope.licenseeSettings = {
                idMember: "Id",
                nameMember: "Name",
                sourceData: data.LicenseeList
            }

            $scope.filterData.productTypes = data.ProductTypeList;
            $scope.filterData.selectedProductType = data.ProductTypeList[0];
            $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];

            $scope.filterData.superLicensees = data.SuperLicenseeList;
            $scope.filterData.selectedSuperLicensee = data.SuperLicenseeList[0];
            $scope.superLicenseeRequiredSettings = { Require: false };
            $scope.superLicenseeSettings = {
                idMember: "Id",
                nameMember: "Name",
                sourceData: data.SuperLicenseeList
            }

            $scope.filterData.agents = data.AgentList;
            $scope.filterData.selectedAgent = data.AgentList[0];
            $scope.agentRequiredSettings = { Require: false };
            $scope.agentSettings = {
                idMember: "Id",
                nameMember: "Name",
                sourceData: data.AgentList
            }

            $scope.isEnableAgentListSelectAndAgentOnlyCheckbox = $scope.filterData.selectedProductType.Id === 1 && $scope.filterData.selectedFunction === "Bet setting";
        });


    $scope.selectEventHandler = function () {
        // Save working context
        shareSettingsService.saveWorkingContext({
            FuncName: ContextFunc.PT,
            CustName: $scope.filterData.selectedSuperLicensee.Name,
            CustId: $scope.filterData.selectedSuperLicensee.Id,
            ProdId: $scope.filterData.selectedProductType.Id,
            AgentId: $scope.filterData.selectedAgent.Id,
            AgentName: $scope.filterData.selectedAgent.Name,
            AgentList: $scope.filterData.agents,
            IsAgentOnly: $scope.isAgentOnly
        });

        // Refresh button on page.
        $scope.buttonStatus.IsBack = false;
        $scope.buttonStatus.isUpdated = false;
        $scope.buttonStatus.isButtonEnable = true;

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
        $scope.buttonStatus.isUpdated = true;
        $scope.buttonStatus.isButtonEnable = false;
        var BSRows = shareSettingsService.getCurSettings().BSRows;
        var rowIndex = getRowIndex(BSRows, -1);
        if (rowIndex !== undefined) {
            postBetSetting(BSRows, rowIndex);
        }
    };

    var getRowIndex = function (BSRows, rowIndex) {
        var setting = shareSettingsService.getCurSettings();

        // only one row and check apply exist member
        if (BSRows.length === 1 && setting.IsApplyExistingMemberChecked) {
            return 0;
        }

        for (var index = rowIndex + 1; index < BSRows.length; index++) {
            if (BSRows[index].IsRowSelected
                || (setting.IsEnableChecked && !setting.IsEnableDisabled)
                || (setting.IsDownlineChecked && !setting.IsDownlineDisabled)) {
                return index;
            }
        }
        return undefined;
    };

    var postBetSetting = function (BSRows, rowIndex) {
        var bsRow = BSRows[rowIndex];
        bsRow.Status = shareSettingsService.getStatus().Loading;

        var updatedParams = {
            CustId: shareSettingsService.getWorkingContext().CustId,
            ProdId: shareSettingsService.getWorkingContext().ProdId,
            SportBetSetting: bsRow,
            IsApplyExistingMemberChecked: bsRow.IsRowSelected ? shareSettingsService.getCurSettings().IsApplyExistingMemberChecked : false,
            IsEnableChecked: shareSettingsService.getCurSettings().IsEnableChecked,
            IsDownlineChecked: shareSettingsService.getCurSettings().IsDownlineChecked,
            AgentId: shareSettingsService.getWorkingContext().AgentId,
            IsAgentOnly: shareSettingsService.getWorkingContext().IsAgentOnly
        };

        $http.post(shareSettingsService.getWorkingContext().Url, updatedParams)
        .success(function (data) {
            bsRow.Message = data.Message;
            rowIndex = getRowIndex(BSRows, rowIndex);

            if (data.IsOk) {
                bsRow.Status = shareSettingsService.getStatus().Success;
            }
            else {
                bsRow.Status = shareSettingsService.getStatus().Fail;
            }

            if (rowIndex !== undefined && BSRows.length > 1) {
                postBetSetting(BSRows, rowIndex);
            }
            else {
                $scope.buttonStatus.isButtonEnable = true;
            }
        })
        .error(function (data) {
            bsRow.Status = shareSettingsService.getStatus().Fail;
            bsRow.Message = data;
        });
    };
}]);
