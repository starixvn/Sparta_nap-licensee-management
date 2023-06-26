
var grid = (function (undefined) {
    'use strict';

    function isDefined(value) {
        return value !== void (0);
    }

    function calculateColumnWidth(value) {
        return !value ? 0 : value.toString().length * 10;
    }

    function rebuildGridOptions(options, undefined) {
        if (!options.autoResizeColumn || !options.columns) {
            return;
        }

        var columns = options.columns;
        var numberColumns = columns.length;

        for (var i = 0; i < numberColumns; i++) {
            var column = columns[i];

            if (!isDefined(column.CanResize)) {
                column.CanResize = true;

                if (!column.CalResizeFunction) {
                    column.CalResizeFunction = calculateColumnWidth;
                }
            }
        }
    }

    function genGridColumn(colIndex, rowIndex, rowIndexValue, record, columns, indexNumberColumn, tdClassFunction) {
        var column = columns[colIndex];
        var columnName = column.Name;
        var columnFormatter = column.Formatter;

        return {
            Name: columnName,
            Value: (indexNumberColumn === colIndex) ? rowIndexValue : record[columnName],
            CustomCellRender: function (cell, cellFormated) {
                if (columnFormatter) {
                    return columnFormatter(rowIndex, record, cell, cellFormated);
                } else if (column.HtmlEncode) {
                    return encoder.htmlEncode(cellFormated);
                } else {
                    return cellFormated;
                }
            },
            TdClass: tdClassFunction ? tdClassFunction(rowIndex, columnName, record) : undefined
        };
    }

    function genGridRows(list, options) {
        rebuildGridOptions(options);

        var columns = options.columns;
        var cssClassFunction = options.cssClassFunction;
        var tdClassFunction = options.tdClassFunction;
        var rowHeight = options.RowHeight;
        var indexNumberColumn = options.indexNumberColumn;

        var bodyRows = [];
        var len = list.length;
        var rowIndex = 0;
        var rowIndexValue = rowIndex;
        var pagerOption = options.pagerOption;

        if (pagerOption) {
            rowIndexValue = pagerOption.itemsPerPage * pagerOption.currentPage + 1;
        }

        for (var i = 0; i < len; i++) {
            var record = list[i];
            var dataColumns = [];

            for (var j = 0; j < columns.length; j++) {
                dataColumns.push(genGridColumn(j, rowIndex, rowIndexValue, record, columns, indexNumberColumn, tdClassFunction));
            }

            bodyRows.push({
                Columns: dataColumns,
                CssClass: cssClassFunction ? cssClassFunction(rowIndex, record) : undefined,
                RowHeight: rowHeight ? rowHeight(rowIndex, record) : undefined
            });

            rowIndex++;
            rowIndexValue++;
        }

        return bodyRows;
    }

    function setDefaultOptions(options) {
        options.showHighlightRow = false;
        options.bodyRowHeight = 21;
        options.autoResizeColumn = true;
    }

    function setPaging(options, newOptions) {
        options.showPager = options.showPager === undefined ? true : options.showPager;
        options.customPager = true;
        options.pagerOption = options.pagerOption || {};

        var pagerOption = options.pagerOption;
        pagerOption.currentPage = newOptions.PageIndex;
        pagerOption.itemsPerPage = newOptions.PageSize;
        pagerOption.totalItem = newOptions.TotalItem;
        pagerOption.itemsPerPageArray = [10, 20, 50, 100, 500];
    }

    return {
        setPaging: setPaging,
        setDefaultOptions: setDefaultOptions,
        genGridRows: genGridRows
    };

})();