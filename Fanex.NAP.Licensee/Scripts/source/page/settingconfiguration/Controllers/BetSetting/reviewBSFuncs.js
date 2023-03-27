/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

"use strict";

// Model function
var reviewBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;
    $scope.reviewBS = shareSettingsService.getCurSettings();

    $scope.isShowDBS = function () {
        var DBSRows = $scope.reviewBS.DBSRows;
        if (DBSRows === undefined || DBSRows === null || angular.equals({}, DBSRows)) {
            return false;
        }

        if (DBSRows[0].MinBet === '' && DBSRows[0].MaxBet === '' && DBSRows[0].MaxPerMatch === '' && DBSRows[0].MaxPayoutPerMatch === '') {
            return false;
        }

        return true;
    }

    function getAgentsHeader() {
        var res = "";
        var agentId = shareSettingsService.getWorkingContext().AgentId;
        var agentName = shareSettingsService.getWorkingContext().AgentName;
        var agentList = shareSettingsService.getWorkingContext().AgentList;

        if (agentId === 0) {
            if (agentList.length >= 7) {
                for (var i = 1; i < 7; i++) {
                    res += agentList[i].Name + ", ";
                }
                res += "...";
            }
            else {
                for (var j = 1; j < agentList.length; j++) {
                    if (j === agentList.length - 1) {
                        res += agentList[j].Name;
                    }
                    else {
                        res += agentList[j].Name + ", ";
                    }
                }
            }
        }
        else {
            res = agentName;
        }
        return res;
    }

    $scope.header = getAgentsHeader();
    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId,
                    agentId: shareSettingsService.getWorkingContext().AgentId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));
            $scope.editBS = data;
        });
};
    reviewBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];
// Navigator function
    var reviewBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
        // Redirect if wrong context
        var selectedContext = shareSettingsService.getWorkingContext();
        if (selectedContext.FuncName === "" || (selectedContext.FuncName !== ContextFunc.BetSetting && selectedContext.FuncName !== ContextFunc.DefaultBetSetting)) {
            $location.path('/');
            return;
        }

        $scope.backEditBS = function () {
            if ($scope.buttonStatus.isUpdated) {
                $scope.buttonStatus.isUpdated = false;
                $scope.buttonStatus.isNextEnabled = false;
                $scope.buttonStatus.IsBack = false;
            }
            else {
                $scope.buttonStatus.IsBack = true;
            }
            shareSettingsService.getWorkingContext().FuncName = ContextFunc.BetSetting;
            $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
        };
    };
reviewBSNavigatorFunc.$inject = ['$scope', '$location', 'shareSettingsService', 'ContextFunc'];
