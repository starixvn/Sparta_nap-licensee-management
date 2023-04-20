/* global settingConfigurationApp */

"use strict";

// Main controller

settingConfigurationApp.controller("settingConfigurationCtrl", [
    '$scope', '$http', '$location', '$route', '$routeParams', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl',
    function ($scope, $http, $location, $route, $routeParams, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl) {
        $scope.isButtonEnable = true;
        $scope.option = 0;
        $scope.SportOrBetTypeName = '';

        var dbsErrorCode = 103;

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

        $scope.TextSettings = {
            Filter: 'Search'
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
                    $scope.filterData.selectedSuperLicensee = data[0];
                    $scope.superLicenseeSettings = {
                        idMember: "Id",
                        nameMember: "CurrencyWithSuper",
                        sourceData: data,
                        hasToolbar: false,
                        hasFilter: true,
                        hasEnter: false,
                        width: '100%',
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
                            $scope.agentSettings = {
                                idMember: "Id",
                                nameMember: "Name",
                                sourceData: data1,
                                hasToolbar: false,
                                hasFilter: true,
                                hasEnter: false,
                                width: '100%',
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
                    $scope.agentSettings = {
                        idMember: "Id",
                        nameMember: "Name",
                        sourceData: data,
                        hasToolbar: false,
                        hasFilter: true,
                        hasEnter: false,
                        width: '100%',
                    }
                });
        };

        $http.get(GetSettingsUrl)
            .success(function (data) {
                $scope.filterData.licensees = data.LicenseeList;
                $scope.filterData.selectedLicensee = data.LicenseeList[0];
                $scope.licenseeSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.LicenseeList,
                    hasToolbar: false,
                    hasFilter: true,
                    hasEnter: false,
                    width: '100%',
                }

                $scope.filterData.productTypes = data.ProductTypeList;
                $scope.filterData.selectedProductType = data.ProductTypeList[0];
                $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];

                $scope.filterData.superLicensees = data.SuperLicenseeList;
                $scope.filterData.selectedSuperLicensee = data.SuperLicenseeList[0];
                $scope.superLicenseeSettings = {
                    idMember: "Id",
                    nameMember: "CurrencyWithSuper",
                    sourceData: data.SuperLicenseeList,
                    hasToolbar: false,
                    hasFilter: true,
                    hasEnter: false,
                    width: '100%',
                }

                $scope.filterData.agents = data.AgentList;
                $scope.filterData.selectedAgent = data.AgentList[0];
                $scope.agentSettings = {
                    idMember: "Id",
                    nameMember: "Name",
                    sourceData: data.AgentList,
                    hasToolbar: false,
                    hasFilter: true,
                    hasEnter: false,
                    width: '100%',
                }
            });

        $scope.selectEventHandler = function () {
            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting) {
                $scope.option = 0; // Currency Bet Setting
            } else {
                $scope.option = 1; // Player Bet Setting
            }

            // Save working context
            shareSettingsService.saveWorkingContext({
                FuncName: ContextFunc.BetSetting,
                LicenseeName: $scope.filterData.selectedLicensee.Name,
                CustId: $scope.filterData.selectedSuperLicensee.Id,
                CurrencyId: $scope.filterData.selectedSuperLicensee.CurrencyId,
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

            shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting

            if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                $route.reload();
            }
            $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
        };

        $scope.updateBS = function () {
            $scope.buttonStatus.isUpdated = true;
            $scope.buttonStatus.isButtonEnable = false;
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var editedRows = getEditedRows(BSRows, DBSRows);
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            var startIndex = 0;
            postBetSetting(editedBSRows, editedDBSRows, startIndex);
        };

        $scope.checkBS = function () {
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var editedRows = getEditedRows(BSRows, DBSRows);
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            checkBetSetting(editedBSRows, editedDBSRows);
        }

        var getEditedRows = function (bsRows, dbsRows) {
            var result = {
                BSRows: [],
                DBSRows: []
            };

            for (var i = 0; i < bsRows.length; i++) {
                if (bsRows[i].IsRowSelected || (dbsRows != null && dbsRows[i].IsRowSelected)) {
                    bsRows[i].Index = i;
                    result.BSRows.push(bsRows[i]);
                    if (dbsRows !== null) {
                        dbsRows[i].Index = i;
                        result.DBSRows.push(dbsRows[i]);
                    }
                }
            }

            return result;
        }

        var updatedParams = function () {
            return {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProdId: shareSettingsService.getWorkingContext().ProdId,
                AgentId: shareSettingsService.getWorkingContext().AgentId,
                Option: $scope.option,
                ExistedMember: shareSettingsService.getCurSettings().existedMember,
                IsNewMember: shareSettingsService.getCurSettings().isNewMember
                // BSRows
                // DBRows
            }
        };

        var goToEditDBPage = function (workingContext) {
            $("#confirm-box").removeClass("hidden");
            $("#confirm-box").dialog({
                resizable: false,
                height: 200,
                width: 540,
                modal: true,
                buttons: {
                    "OK": {
                        text: 'Yes',
                        'class': 'btn-primary btn-ok',
                        click: function () {
                            $("#confirm-box").addClass("hidden");
                            $(this).dialog("close");
                            var curPath = location.pathname;
                            if (curPath !== "/EditDefaultBetSetting/" + workingContext.ProdId) {
                                location.href = window.rootUrl + "SettingConfiguration/Index#/EditDefaultBetSetting/" + workingContext.ProdId;
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

        var checkBetSetting = function (editedBSRows, editedDBSRows) {
            var param = updatedParams();
            param.BSRows = editedBSRows;
            param.DBSRows = editedDBSRows;

            $http.post('CheckBetSettingSportsbook', param)
                .success(function (data) {
                    if (data.IsOk) {
                        $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
                    }
                    else {
                        if (data.Code === dbsErrorCode) {
                            $scope.SportOrBetTypeName = data.SportOrBetTypeName;
                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            alert(data.SportOrBetTypeName.bold() + ': ' + data.Message);
                        }
                    }
                }).error(function (data) {
                    alert(data);
                })
        }

        var postBetSetting = function (editedBSRows, editedDBSRows, index) {

            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var bsRow = editedBSRows[index].IsRowSelected ? BSRows[editedBSRows[index].Index] : {};
            var dbsRow = (editedDBSRows.length > 0 && editedDBSRows[index].IsRowSelected) ? DBSRows[editedDBSRows[index].Index] : {};

            var param = updatedParams();
            param.BSRows = angular.equals({}, bsRow) ? null : [bsRow];
            param.DBSRows = angular.equals({}, dbsRow) ? null : [dbsRow];

            bsRow.Status = shareSettingsService.getStatus().Loading;
            dbsRow.Status = shareSettingsService.getStatus().Loading;

            $http.post(shareSettingsService.getWorkingContext().Url, param)
                .success(function (data) {

                    if (data.IsOk) {
                        bsRow.Status = shareSettingsService.getStatus().Success;
                        dbsRow.Status = shareSettingsService.getStatus().Success;
                    } else {
                        bsRow.Status = shareSettingsService.getStatus().Fail;
                        dbsRow.Status = shareSettingsService.getStatus().Fail;

                        bsRow.Message = data.Message;
                        if (data.Code === dbsErrorCode) {
                            dbsRow.Message = data.Message;
                        }
                    }
                    $scope.buttonStatus.isButtonEnable = true;

                    if (index < editedBSRows.length - 1) {
                        postBetSetting(editedBSRows, editedDBSRows, index + 1);
                    }
                })
                .error(function (data) {
                    var message = 'Please re-update this row as soon as possible!'

                    bsRow.Status = shareSettingsService.getStatus().Fail;
                    bsRow.Message = message;

                    dbsRow.Status = shareSettingsService.getStatus().Fail;
                    dbsRow.Message = message;
                });
        };
    }]);
