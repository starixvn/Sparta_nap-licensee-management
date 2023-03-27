/* global settingConfigurationApp, editBSModelFunc, editBSApplyForPlayerFunc, editBSNavigatorFunc,
editBSAllSportFunc, editBSRowCheckableFunc, editBSNextEnabilityFunc, editBSNextConstraintsFunc */

"use strict";

// Edit PT controller
settingConfigurationApp.controller("editBSSportbookCtrl", ['$scope', '$injector', function ($scope, $injector) {
    // Inherit
    $injector.invoke(editBSNavigatorFunc, this, { $scope: $scope });

    $injector.invoke(editBSModelFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });

    $injector.invoke(editBSAllSportFunc, this, { $scope: $scope });

    $injector.invoke(editBSRowCheckableFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextEnabilityFunc, this, { $scope: $scope });

    $injector.invoke(editBSNextConstraintsFunc, this, { $scope: $scope });

    $injector.invoke(editBSApplyForPlayerFunc, this, { $scope: $scope });
}]);
