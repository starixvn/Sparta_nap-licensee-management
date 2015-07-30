'use strict';
/* global CryptoJS */
/* jshint unused: vars */
var login = (function () {
    var $loginForm = $('#frmLogin');
    var $username = $('#username');
    var $password = $('#password');
    var $token = $('#loginToken');
    var $msgbox = $('#msg');
    var $innerMsg = $('#inner-msg');

    function trim(string) {
        return string.replace(/^\s+|\s+$/g, '');
    }

    function encryptPassword(password) {
        var encryptPwd = CryptoJS.CfsEnCode(password);
        var token = $token.val();
        var hashPwd = CryptoJS.SHA256(encryptPwd + token);

        $password.val(hashPwd);
    }

    function doLogin() {
        clearError();
        if (!checkInputValid()) {
            return false;
        }

        encryptPassword($password.val());

        return true;
    }

    function checkInputValid() {
        var isValid = true;

        var username = trim($username.val());
        if (username.length === 0) {
            $username.addClass('err');
            isValid = false;
        }
        else {
            $username.removeClass('err');
        }

        var password = $password.val();
        if (password.length === 0) {
            $password.addClass('err');
            isValid = false;
        }
        else {
            $password.removeClass('err');
        }

        return isValid;
    }

    function clearError() {
        $msgbox.html('');
        $msgbox.hide();
    }

    function showError(message) {
        $msgbox.show();
    }


    function init() {
        if ($innerMsg.html().length > 0) {
            showError();
        }
        else {
            clearError();
        }

        $loginForm.submit(function (e) {
            return doLogin();
        });

        $username.focus();
    }

    return {
        init: function () { init(); }
    };
})(jQuery);

login.init();