"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("reviewBSKenoCtrl", function ($scope, $http, $location, shareSettingsService) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.reviewBS = shareSettingsService.getCurSettings();


    $scope.updateBS = function () {
        $http.post(
            "UpdateBetSettingKeno",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProdId: shareSettingsService.getWorkingContext().ProdId,
                IsApplyExistingMemberChecked: shareSettingsService.getCurSettings().IsApplyExistingMemberChecked,
                BSRows: shareSettingsService.getCurSettings().BSRows
            })
        .success(function (data) {
            alert(data);

            $location.path("/");
        })
        .error(function (data) {
            alert(data);
        });
    };

    $scope.backEditBS = function () {
        $location.path('/EditBetSetting/' + $scope.selectedContext.ProdId);
    };
});
