"use strict";

angular.module('settingConfiguration.directives', []).directive('bsValidation', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ngModel) {

            var validFn = function (value) {
                var min = parseInt(attrs['min']);
                var max = parseInt(attrs['max']);

                var numValue = parseInt(value);
                return numValue >= min && (numValue <= max || attrs['max'] === "*");
            };

            attrs.$observe('min', function (newValue) {
                var valid = validFn($(elem).val());

                ngModel.$setValidity('bsValidation', valid);

                if (!valid) {
                    ngModel.$setDirty(true);

                }
                return newValue;

            });

            ngModel.$parsers.push(function (inputValue) {
                var transformedText = inputValue.replace(/\D/g, '');
                if (transformedText !== inputValue) {
                    ngModel.$setViewValue(transformedText);
                    ngModel.$render();

                    return transformedText;
                }

                return inputValue;
            });

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);
                return value;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {
                var valid = validFn(value);
                ngModel.$setValidity('bsValidation', valid);

                return value;
            });
        }
    };
});