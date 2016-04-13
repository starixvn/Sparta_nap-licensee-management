/// <reference path="/@JSense.js" />
/*exported ReCheckin*/
"use strict";

function ReCheckin() {
    var urlRecheck = window.rootUrl + "UserLogin/Login/ReCheckLogin";
    var urlLogout = window.rootUrl + "UserLogin/Login/LogOut";
    var underMaintenanceCode = 999999;

    $.ajax({
        url: urlRecheck,
        type: "POST",
        dataType: "json",
        success: function (result) {
            if (result.IsKickedOut === "1") {
                alert('You have logged in from another session or your login session has expired!');
                window.location.href = urlLogout;
            }
        },
        error: function (response) {
            var result = $.parseJSON(response.responseText);
            if (result.code === underMaintenanceCode) {
                window.location.href = urlLogout;
            }
        }
    });
}

$(document).ready(function () {
    setInterval(ReCheckin, 10000);
});