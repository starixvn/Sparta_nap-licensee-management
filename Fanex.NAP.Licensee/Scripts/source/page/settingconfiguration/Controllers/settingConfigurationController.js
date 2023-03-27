/* global settingConfigurationApp */

"use strict";

// Main controller

settingConfigurationApp.controller("settingConfigurationCtrl", [
    '$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl',
    function ($scope, $http, $location, $route, $routeParams, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl) {
        $scope.isButtonEnable = true;
        $scope.option = false;

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
                    params: { SRecommend: SRecommend }
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
            });

        $scope.selectEventHandler = function () {
            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting) {
                $scope.option = false;
            } else {
                $scope.option = true;
            }

            // Save working context
            shareSettingsService.saveWorkingContext({
                FuncName: ContextFunc.PT,
                CustName: $scope.filterData.selectedSuperLicensee.Name,
                LicenseeName: $scope.filterData.selectedLicensee.Name,
                CustId: $scope.filterData.selectedSuperLicensee.Id,
                ProdId: $scope.filterData.selectedProductType.Id,
                AgentId: $scope.filterData.selectedAgent.Id,
                AgentName: $scope.filterData.selectedAgent.Name,
                AgentList: $scope.filterData.agents
            });

            // Refresh button on page.
            $scope.buttonStatus.IsBack = false;
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isButtonEnable = true;

            var curPath = $location.path();

            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting || $scope.filterData.selectedFunction === ContextFunc.PlayerBetSetting) {
                shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting

                if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                    $route.reload();
                }
                $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
            } else if ($scope.filterData.selectedFunction === ContextFunc.PT) {
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

        $scope.checkBS = function () {
            var BSRows = shareSettingsService.getCurSettings().BSRows;

            var rows = [];
            for (var index = -1; index < BSRows.length; index ++) {
                var rowIndex = getRowIndex(BSRows, index);
                if (rowIndex !== undefined) {
                    rows.push(angular.copy(BSRows[rowIndex]));
                    index = rowIndex - 1;
                }
            };

            checkBetSetting(rows);
        }

        var getRowIndex = function (BSRows, rowIndex) {
            var setting = shareSettingsService.getCurSettings();

            // only one row and check apply exist member
            if (BSRows.length === 1 && setting.IsApplyForMembersChecked) {
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

        var updatedParams = function (bsRow) {
            return {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProdId: shareSettingsService.getWorkingContext().ProdId,
                SportBetSetting: bsRow,
                IsEnableChecked: shareSettingsService.getCurSettings().IsEnableChecked,
                IsDownlineChecked: shareSettingsService.getCurSettings().IsDownlineChecked,
                AgentId: shareSettingsService.getWorkingContext().AgentId,
                Option: $scope.option,
                ExistedMember: shareSettingsService.getCurSettings().existedMember,
                IsNewMember: shareSettingsService.getCurSettings().isNewMember,
                DBSRows: shareSettingsService.getCurSettings().DBSRows
            }
        };

        var goToEditDBPage = function (workingContext, contextFunc) {
            $("#confirm-box").removeClass("hidden");
            $("#confirm-box").dialog({
                resizable: false,
                height: 200,
                width: 420,
                modal: true,
                buttons: {
                    "OK": {
                        text: 'Yes',
                        'class': 'btn-primary btn-ok',
                        click: function () {
                            $("#confirm-box").addClass("hidden");
                            $(this).dialog("close");
                            if (workingContext.FuncName !== contextFunc.DefaultBetSetting) {
                                workingContext.FuncName = contextFunc.DefaultBetSetting;
                                location.href = "/SettingConfiguration/Index#/EditDefaultBetSetting/" + workingContext.ProdId;
                            }
                        }
                    },
                    Cancel: {
                        text: 'No',
                        'class': 'btn-red',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                }
            });
        };

        var checkBetSetting = function (BSRows) {
            var param = updatedParams();
            param.BSRows = BSRows;
            $http.post(shareSettingsService.getWorkingContext().Url, param)
                .success(function (data) {
                    if (data.IsOk) {
                        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
                    }
                    else {
                        if (data.Code === 103) {
                            goToEditDBPage(shareSettingsService.getWorkingContext(), ContextFunc);
                        } else {
                            alert(data.Message);
                        }
                    }
                }).error(function (data) {
                    alert(data.Message);
                })
        }

        var postBetSetting = function (BSRows, rowIndex) {
            var bsRow = BSRows[rowIndex];
            bsRow.Status = shareSettingsService.getStatus().Loading;

            $http.post(shareSettingsService.getWorkingContext().Url, updatedParams(bsRow))
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
