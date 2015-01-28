"use strict";

// Define service module
var servicesModule = angular.module("services", []);

// Edit Comm controller
servicesModule.factory("shareSettingsService", function () {
    var settings = {
        preSettings: {},
        curSettings: {}
    };

    return {
        saveCurrentSettings: function (curSettings) {
            settings.curSettings = curSettings;
        },

        getCurrentSettings: function () {
            return settings.curSettings;
        }
    };
});