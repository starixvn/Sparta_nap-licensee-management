
"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editPTCtrl",['$scope', '$http', '$location',' $routeParams', 'shareSettingsService', 'ContextFunc', function ($scope, $http, $location, $routeParams, shareSettingsService, ContextFunc) {

    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.editPTData = {};
    $scope.isNextEnabled = false;

    $http.get(
            "GetEditPTData",
            {
                params: {
                    CustId: shareSettingsService.getWorkingContext().CustId,
                    ProdId: shareSettingsService.getWorkingContext().ProdId
                }
            })
        .success(function (data) {
            shareSettingsService.saveOrgSettings(angular.copy(data));

            $scope.editPTData = data;
        });

    $scope.nextReviewPT = function () {
        shareSettingsService.saveCurSettings($scope.editPTData);

        $location.path("/ReviewPT");
    };

    $scope.$watch("editPTData.SelectedPositionTaking", function () {
        $scope.isNextEnabled = false;
        // A little hack: Watch when it has data
        if ($scope.editPTData.SelectedPositionTaking !== undefined) {
            var orgSelectedPT = shareSettingsService.getOrgSettings().SelectedPositionTaking;
            var curSelectedPT = $scope.editPTData.SelectedPositionTaking;
            if (curSelectedPT !== orgSelectedPT) {
                $scope.isNextEnabled = true;
            }
        }
    }, true);
}]);
