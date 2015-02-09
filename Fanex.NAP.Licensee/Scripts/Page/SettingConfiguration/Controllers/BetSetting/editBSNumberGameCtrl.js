/* global editBSNavigatorFunc, editBSModelFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editBSNumberGameCtrl", function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });
});
