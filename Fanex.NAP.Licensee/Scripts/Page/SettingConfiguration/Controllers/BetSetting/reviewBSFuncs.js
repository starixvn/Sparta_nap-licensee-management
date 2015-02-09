/* global ContextFunc */
/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

"use strict";

// Model function
var reviewBSModelFunc = function ($scope, $http, shareSettingsService) {

    $scope.reviewBS = shareSettingsService.getCurSettings();

    $http.get(
            "GetEditBetSettingData",
            {
                params: {
                    custId: shareSettingsService.getWorkingContext().CustId,
                    prodId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(JSON.parse(JSON.stringify(data)));
            $scope.editBS = data;
        });
};

// Navigator function
var reviewBSNavigatorFunc = function ($scope, $location, shareSettingsService) {
    // Redirect if wrong context
    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.BetSetting) {
        $location.path('/');
        return;
    }

    $scope.backEditBS = function () {
        $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
    };
};

