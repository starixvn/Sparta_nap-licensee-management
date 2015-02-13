var directiveModule = angular.module('settingConfiguration.directives', []);

directiveModule.directive("onlyInteger", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).numeric(
                {
                    negative: false,
                    decimal: false
                }
            );
        }
    };
});