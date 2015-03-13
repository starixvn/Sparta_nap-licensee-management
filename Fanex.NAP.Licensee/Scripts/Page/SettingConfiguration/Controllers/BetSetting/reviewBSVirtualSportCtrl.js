/* global settingConfigurationApp, reviewBSNavigatorFunc, reviewBSModelFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("reviewBSVirtualSportCtrl", ['$scope', '$injector', '$http', '$location', '$route', 'shareSettingsService', 
function ($scope, $injector, $http, $location, $route, shareSettingsService) {
    // Inherit
    $injector.invoke(reviewBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(reviewBSModelFunc, this, { $scope: $scope });

    shareSettingsService.getWorkingContext().Url = "UpdateBetSettingVirtualSport";

}]);
