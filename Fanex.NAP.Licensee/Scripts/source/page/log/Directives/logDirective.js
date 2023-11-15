(function () {
    'use strict';

    function fanexgrid() {
        var scopeOptions = {
            report: '=',
            options: '=',
        };

        function generateGrid(scope, newValue) {
            grid.setDefaultOptions(scope.options);

            if (scope.options.pagerOption !== undefined) {
                grid.setPaging(scope.options, newValue);
            }

            scope.options.bodyRows = grid.genGridRows(newValue.Data, scope.options);
            $("#gridId").empty().removeClass('hide').fanexGrid(scope.options);
        }

        function initEvent() {
            var gridHeight = $('#gridId').height();
            var isCollapse = false;

            $(window).resize(function () {
                calculateGridHeight(gridHeight);
            });

            $('body').unbind().on('click', '.panel-setting', function (event) {
                event.preventDefault();
                $(this).nextAll('.content-setting').toggle();
                calculateGridHeight(gridHeight);
            });

            $('body').on('click', '.log-content', function (event) {
                event.preventDefault();

                if (!isCollapse) {
                    $('.content-setting').hide();
                } else {
                    $('.content-setting').show();
                }

                isCollapse = !isCollapse;
                calculateGridHeight(gridHeight);
            });
        }

        function calculateGridHeight(gridHeight) {
            if ($('.content-container').height() + $('.grid-pager').height() >= gridHeight) {
                $('#gridId').height(gridHeight);
                $('.grid-container').height(gridHeight - $('.x-scrollbar').height() - $('.grid-pager').height());
            } else {
                $('#gridId').height($('.content-container').height() + $('.x-scrollbar').height() + $('.grid-pager').height());
                $('.grid-container').height($('.content-container').height());
            }

            $('.free-bottom-right').css({ top: $('.grid-container').height() });
            $('.x-scrollbar').css({ top: $('.grid-container').height() });

            $('.grid-pager').css({ top: ($('.grid-container').height() + $('.x-scrollbar').height()) })

            $('.y-scrollbar').height($('.grid-container').height() - $('.free-bottom-right').height());
            $('.scrollbar-y-content').height($('.content-container').height() - $('.free-bottom-right').height());

            if ($('.y-scrollbar').height() < $('.scrollbar-y-content').height()) {
                $('.y-scrollbar').css("overflow-y", "scroll");
            }
        }

        return {
            restrict: 'A',
            scope: scopeOptions,
            link: function (scope) {
                scope.$watch('report', function (newValue) {
                    if (newValue) {
                        generateGrid(scope, newValue);
                        initEvent();
                    }
                });
            }
        };
    }

    angular.module('logSettingsApp').directive('logsFanexgrid', fanexgrid);
}());