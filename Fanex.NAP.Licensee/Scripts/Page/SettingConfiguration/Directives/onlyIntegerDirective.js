/* jshint ignore:start */
var directiveModule = angular.module('settingConfiguration.directives', []);

directiveModule.directive("onlyinteger", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).numeric(
                {
                    negative: false,
                    decimal: true
                }
            );
        }
    };
    });
    /* jshint ignore:end */