/* global reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("reviewBSVirtualSportCtrl", function ($scope, $injector, $http, $location, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

    $scope.updateBS = function () {
        $http.post(
            "UpdateBetSettingVirtualSport",
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
});
