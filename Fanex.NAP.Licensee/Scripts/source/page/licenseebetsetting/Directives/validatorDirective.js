'use strict';

angular.module('licenseeBetSetting.directives', []).directive('bsValidation', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            oldValue: '='
        },
        link: function (scope, elem, attrs, ngModel) {

            function formatNumber(value) {
                if (value === undefined) {
                    return '';
                }
                var transformedText = value.replace(/\D/g, '');
                var number = transformedText.replace(/[\,\.]/g, '');

                return number;
            }

            var validFn = function (value) {
                if (value === '') {
                    return false;
                }
                var min = parseInt(formatNumber(attrs['min']));
                var max = parseInt(formatNumber(attrs['max']));
                var uplinemin = parseInt(formatNumber(attrs['uplinemin']));
                var uplinemax = parseInt(formatNumber(attrs['uplinemax']));

                var numValue = parseInt(formatNumber(value));
                return numValue >= min
                    && (numValue <= max || attrs['max'] === '*')
                    && (numValue >= uplinemin || attrs['uplinemin'] === '*')
                    && (numValue <= uplinemax || attrs['uplinemax'] === '*');
            };

            function validateField(oldData, newData) {
                var valid = validFn(newData);
                ngModel.$setValidity('bsValidation', valid);

                var oldValue = parseInt(formatNumber(oldData));
                var newValue = parseInt(formatNumber(newData));

                if (oldValue !== newValue || !valid) {
                    ngModel.$setDirty(true);
                } else {
                    ngModel.$setPristine(true);
                }
            }

            var setValidation = function (newValue) {
                validateField(scope.oldValue, $(elem).val());
                return newValue;
            }

            attrs.$observe('min', setValidation);

            attrs.$observe('max', setValidation);

            attrs.$observe('uplinemin', setValidation);

            attrs.$observe('uplinemax', setValidation);

            ngModel.$parsers.unshift(function (inputValue) {
                if (inputValue === '') {
                    return '';
                }

                var number = formatNumber(inputValue);
                var el = elem[0];

                var format = $filter('number')(number);

                if (format !== inputValue) {
                    var start = el.selectionStart + 1;
                    var end = el.selectionEnd + format.length - inputValue.length;

                    ngModel.$setViewValue(format);
                    ngModel.$render();
                    el.setSelectionRange(start, end);
                }

                return number;
            });

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                validateField(scope.oldValue, value);

                return value;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {

                validateField(scope.oldValue, value);

                if (value === '') {
                    return '';
                }

                var number = formatNumber(value);

                return $filter('number')(number);
            });
        }
    };
}]);