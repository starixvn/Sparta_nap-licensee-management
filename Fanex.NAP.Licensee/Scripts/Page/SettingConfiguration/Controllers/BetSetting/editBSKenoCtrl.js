/* global settingConfigurationApp, editBSNavigatorFunc, editBSModelFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSKenoCtrl",['$scope','$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });
}]);
