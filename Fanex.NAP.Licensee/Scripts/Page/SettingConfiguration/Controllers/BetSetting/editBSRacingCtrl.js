/* global editBSModelFunc, editBSNavigatorFunc, editBSAllSportFunc, editBSRowCheckableSuperDownlineFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editBSRacingCtrl", function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableSuperDownlineFunc, this, { $scope: $scope });
});
