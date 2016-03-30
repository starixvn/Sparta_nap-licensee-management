/* exported reviewBSModelFunc, reviewBSNavigatorFunc */

"use strict";

// Model function
var reviewBSModelFunc = function ($scope, $http, shareSettingsService) {
    $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;
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
            shareSettingsService.saveOrgSettings(angular.copy(data));
            $scope.editBS = data;
        });
};
    reviewBSModelFunc.$inject = ['$scope', '$http', 'shareSettingsService'];
// Navigator function
    var reviewBSNavigatorFunc = function ($scope, $location, shareSettingsService, ContextFunc) {
        // Redirect if wrong context
        $scope.selectedContext = shareSettingsService.getWorkingContext();
        if ($scope.selectedContext.FuncName === "" || $scope.selectedContext.FuncName !== ContextFunc.BetSetting) {
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
            $location.path('/EditBetSetting/' + shareSettingsService.getWorkingContext().ProdId);
        };
    };
reviewBSNavigatorFunc.$inject = ['$scope', '$location', 'shareSettingsService', 'ContextFunc'];
