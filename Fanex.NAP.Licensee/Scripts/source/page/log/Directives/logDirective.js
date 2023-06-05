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

            $(window).resize(function () {
                gridHeight = $('#gridId').height();
            });

            $('body').unbind().on('click', '.panel-setting', function (event) {
                event.preventDefault();
                $(this).nextAll('.content-setting').toggle();
                calculateGridHeight(gridHeight);
            });

            var count = 0;
            $('body').on('click', '.log-content', function (event) {
                event.preventDefault();

                if (count % 2 === 0) {
                    $('.content-setting').hide();
                } else {
                    $('.content-setting').show();
                }

                count++;
                calculateGridHeight(gridHeight);
            });
        }

        function calculateGridHeight(gridHeight) {
            if ($('.content-container').height() + $('.grid-pager').height() >= gridHeight) {
                $('#gridId').height(gridHeight);
                $('.grid-container').height(gridHeight - $('.grid-pager').height());
            } else {
                $('#gridId').height($('.content-container').height() + $('.grid-pager').height());
                $('.grid-container').height($('.content-container').height());
            }

            $('.grid-pager').css({ top: ($('.grid-container').height()) })
            $('.scrollbar-y-content').height($('.content-container').height() - $('.grid-pager').height());
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