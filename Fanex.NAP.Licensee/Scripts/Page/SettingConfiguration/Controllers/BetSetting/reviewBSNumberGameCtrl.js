/* global settingConfigurationApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSNumberGameCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService', 
function ($scope, $injector, $http, $location, $route, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

    $scope.updateBS = function () {
        $http.post(
            "UpdateBetSettingNumberGame",
            {
                CustId: shareSettingsService.getWorkingContext().CustId,
                ProdId: shareSettingsService.getWorkingContext().ProdId,
                IsApplyExistingMemberChecked: shareSettingsService.getCurSettings().IsApplyExistingMemberChecked,
                BSRows: shareSettingsService.getCurSettings().BSRows
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
}]);
