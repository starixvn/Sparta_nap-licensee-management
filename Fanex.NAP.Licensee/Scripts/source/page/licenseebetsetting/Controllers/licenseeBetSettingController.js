"use strict";

// Main controller

licenseeBetSettingApp.controller("licenseeBetSettingCtrl", [
    '$scope', '$http', '$location', '$route', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl', 'SportsbookDBSErrCode',
    function ($scope, $http, $location, $route, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl, SportsbookDBSErrCode) {
        $scope.option = 0;
        $scope.invertedSymbol = false; // to set DBS UI
        $scope.agentIdByErrorCode = -1; // to get DBS

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

        $scope.invokeLoadingMsg = function (visible) {
            $.blockUI.defaults.overlayCSS.opacity = 0;
            $.blockUI.defaults.css = {};

            if (visible) {
                $.blockUI({ message: '<div class="icon-loading"></div>' });

                $scope.buttonStatus.isButtonEnable = false;
            }
            else {
                $.unblockUI();
                $scope.buttonStatus.isButtonEnable = true;
            }
        };

        $scope.buttonStatus = {
            isNextEnabled: false,
            isBack: false,
            isUpdated: false,
            isButtonEnable: false,
            isSuccess: true
        };

        $scope.TextSettings = {
            Filter: 'Search'
        };

        $scope.selectedProductTypeChanged = function () {
            $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
        };

        $scope.selectedLicenseeChanged = function () {
            $scope.invokeLoadingMsg(true);
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

                    if (data.length === 0) {
                        $scope.filterData.selectedAgent = undefined;
                        $scope.agentSettings = {
                            idMember: "Id",
                            nameMember: "Name",
                            sourceData: [],
                            hasToolbar: false,
                            hasFilter: true,
                            hasEnter: false,
                            width: '100%',
                        };
                    }
                });
        };

        $scope.selectedSuperLicenseeChanged = function (SRecommend) {
            $scope.invokeLoadingMsg(true);
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
                    };

                    $scope.invokeLoadingMsg(false);
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

                if (data.LicenseeList.length === 0) {
                    $scope.filterData.selectedSuperLicensee = undefined;
                    $scope.superLicenseeSettings = {
                        idMember: "Id",
                        nameMember: "CurrencyWithSuper",
                        sourceData: [],
                        hasToolbar: false,
                        hasFilter: true,
                        hasEnter: false,
                        width: '100%',
                    }
                }

                $scope.filterData.productTypes = data.ProductTypeList;
                $scope.filterData.selectedProductType = data.ProductTypeList[0];
                $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
            });

        $scope.selectEventHandler = function () {
            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting) {
                $scope.option = 0; // Currency Bet Setting
            } else if ($scope.filterData.selectedFunction === ContextFunc.PlayerBetSetting) {
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
            $scope.invokeLoadingMsg(true);

            var curPath = $location.path();

            if ($scope.filterData.selectedFunction === ContextFunc.CurrencyBetSetting || $scope.filterData.selectedFunction === ContextFunc.PlayerBetSetting) {
                shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;

                if (curPath === "/EditBetSetting/" + $scope.filterData.selectedProductType.Id) {
                    $route.reload();
                }
                $location.path("/EditBetSetting/" + $scope.filterData.selectedProductType.Id);
            }
        };

        $scope.updateBS = function () {
            $scope.buttonStatus.isUpdated = true;
            $scope.buttonStatus.isButtonEnable = false;

            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            var startIndex = 0;
            postBetSetting(editedBSRows, editedDBSRows, startIndex);
        };

        $scope.checkBS = function (isDbsPage) {
            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            checkBetSetting(editedBSRows, editedDBSRows, isDbsPage);
        }

        var getEditedRows = function () {
            var bsRows = shareSettingsService.getCurSettings().BSRows;
            var dbsRows = shareSettingsService.getCurSettings().DBSRows;
            var result = {
                BSRows: [],
                DBSRows: []
            };

            for (var i = 0; i < bsRows.length; i++) {
                if ((bsRows[i].IsRowSelected && bsRows[i].IsRowUpdated) || (dbsRows != null && dbsRows[i].IsRowSelected && dbsRows[i].IsRowUpdated)) {
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
                                $scope.invokeLoadingMsg(true);
                                location.href = window.rootUrl + "LicenseeBetSetting/Index#/EditDefaultBetSetting/" + workingContext.ProdId;
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

        var isViolatedDBS = function (errCode) {
            var result = false;
            Object.values(SportsbookDBSErrCode).forEach(function (value) {
                if (value === errCode) {
                    result = true;
                }
            });

            return result;
        }

        var isLoadCurrencyDBS = function (errCode) {
            var result = false;
            var errCodes = [
                SportsbookDBSErrCode.Currency_Agent_NotIncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ];

            angular.forEach(errCodes, function (value) {
                if (value === errCode) {
                    result = true;
                }
            });

            return result;
        }

        var invertedSymbol = function (errCode) {
            var result = false;
            var errCodes = [
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ];

            angular.forEach(errCodes, function (value) {
                if (value === errCode) {
                    result = true;
                }
            });

            return result;
        }

        var checkBetSetting = function (editedBSRows, editedDBSRows, isDbsPage) {
            $scope.errMessage = '';

            var param = updatedParams();
            param.BSRows = editedBSRows;
            param.DBSRows = editedDBSRows;

            $scope.invokeLoadingMsg(true);
            $http.post('CheckBetSettingSportsbook', param)
                .success(function (data) {
                    $scope.invokeLoadingMsg(false);
                    var reviewDBSMessage = 'Please check value of Default Bet Setting which is applied for new players!';
                    var applyForPlayers = shareSettingsService.getCurSettings().IsApplyForMembersChecked;
                    $scope.agentIdByErrorCode = shareSettingsService.getWorkingContext().AgentId;
                    $scope.invertedSymbol = invertedSymbol(data.Code);

                    if (data.IsOk) {
                        if (!applyForPlayers && !isDbsPage) {
                            $scope.errMessage = reviewDBSMessage;
                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            $location.path("/ReviewBetSetting/" + shareSettingsService.getWorkingContext().ProdId);
                        }
                    }
                    else {
                        if (isViolatedDBS(data.Code) && !isDbsPage) {
                            if (!applyForPlayers) {
                                $scope.errMessage = reviewDBSMessage;
                            } else {
                                $scope.errMessage = '<b>' + data.SportOrBetTypeName + '</b>:' + data.Message;
                            }

                            if (isLoadCurrencyDBS(data.Code)) {
                                $scope.agentIdByErrorCode = 0;
                            }

                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            alert(data.SportOrBetTypeName.bold() + ': ' + data.Message);
                        }
                    }
                })
                .error(function () {
                    $scope.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var postBetSetting = function (editedBSRows, editedDBSRows, index) {

            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var bsRow = (editedBSRows[index].IsRowSelected && editedBSRows[index].IsRowUpdated) ? BSRows[editedBSRows[index].Index] : {};
            var dbsRow = (editedDBSRows.length > 0 && editedDBSRows[index].IsRowSelected && editedDBSRows[index].IsRowUpdated) ? DBSRows[editedDBSRows[index].Index] : {};

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
                        if (isViolatedDBS(data.Code)) {
                            dbsRow.Message = data.Message;
                        }
                    }

                    if (index < editedBSRows.length - 1) {
                        postBetSetting(editedBSRows, editedDBSRows, index + 1);
                    } else {
                        $scope.buttonStatus.isButtonEnable = true;
                    }
                })
                .error(function () {
                    $scope.buttonStatus.isButtonEnable = true;

                    var message = 'Please re-update this row as soon as possible!'

                    bsRow.Status = shareSettingsService.getStatus().Fail;
                    bsRow.Message = message;

                    dbsRow.Status = shareSettingsService.getStatus().Fail;
                    dbsRow.Message = message;
                });
        };
    }]);
