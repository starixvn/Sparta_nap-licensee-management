/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewCommCtrl", ['$scope', '$http', '$location','$route', 'shareSettingsService', 'ContextFunc', 
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName !== ContextFunc.Comm) {
        $location.path('/');
        return;
    }

    $scope.reviewCommData = {
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgComm: shareSettingsService.getOrgSettings(),
        CurComm: shareSettingsService.getCurSettings()
    };

    $scope.updateComm = function () {
        $http.post(
            "UpdateComm",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                CommRows: shareSettingsService.getCurSettings()
            })
        .success(function (data) {
            alert(data, false, function () {
                $location.path("/");
                $route.reload();
            });
        })
        .error(function (data) {
            alert(data);
        });
    };

    $scope.backEditComm = function () {
        $location.path("/EditComm");
    };
}]);
