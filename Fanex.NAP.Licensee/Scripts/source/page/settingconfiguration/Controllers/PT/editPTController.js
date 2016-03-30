/* global settingConfigurationApp */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editPTCtrl", ['$scope', '$http', '$location', 'shareSettingsService', 'ContextFunc',
 function ($scope, $http, $location, shareSettingsService, ContextFunc) {

     $scope.selectedContext = shareSettingsService.getWorkingContext();
     if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
         $location.path('/');
         return;
     }

     $scope.editPTData = {};
     $scope.buttonStatus.isNextEnabled = false;
     $scope.supperUserName = shareSettingsService.getWorkingContext().CustName;

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
            if ($scope.buttonStatus.IsBack) {
                $scope.editPTData = shareSettingsService.getCurSettings();
            }
            else {
                $scope.editPTData = data;
            }
        });

     $scope.nextReviewPT = function () {
         shareSettingsService.saveCurSettings($scope.editPTData);
         $location.path("/ReviewPT");
     };

     $scope.$watch("editPTData.SelectedPositionTaking", function () {
         $scope.buttonStatus.isNextEnabled = false;
         // A little hack: Watch when it has data
         if ($scope.editPTData.SelectedPositionTaking !== undefined) {
             var orgSelectedPT = shareSettingsService.getOrgSettings().SelectedPositionTaking;
             var curSelectedPT = $scope.editPTData.SelectedPositionTaking;
             if (curSelectedPT !== orgSelectedPT) {
                 $scope.buttonStatus.isNextEnabled = true;
             }
         }
     }, true);
 } ]);
