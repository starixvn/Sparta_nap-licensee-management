"use strict";
/*global site */
/*exported ManageLicensee*/

var ManageLicensee = (function () {
    var me = {};
    var specialLicenseeFunctionsView = function () {
        $("#special-licensee-function-selector").click(function () {
            var checked = $("#special-licensee-function-content").css('display') === 'none';
            if (checked) {
                $("#special-licensee-function-content").show();
                $("#popup-button").html("▲");
            } else {
                $("#special-licensee-function-content").hide();
                $("#popup-button").html("▼");
            }
        });
    };
    var specialFunctionSelected = function () {
        $("#special-licensee-function-area").on("mouseleave", function () {
            $("#special-licensee-function-content").hide();
            $("#popup-button").html("▼");
        });
    };
    var setGenerateButtonStatus = function (disable) {
        if (disable) {
            $("#generate").attr("disabled", "disabled");
        } else {
            $("#generate").removeAttr("disabled");
        }
    };
    var invokeLoadingMsg = function (visible) {
        if (visible) {
            if ($("#loadingMsgBox").is(":hidden")) {
                $("#loadingMsgBox").removeClass("hidden");
                setGenerateButtonStatus(true);
            }
        }
        else {
            $("#loadingMsgBox").addClass("hidden");
            setGenerateButtonStatus(false);
        }
    };
    var getAllParams = function () {
        var specialFunctions = '';
        var checked = $("#special-licensee-function").is(':checked');
        if (checked) {
            var checkedList = $("#special-licensee-function-content input[type='checkbox']:checked");
            for (var i = 0; i < checkedList.length; i++) {
                var functionId = $(checkedList[i]).val();
                specialFunctions += specialFunctions === '' ? functionId : "," + functionId;
            }
        }

        var products = '';
        var prdCheckedList = $("#product-filter input[type='checkbox']:checked");
        for (var j = 0; j < prdCheckedList.length; j++) {
            var product = $(prdCheckedList[j]).val();
            products += products === '' ? product : "," + product;
        }

        var params = {
            LicenseeTypeId: $("#licensee-type-filter").val(),
            LicenseeName: $("#licensee-name-filter").val(),
            ProductCode: products,
            SpecialFunc: specialFunctions
        };

        return params;
    };
    var confirmGoToManagePage = function (licenseeName) {
        $('<div></div>').appendTo('body')
            .html('<div><h6>Licensee <span style="color:#0000ff;font-weight:bold">' + licenseeName + '</span> has been created.</h6><br /><h6>Do you want to go to "Licensee Management" page?</h6></div>')
            .dialog({
                modal: true,
                title: 'Confirm Create Licensee',
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Yes: function () {
                        alert("Page is being builded!!!");
                        $(this).dialog("close");
                    },
                    No: function () {
                        document.location.href = document.location.href;
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });
    };
    var createLicenseeAjax = function () {
        site.invokeErrMsg(false);
        var params = getAllParams();
        if (params.ProductCode === '') {
            $("#errMsgBox .txt-content").html('Please select at least one product!');
            site.invokeErrMsg(true);
            return false;
        } else {
            $.ajax({
                type: "POST",
                url: window.rootUrl + "LicenseeManagement/Create",
                data: JSON.stringify(params),
                datatype: "json",
                contentType: "application/json; charset=utf-8",
                cache: false,
                beforeSend: function () {
                    invokeLoadingMsg(true);
                },
                success: function (result) {
                    invokeLoadingMsg(false);
                    if (result !== 'OK') {
                        $("#errMsgBox .txt-content").html(result);
                        site.invokeErrMsg(true);
                    } else {
                        confirmGoToManagePage(params.LicenseeName);
                    }

                    return false;
                },
                error: function () {
                    invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                }
            });
        }

        return false;
    };
    var submitForm = function () {
        $("#btn-create-licensee").click(function () {
            $('<div></div>').appendTo('body')
                .html('<div><h6>Are you sure you want to create licensee <span style="color:#0000ff;font-weight:bold">' + $("#licensee-name-filter").val() + '</span> ?</h6></div>')
                .dialog({
                    modal: true,
                    title: 'Confirm Create Licensee',
                    zIndex: 10000,
                    autoOpen: true,
                    width: 'auto',
                    resizable: false,
                    buttons: {
                        No: function () {
                            $(this).dialog("close");
                        },
                        Yes: function () {
                            createLicenseeAjax();
                            $(this).dialog("close");
                        }
                    },
                    close: function (event, ui) {
                        $(this).remove();
                    }
                });
        });

        return false;
    };
    me.initialize = function () {
        specialLicenseeFunctionsView();
        specialFunctionSelected();
        submitForm();
    };

    return me;
})();