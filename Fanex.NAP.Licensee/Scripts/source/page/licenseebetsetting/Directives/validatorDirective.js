"use strict";

angular.module('licenseeBetSetting.directives', []).directive('bsValidation', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            agentId: "=",
            isDbsPage: "="
        },
        link: function (scope, elem, attrs, ngModel) {

            function formatNumber(value) {
                var transformedText = value.replace(/\D/g, '');
                var number = transformedText.replace(/[\,\.]/g, '');

                return number;
            }

            var validFn = function (value) {
                if (value === "") {
                    return false;
                }
                var min = parseInt(formatNumber(attrs['min']));
                var max = parseInt(formatNumber(attrs['max']));
                var uplinemin = parseInt(formatNumber(attrs['uplinemin']));
                var uplinemax = parseInt(formatNumber(attrs['uplinemax']));

                var numValue = parseInt(formatNumber(value));
                return numValue >= min
                    && (numValue <= max || attrs['max'] === "*")
                    && (numValue >= uplinemin || attrs['uplinemin'] === "*")
                    && (numValue <= uplinemax || attrs['uplinemax'] === "*");
            };

            var setValidation = function (newValue) {
                var valid = validFn($(elem).val());

                ngModel.$setValidity('bsValidation', valid);

                if (!valid) {
                    ngModel.$setDirty(true);
                }

                return newValue;
            }

            attrs.$observe('min', setValidation);

            attrs.$observe('max', setValidation);

            attrs.$observe('uplinemin', setValidation);

            attrs.$observe('uplinemax', setValidation);

            ngModel.$parsers.unshift(function (inputValue) {
                if (inputValue === "") {
                    return "";
                }

                var number = formatNumber(inputValue);
                var el = elem[0];

                var formartNumber = $filter('number')(number);

                if (formartNumber !== inputValue) {
                    var start = el.selectionStart + 1;
                    var end = el.selectionEnd + formartNumber.length - inputValue.length;

                    ngModel.$setViewValue(formartNumber);
                    ngModel.$render();
                    el.setSelectionRange(start, end);
                }

                return number;
            });

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);

                return value;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {
                if (scope.agentId === 0 && !scope.isDbsPage) {
                    return "";
                }
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);

                if (value === "") {
                    return "";
                }

                var number = formatNumber(value);

                return $filter('number')(number);
            });
        }
    };
}]);