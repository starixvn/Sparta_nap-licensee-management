"use strict";

angular.module('settingConfiguration.directives', []).directive('bsValidation', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            var bsType = attr.bsValidation;
            var validFn = function (value) {
                switch (bsType) {
                    case "MinBet":
                        return parseFloat(value) < parseFloat(scope.item.MaxBet);
                    case "MaxBet":
                        return parseFloat(value) > parseFloat(scope.item.MinBet) && parseFloat(value) < parseFloat(scope.item.MaxPerMatch);
                    case "MaxPerMatch":
                        var validMaxPerBall = (scope.item.MaxPerBall === undefined || parseFloat(value) < parseFloat(scope.item.MaxPerBall));

                        return (parseFloat(value) > parseFloat(scope.item.MaxBet)) && validMaxPerBall;
                    case "MaxPerBall":
                        return parseFloat(value) > parseFloat(scope.item.MaxPerMatch);
                    default:
                        return true;
                }
            };
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