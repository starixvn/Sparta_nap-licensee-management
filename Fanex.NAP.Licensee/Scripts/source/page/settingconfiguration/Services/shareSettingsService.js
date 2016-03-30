"use strict";

// Define service module
var servicesModule = angular.module("settingConfiguration.services");

// Edit Comm controller
servicesModule.factory("shareSettingsService", function () {
    var workingContext = {
        FuncName: "",
        CustId: -1,
        CustName: "",
        SportTypeId: -1,
        ProdId: -1,
        IsBack: false,
        Url: ""
    };
    var settings = {
        OrgSettings: {},
        CurSettings: {}
    };
    var status = {
        Loading: 'glyphicon-refresh glyphicon-refresh-animate',
        Success: 'glyphicon-ok',
        Fail: 'glyphicon-remove'
    };

    return {
        saveOrgSettings: function (orgSettings) {
            settings.OrgSettings = orgSettings;
        },
        saveCurSettings: function (curSettings) {
            settings.CurSettings = curSettings;
        },
        getOrgSettings: function () {
            return settings.OrgSettings;

        },
        getCurSettings: function () {
            return settings.CurSettings;
        },

        saveWorkingContext: function (curContext) {
            workingContext = curContext;
        },
        getWorkingContext: function () {
            return workingContext;
        },
        getStatus: function () {
            return status;
        }
    };
});