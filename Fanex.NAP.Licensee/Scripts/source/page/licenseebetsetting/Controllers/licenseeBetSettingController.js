"use strict";

// Main controller

licenseeBetSettingApp.controller("licenseeBetSettingCtrl", [
    '$scope', '$q', '$http', '$location', '$route', 'shareSettingsService',
    'GetSuperLicenseeListUrl', 'GetLicenseeAgentListUrl', 'ContextFunc', 'GetSettingsUrl', 'SportsbookDBSErrCode',
    function ($scope, $q, $http, $location, $route, shareSettingsService, GetSuperLicenseeListUrl, GetLicenseeAgentListUrl, ContextFunc, GetSettingsUrl, SportsbookDBSErrCode) {
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

        $scope.buttonStatus = {
            isNextEnabled: false,
            isBack: false,
            isUpdated: false,
            isButtonEnable: true,
            isSuccess: true,
            isCopyDisabled: true 
        };

        $scope.TextSettings = {
            Filter: 'Search'
        };

        $scope.selectedProductTypeChanged = function () {
            $scope.filterData.selectedFunction = $scope.filterData.selectedProductType.Functions[0];
        };

        $scope.selectedLicenseeChanged = function () {
            site.invokeLoadingMsg(true);
            var licensee = $scope.filterData.selectedLicensee;
            var licenseeName = licensee ? licensee.Name : '';

            $http.get(
                GetSuperLicenseeListUrl,
                {
                    params: { siteName: licenseeName }
                }
            )
                .success(function (data) {
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
                        $scope.selectedSuperLicenseeChanged();
                    }
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    $scope.buttonStatus.isButtonEnable = false;
                    alert(site.requestErrMsg);
                });
        };

        $scope.selectedSuperLicenseeChanged = function () {
            site.invokeLoadingMsg(true);
            var superLicensee = $scope.filterData.selectedSuperLicensee;
            var SRecommend = superLicensee !== undefined ? superLicensee.Id : -1;

            $http.get(
                GetLicenseeAgentListUrl,
                {
                    params: { SRecommend: SRecommend }
                }
            )
                .success(function (data) {
                    data = superLicensee !== undefined ? data : [];
                    $scope.filterData.agents = data
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

                    site.invokeLoadingMsg(false);
                    $scope.buttonStatus.isButtonEnable = data.length > 0;
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    $scope.buttonStatus.isButtonEnable = false;
                    alert(site.requestErrMsg);
                });
        };

        $scope.selectEventHandler = function () {
            if (!$scope.buttonStatus.isButtonEnable) {
                return;
            }

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
            site.invokeLoadingMsg(true);

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
            if ($scope.buttonStatus.isUpdated) {
                return;
            }

            $scope.buttonStatus.isUpdated = true;
            $scope.buttonStatus.isButtonEnable = false;

            postBetSetting();
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
                if (bsRows[i].IsRowSelected || (dbsRows.length > 0 && dbsRows[i].IsRowSelected)) {
                    bsRows[i].Index = i;
                    result.BSRows.push(bsRows[i]);
                    if (dbsRows.length > 0) {
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
                                site.invokeLoadingMsg(true);
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
            return Object.values(SportsbookDBSErrCode).includes(errCode);
        }

        var checkBetSetting = function (editedBSRows, editedDBSRows, isDbsPage) {
            $scope.errMessage = '';

            var param = updatedParams();
            param.BSRows = editedBSRows;
            param.DBSRows = editedDBSRows;

            var loadCurrencyDbsErrCode = [
                SportsbookDBSErrCode.Currency_Agent_NotIncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ];

            var invertSymbolErrCodes = [
                SportsbookDBSErrCode.Player_Agent_IncludePlayer_ViolatedCurrencyDBSCode,
                SportsbookDBSErrCode.Currency_Agent_IncludePlayer_ViolatedCurrencyDBSCode
            ]

            site.invokeLoadingMsg(true);
            $http.post('CheckBetSettingSportsbook', param)
                .success(function (data) {
                    site.invokeLoadingMsg(false);
                    var reviewDBSMessage = 'Please check value of Default Bet Setting which is applied for new players!';
                    var applyForPlayers = shareSettingsService.getCurSettings().IsApplyForMembersChecked;
                    $scope.agentIdByErrorCode = shareSettingsService.getWorkingContext().AgentId;
                    $scope.invertedSymbol = invertSymbolErrCodes.includes(data.Code);

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

                            if (loadCurrencyDbsErrCode.includes(data.Code)) {
                                $scope.agentIdByErrorCode = 0;
                            }

                            goToEditDBPage(shareSettingsService.getWorkingContext());
                        } else {
                            alert(data.SportOrBetTypeName.bold() + ': ' + data.Message);
                        }
                    }
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        var postBetSetting = function () {
            var BSRows = shareSettingsService.getCurSettings().BSRows;
            var DBSRows = shareSettingsService.getCurSettings().DBSRows;

            var editedRows = getEditedRows();
            var editedBSRows = editedRows.BSRows;
            var editedDBSRows = editedRows.DBSRows;

            var promises = [];

            $.each(editedBSRows, function (index) {

                var bsRow = (editedBSRows[index].IsRowSelected) ? BSRows[editedBSRows[index].Index] : {};
                var dbsRow = (editedDBSRows.length > 0 && editedDBSRows[index].IsRowSelected) ? DBSRows[editedDBSRows[index].Index] : {};

                var param = updatedParams();
                param.BSRows = angular.equals({}, bsRow) ? null : [bsRow];
                param.DBSRows = angular.equals({}, dbsRow) ? null : [dbsRow];

                bsRow.Status = shareSettingsService.getStatus().Loading;
                dbsRow.Status = shareSettingsService.getStatus().Loading;

                var promise = $http.post(shareSettingsService.getWorkingContext().Url, param)
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
                    })
                    .error(function () {
                        var message = 'Please re-update this row as soon as possible!'

                        bsRow.Status = shareSettingsService.getStatus().Fail;
                        bsRow.Message = message;

                        dbsRow.Status = shareSettingsService.getStatus().Fail;
                        dbsRow.Message = message;
                    });
                promises.push(promise);
            });

            $q.all(promises).then(function () {
                $scope.buttonStatus.isButtonEnable = true;
            }).catch(function () {
                $scope.buttonStatus.isButtonEnable = true;
            });

        };

        function init() {
            site.invokeLoadingMsg(true);
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

                    if (data.LicenseeList.length === 0) {
                        $scope.selectedLicenseeChanged();
                    }
                })
                .error(function () {
                    site.invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                });
        }

        init();
    }]);
