/* global licenseeBetSettingApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

licenseeBetSettingApp.controller("reviewBSSportsbookCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService',
 function ($scope, $injector, $http, $location, $route, shareSettingsService) {
     // Inherit
     $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

     $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

     shareSettingsService.getWorkingContext().Url = "UpdateBetSettingSportsbook";
     
 } ]);
