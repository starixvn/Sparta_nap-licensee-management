'use strict';
/* global CryptoJS */
/* jshint unused: vars */
var login = (function () {
    var $loginForm = $('#frmLogin');
    var $username = $('#username');
    var $password = $('#password');
    var $token = $('#loginToken');
    var $msgbox = $('#inner-msg');

    function trim(string) {
        return string.replace(/^\s+|\s+$/g, '');
    }

    function encryptPassword(password) {
        var encryptPwd = CryptoJS.CfsEnCode(password);
        var token = $token.val();
        var hashPwd = CryptoJS.SHA256(encryptPwd + token);

        // prepare to Submit.
        $password.val(hashPwd);
    }

    function doLogin() {
        clearError();
        var username = trim($username.val());
        if (username.length === 0) {
            showError(usersResources.UsernameOrPasswordEmptyError);
            return false;
        }

        var password = $password.val();
        if (password.length === 0) {
            showError(usersResources.UsernameOrPasswordEmptyError);
            return false;
        }

        encryptPassword(password);
        //document.forms[0].submit();

        return true;
    }

    function clearError() {
        $msgbox.addClass('hide').html('');
    }

    function showError(message) {
        $msgbox.removeClass('hide').html(message);
    }


    function init() {
        $loginForm.submit(function (e) {
            //e.preventDefault();
            return doLogin();
        });

        $username.focus();
    }

    return {
        init: function () { init(); }
    };
})(jQuery);

login.init();