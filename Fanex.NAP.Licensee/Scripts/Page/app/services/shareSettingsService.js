"use strict";

// Define service module
var servicesModule = angular.module("settingConfiguration.services");

// Edit Comm controller
servicesModule.factory("shareSettingsService", function () {
    var settings = {
        orgSettings: {},
        curSettings: {}
    };

    return {
        saveCurrentSettings: function (curSettings) {
            settings.curSettings = curSettings;
        },

        getCurrentSettings: function () {
            return settings.curSettings;
        },

        saveOrgSettings: function (orgSettings) {
            settings.orgSettings = orgSettings;
        },

        getOrgSettings: function () {
            return settings.orgSettings;
        }
    };
});