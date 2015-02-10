/* global editBSNavigatorFunc, editBSModelFunc, editBSAllSportFunc, editBSRowCheckableSuperDownlineFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Get the module
var settingConfigurationApp = angular.module("settingConfiguration");

// Edit PT controller
settingConfigurationApp.controller("editBSKenoCtrl", function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableSuperDownlineFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
});
