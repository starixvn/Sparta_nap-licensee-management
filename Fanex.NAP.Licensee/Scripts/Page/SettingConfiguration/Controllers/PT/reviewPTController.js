/* global settingConfigurationApp */

"use strict";

// Review comm controller
settingConfigurationApp.controller("reviewPTCtrl", ['$scope', '$http', '$location', '$route', 'shareSettingsService', 'ContextFunc',
function ($scope, $http, $location, $route, shareSettingsService, ContextFunc) {
    $scope.selectedContext = shareSettingsService.getWorkingContext();
    if ($scope.selectedContext.FuncName !== ContextFunc.PT) {
        $location.path('/');
        return;
    }

    $scope.reviewPTData = {};

    $scope.reviewPTData = {
        SuperUsername: shareSettingsService.getWorkingContext().CustName,
        OrgPT: shareSettingsService.getOrgSettings().SelectedPositionTaking,
        CurPT: shareSettingsService.getCurSettings().SelectedPositionTaking
    };

    $scope.updatePT = function () {
        $('.btn-primary').attr('disabled', 'disabled');
        $http.post(
            "UpdatePT",
            {
                params: {
                    CustId: shareSettingsService.getWorkingContext().CustId,
                    ProductId: shareSettingsService.getWorkingContext().ProdId,
                    PTValue: shareSettingsService.getCurSettings().SelectedPositionTaking
                }
            })
        .success(function (data) {
            if (data.IsOk === true) {
                $('#notice').html("Update PT successfully!");
                $('#notice').removeClass('alert-danger').addClass('alert-success show');
            }
            else {
                $('#notice').html(data.Message);
                $('#notice').removeClass('alert-success').addClass('alert-danger show');
            }
            $('.btn-primary').removeAttr("disabled");
        })
        .error(function (data) {
            $('#notice').html(data);
            $('#notice').removeClass('alert-success').addClass('alert-danger show');
            $('.btn-primary').removeAttr("disabled");
        });
    };

    $scope.backEditPT = function () {
        shareSettingsService.getWorkingContext().IsBack = true;
        $location.path("/EditPT");
    };
} ]);
