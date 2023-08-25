/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

"use strict";

// Model function
var reviewBSModelFunc = function ($scope, shareSettingsService) {
    $scope.reviewBS = shareSettingsService.getCurSettings();

    $scope.isShowDBS = function () {
        var DBSRows = $scope.reviewBS.DBSRows;
        if (DBSRows === undefined || DBSRows === null || angular.equals({}, DBSRows)) {
            return false;
        }

        var isValidDBSData = DBSRows.every(function (_) {
            return (_.MinBet === ""
                && _.MaxBet === ""
                && _.MaxPerMatch === ""
                && (_.MaxPayoutPerMatch === ""));
        });

        if (isValidDBSData) {
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
            if (agentList.length >= 8) {
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
};
reviewBSModelFunc.$inject = ['$scope', 'shareSettingsService'];
// Navigator function
var reviewBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
    // Redirect if wrong context
    var selectedContext = shareSettingsService.getWorkingContext();
    if (selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.backEditBS = function () {
        if (!$scope.buttonStatus.isButtonEnable) {
            return;
        }

        if ($scope.buttonStatus.isUpdated) {
            $scope.buttonStatus.isUpdated = false;
            $scope.buttonStatus.isNextEnabled = false;
            $scope.buttonStatus.IsBack = false;
        }
        else {
            $scope.buttonStatus.IsBack = true;
        }

        $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
    };
};
reviewBSNavigatorFunc.$inject = ['$scope', '$location', 'shareSettingsService', 'ContextFunc'];
