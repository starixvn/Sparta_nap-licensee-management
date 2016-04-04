/// <reference path="/@JSense.js" />
/* File Created: December 4, 2013 */
var fanexGridLanguage = {};
fanexGridLanguage['en-US'] = {
    noData: 'There is no data',
    pageSize: 'Page size',
    goToPage: 'Go To Page',
    pagingText: 'Displaying <b>{0}</b> to <b>{1}</b> of <b>{2}</b> item(s)'
};

var fanexGridCurrentLanguage = fanexGridLanguage['en-US'];
﻿/// <reference path="/@JSense.js" />
// --------------------------------------------------------------------------
// <copyright file="Fanex.Grid.js" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// Revision:
//          + 01/10/2014: Auto re-size column.
//          + 01/21/2014: Supported Sort with SortType for each column.
//          + 01/22/2014: Fixed bug Auto reset scroller when resize grid.
//          + 02/06/2014: Customize Render footer when auto paging + Update initialize footer.
//          + 02/06/2014: Customize Render footer when auto paging + Update initialize footer.
//          + 02/27/2014: Update show "..." when auto truncate.
//          + 03/19/2014: Support Time Zone Config
//          + 04/08/2014: Support auto resize to full-screen width
//          + 04/11/2014: Remove class "Container"
//          + 04/16/2014: Auto fix header height, fix bug collapse/expand
//          + 06/20/2014: Fix bug auto fix row height.
// </copyright>
// --------------------------------------------------------------------------
/*jshint maxdepth:false, maxstatements:false*/
/*global fanexGridLanguage, moment,numeral*/

var fanexGridCurrentLanguage = fanexGridCurrentLanguage || {};

(function ($) {
    'use strict';

    //// Method expose for user use
    var methods =
    {
        createFanexGrid: function (opts) {
            if (opts.showColumnsShowHide === false || opts.enableHiddenColumns === false) {
                opts.enableHiddenColumns = false;
                opts.hiddenColumns = opts.hiddenColumns || [];
                opts.hiddenColumns = opts.hiddenColumns.concat(opts.columnsNeedHide || []);
                opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, opts.hiddenColumns);
            }
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.RenderGrid();
                return fanexGrid.GetjQueryInstance();
            });
        },
        reRender: function (opts) {
            if (opts.showColumnsShowHide === false || opts.enableHiddenColumns === false) {
                opts.enableHiddenColumns = false;
                opts.hiddenColumns = opts.hiddenColumns || [];
                opts.hiddenColumns = opts.hiddenColumns.concat(opts.columnsNeedHide);
                opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, opts.hiddenColumns);
            }
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.RenderGrid();
                return fanexGrid.GetjQueryInstance();
            });
        },
        reRenderBodyAfterSort: function (opts, sortColumnName, sortDirection) {
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.ReRenderBodyAfterSort(sortColumnName, sortDirection);
                if (opts.showPager === true) {
                    fanexGrid.RenderPager();
                }
                return fanexGrid.GetjQueryInstance();
            });
        },
        showColumns: function (opts, columnsNeedShow) {
            opts.enableHiddenColumns = true;
            opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, columnsNeedShow);
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                opts.pagerOption = Fanex.Grid.List[fanexGrid.tableContentId].pagerOption;
                Fanex.Grid.Helper.UpdateSortInforAfterShowHideColumns(opts, Fanex.Grid.List[fanexGrid.tableContentId].sortOption);
                fanexGrid.RenderGrid();
                return fanexGrid.GetjQueryInstance();
            });
        },
        hideColumns: function (opts, hiddenColumns) {
            opts.enableHiddenColumns = false;
            opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, hiddenColumns);
            opts.hiddenColumns = hiddenColumns;
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                opts.pagerOption = Fanex.Grid.List[fanexGrid.tableContentId].pagerOption;
                Fanex.Grid.Helper.UpdateSortInforAfterShowHideColumns(opts, Fanex.Grid.List[fanexGrid.tableContentId].sortOption);
                //fanexGrid.RenderGrid();
                fanexGrid.RenderShowHideColumns(false);
                return fanexGrid.GetjQueryInstance();
            });
        },
        resizeGrid: function () {
            return this.each(function () {
                var $this = $(this);
                var currentContentId = 'tblContent_' + $this.attr('id');
                var gridOptions = Fanex.Grid.List[currentContentId].gridOptions;
                gridOptions.isResetScroller = false;
                $this.gridScroller(Fanex.Grid.List[currentContentId].gridOptions);
                return $this;
            });
        },
        resizeHeight: function (gridHeight) {
            return this.each(function () {
                var $this = $(this);
                if (gridHeight) {
                    var currentContentId = 'tblContent_' + $this.attr('id');
                    var currentOptions = Fanex.Grid.List[currentContentId].gridOptions;
                    currentOptions.gridHeight = gridHeight;
                    $this.gridScroller(currentOptions);
                }
                return $this;
            });
        },
        appendBody: function (opts, rows) {
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.AppendBodyRows(rows);
                $(this).fanexGrid('resizeGrid');
            });
        },
        getCurrentPage: function () {
        },
        getColumnsIdentify: function (opts) {
            return Fanex.Grid.Helper.GetColumnsHastable(opts.columns);
        }
    };

    //// Plugin
    $.fn.fanexGrid = function (options) {
        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof options === 'object' || !options) {
            return methods.createFanexGrid.apply(this, arguments);
        }
        else {
            throw 'Options cannot be null';
        }
    };

    //// Default Options
    $.fn.fanexGrid.defaults =
    {
        customizeHeader: false,
        headerRows: [],
        columns: [],
        bodyRows: [],
        numberOfFrozenColumn: 0,
        showFooter: false,
        footerRows: [],
        showTitle: false,
        headerColumnHeight: 25,
        bodyRowHeight: 21,
        footerRowHeight: 21,
        titleInfo:
        {
            text: "",
            hideWhenNoData: true,
            showExcelButton: false,
            exportExcelFunction: null,
            showBackButton: false,
            backFunction: null,
            showSendMailButton: false,
            sendMailFunction: null,
            showCollapseExpandButton: false,
            customButtons: '',
            showButtonsWhenNoData: false
        },
        showPager: false,
        pagerOption:
        {
            itemsPerPage: 100,
            maxItemsPerPage: 500,
            currentPage: 1,
            totalItem: 0,
            startPerPage: 100,
            pageStep: 50,
            afterPagedFunction: null,
            showDetail: true
        },
        showTree: false,
        gridExpandHeight: 150,
        showNoDataOnFrozen: false,
        showColumnsShowHide: true,
        enableHiddenColumns: true,
        showDistinctRow: true,
        showHighlightRow: true,
        highlightFrozenWidth: 1,
        showNumberColumn: false,
        marginRight: 5,
        allowTruncate: false,
        columnsNeedHide: [],
        hiddenColumns: [],
        sortOption:
        {
            customGridSort: null,
            serverSortFunction: null,
            afterGridSorted: null,
            beforeGridSorted: null
        },
        hideYBackGroundScroller: false,
        bottomBorderWidth: 1,
        treeParentPaddingLeft: 20,
        isResetScroller: false,
        fullHeight: true,
        gridHeight: 400,
        gridWidth: 0,
        noDataText: "There is no data",
        language: 'en-US',
        autoFixFrozenRowHeight: false,
        autoResizeColumn: false,
        pixelsPerCharacter: 0,
        calTextWidthWithFontSize: true,
        timeZone: '',
        scrollWidth: 24
    };

    var Fanex = Fanex || {};

    Fanex.Grid = function (grid, options) {
        this.$grid = $(grid);
        //// Calculate fontsize for hide cell value if cell value exceed
        try {
            this.currentFontSize = parseInt(this.$grid.css('font-size').replace('px', ''));
        }
        catch (e) {
            this.currentFontSize = 12;
        }
        this.currentFontSize -= 4;
        if (options.pixelsPerCharacter === 0) {
            options.pixelsPerCharacter = this.currentFontSize;
        }
        this.Options = options.autoResizeColumn ? Fanex.Grid.Helper.ComputeResizeColumn(this.$grid, options) : options;

        this.gridObject = grid;
        this.gridId = this.$grid.attr('id');
        this.tableContentId = 'tblContent_' + this.gridId;
        this.frozenContentId = 'frozenContent_' + this.gridId;
        this.headerColumnsCloneFromOptionColumns = Fanex.Grid.Helper.CreateHeaderColumnsFromOptionsColumn(options.columns.slice(0));

        if (fanexGridLanguage[options.language] == null) {
            alert('Cannot load language: ' + options.language);
        }
        else {
            fanexGridCurrentLanguage = fanexGridLanguage[options.language];
        }


        //// Create a hashtable contain columns information for esay retrieve data
        this.columnsHastable = Fanex.Grid.Helper.GetColumnsHastable(options.columns);
        //// Create columnswidth array
        this.columnsWidth = Fanex.Grid.Helper.GetArrayWidth(options.columns, options.enableHiddenColumns, false);
        this.columnsForComputingWidth = Fanex.Grid.Helper.GetArrayWidth(options.columns, options.enableHiddenColumns, true);
        if (this.Options.customPager !== true) {
            this.Options.pagerOption.totalItem = this.Options.bodyRows.length;
        }
        this.gridOptions = null;
        this.frozenColsName = [];
        //// If frozen, then create an array contain frozen columns name
        if (options.numberOfFrozenColumn > 0) {
            //var frozenColumnNumber = isValid(options.numberOfFrozenColumnSaved) ? options.numberOfFrozenColumnSaved : options.numberOfFrozenColumn;
            for (var colIndex = 0; colIndex < options.numberOfFrozenColumn; colIndex++) {
                this.frozenColsName.push(options.columns[colIndex].Name);
            }
            //// If highlight frozen then set width for hightligth
            if (options.highlightFrozenWidth > 1) {
                var lastFrozenCol = options.columns[options.numberOfFrozenColumn - 1];
                if (isValid(lastFrozenCol.TrClass)) {
                    lastFrozenCol.TdClass += " border-right-highlight ";
                }
                else {
                    lastFrozenCol.TdClass = "border-right-highlight ";
                }
                options.highlightFrozenWidth--;
            }
        }
    };

    Fanex.Grid.prototype =
    {
        RenderGrid: function () {
            if (typeof (fanexGridLanguage) === 'undefined') {
                return;
            }
            var me = this;
            var options = me.Options;
            var footer = '';
            if (options.showFooter && options.bodyRows.length > 0) {
                if (typeof (options.pagerOption.customRenderFooter) === 'function') {
                    var startIndex = (options.pagerOption.currentPage * options.pagerOption.itemsPerPage);
                    var endIndex = ((options.pagerOption.currentPage + 1) * options.pagerOption.itemsPerPage);
                    var currentBodyRows = options.bodyRows.slice(startIndex, endIndex);
                    me.Options.footerRows = options.pagerOption.customRenderFooter(
                                                                                currentBodyRows,
                                                                                options.pagerOption.currentPage,
                                                                                options.pagerOption.itemsPerPage);
                }

                footer = me.RenderFooter();
            }
            //// Render Table Main Frame
            var html = me.RenderBody(me.RenderHeader()) + footer;
            if (me.gridObject) {
                me.gridObject.innerHTML = html;
            }
            //me.$grid.empty().html(html);
            me.$grid.before(me.RenderTitle());
            //me.$grid.parent().css("float","left");
            me.RegisterMouseHoverEvent();
            me.Initialize();
            //// Render Title
            //
        },
        RenderShowHideColumns: function (isShow) {
            var me = this;
            var options = me.Options;
            var currentMainBodyHtml = me.$grid.find('#' + me.tableContentId + '> tbody').html();
            var currentFrozenBodyHeader = me.$grid.find('#' + me.frozenContentId + '> tbody').html();
            var bodyHtml = me.RenderHeader() + me.RenderCommonHeader('mainbody');
            var footer = (options.showFooter && options.bodyRows.length > 0 ? me.RenderFooter() : "");
            var bodyHtmlTemp = '',
                currentCol;
            // Fixbug for replace $' string
            if (options.numberOfFrozenColumn > 0) {
                bodyHtmlTemp = bodyHtml.split('{$}frozenBody');
                if (bodyHtmlTemp.length === 2) {
                    bodyHtml = bodyHtmlTemp[0] + currentFrozenBodyHeader + bodyHtmlTemp[1];
                }
            }
            bodyHtmlTemp = bodyHtml.split('{$}_');
            if (bodyHtmlTemp.length === 2) {
                bodyHtml = bodyHtmlTemp[0] + currentMainBodyHtml + bodyHtmlTemp[1];
            }

            bodyHtml += footer;

            me.$grid.empty(); //.html(bodyHtml);
            if (me.gridObject) {
                me.gridObject.innerHTML = bodyHtml;
            }

            var selector = [];
            var columnsShowLength = options.columns.length;
            for (var colIndex = 0; colIndex < columnsShowLength; colIndex++) {
                //selector.push('.free-grid-td-' + colIndex);
                me.$grid.find('.free-grid-td-' + colIndex).removeClass("grid-show-hide-column");
            }
            //me.$grid.find(selector.join(',')).show();

            if (!isShow) {
                var columnsHideLength = options.hiddenColumns.length,
                    nhIndex;
                selector = [];
                try {
                    for (var colIndex1 = 0; colIndex1 < columnsHideLength; colIndex1++) {
                        currentCol = options.hiddenColumns[colIndex1];
                        //selector.push('.free-grid-td-' + currentCol);
                        //me.$grid.find('.free-grid-td-' + currentCol).addClass("grid-show-hide-column");
                        me.$grid.find('.free-cell, .row_header_wrapper, .col_header, .grid-container')
                        .find('.free-grid-td-' + currentCol)
                        .addClass("grid-show-hide-column");
                    }

                    if (options.showFooter) {
                        //                        var footerLength = options.footerRows[0].Columns.length;
                        //                        var needHideCols = options.hiddenColumns.slice(0);
                        //                        var currentColIndex = 0;
                        //                        for (var ftColIndex = 0; ftColIndex < footerLength; ftColIndex++) {
                        //                            currentCol = options.footerRows[0].Columns[ftColIndex];
                        //                            if (currentCol.MergeColNumber) {
                        //                                var removeArray = [];
                        //                                for (nhIndex = 0; nhIndex < needHideCols.length; nhIndex++) {
                        //                                    if (ftColIndex + currentCol.MergeColNumber >= ftColIndex + needHideCols[nhIndex]) {
                        //                                        removeArray.push(nhIndex);
                        //                                    }
                        //                                    else if (ftColIndex < needHideCols[nhIndex]) {
                        //                                        needHideCols[nhIndex] -= currentCol.MergeColNumber - 1;
                        //                                    }
                        //                                }

                        //                                for (var rmIndex = removeArray.length - 1; rmIndex >= 0; rmIndex--) {
                        //                                    needHideCols.splice(removeArray[rmIndex], 1);
                        //                                }

                        //                                //currentColIndex += currentCol.MergeColNumber;
                        //                            }
                        //                            // currentColIndex++;
                        //                        }
                        var needHideCols = options.hiddenColumns.slice(0);
                        for (nhIndex = 0; nhIndex < needHideCols.length; nhIndex++) {
                            currentCol = needHideCols[nhIndex];
                            me.$grid.find('.row_footer, .col_footer').find('.free-grid-td-' + currentCol).addClass("grid-show-hide-column");
                        }
                    }
                }
                catch (e) {
                    window.console.log(e);
                }
                //me.$grid.find(selector.join(',')).hide();
            }

            me.RegisterMouseHoverEvent();
            me.Initialize();
        },
        ReRenderBodyAfterSort: function (sortColumnName, sortDirection) {
            var me = this;
            me.RenderBody('', true);
            me.gridOptions = Fanex.Grid.List[me.tableContentId].gridOptions;
            me.gridOptions.isResetScroller = false;
            me.RegisterMouseHoverEvent();
            me.AutoResizeRowHeight();
            $(me.$grid).gridScroller(me.gridOptions);
            //// Save Current Sor
            Fanex.Grid.List[me.tableContentId].sortOption =
            {
                SortColumnName: sortColumnName,
                SortDirection: sortDirection
            };
        },
        AppendBodyRows: function (rows) {
            var me = this;
            var options = me.Options;
            var rowLength = rows.length,
                currentRow;
            if (rowLength > 0) {
                var currentFrozenRows = (options.numberOfFrozenColumn > 0) ?
                                        Fanex.Grid.Helper.CreateRowsForFrozenColumn(rows, options.numberOfFrozenColumn, me.frozenColsName) :
                                        [];
                var frozenBodyLength = currentFrozenRows.length;
                var bodyRowsHtml = [], bodyFrozenHtml = [];
                var currentPageStartIndex = options.bodyRows.length;

                //// Render Frozen Row and Main Row at the same time
                for (var rowIndex = 0; rowIndex < frozenBodyLength; rowIndex++) {
                    currentRow = rows[rowIndex];
                    var currentFrozenRow = currentFrozenRows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                    bodyFrozenHtml.push(me.RenderFrozenRow(currentFrozenRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }

                //// If MainRow still has item, then continue render
                for (rowIndex = frozenBodyLength; rowIndex < rowLength; rowIndex++) {
                    currentRow = rows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }

                //// Update Data
                me.$grid.find('#' + me.tableContentId + '> tbody').append(bodyRowsHtml.join(''));
                me.$grid.find('#' + me.frozenContentId + '> tbody').append(bodyFrozenHtml.join(''));
            }
        },
        GetjQueryInstance: function () {
            return this.$grid;
        },
        Initialize: function () {
            var me = this;
            var options = this.Options;
            var numberOfFrozenColumnNew = (options.enableHiddenColumns === false ?
                                            Fanex.Grid.Helper.ComputeNewFrozenColumn(options.hiddenColumns, options.numberOfFrozenColumn) :
                                            options.numberOfFrozenColumn);
            //// Render Grid Scroller
            me.gridOptions =
            {
                tblContentId: me.tableContentId,
                column: me.columnsWidth,
                gridHeight: options.fullHeight ? options.gridExpandHeight : options.gridHeight,
                gridWidth: options.gridWidth,
                numberFreezeCol: numberOfFrozenColumnNew,
                highlightFrozenWidth: options.highlightFrozenWidth,
                heightScrollYAdd: 0,
                marginRight: options.marginRight,
                hideYBackGroundScroller: options.hideYBackGroundScroller,
                bottomBorderWidth: options.bottomBorderWidth,
                isResetScroller: options.isResetScroller,
                fullHeight: options.fullHeight
            };
            $(me.$grid).initGrid({
                isShowPager: (options.showPager && (options.bodyRows.length > 0))
            }).gridScroller(me.gridOptions);

            //// Render Pager
            if (options.showPager === true) {
                me.RenderPager();
                Fanex.Grid.List[me.tableContentId].pagerOption = options.pagerOption;
            }
            me.RegisterEvents();
            me.AutoResizeRowHeight();

        },
        RenderTitle: function () {
            var me = this;
            var options = me.Options;
            var titleId = me.gridId + '-grid-title';
            if (options.showTitle === false) {
                return '';
            }
            else {
                me.$grid.parent().find('#' + titleId).remove();
                // style="width:' + me.$grid.width() + 'px"
                var titleHtml = [];
                titleHtml.push('<div id="' + me.gridId + '-grid-title' + '" class="grid-title display-none"><div class="grid-title-label" id="reporttile">');
                titleHtml.push(options.titleInfo.text);
                titleHtml.push('</div>');
                titleHtml.push('<div class="grid-toolbox">');
                if (options.titleInfo.showBackButton === true) {
                    titleHtml.push('<input id="btnBack' + me.gridId + '" class="btnBack" type="button" title="Back" value="" name="btnBack" />');
                }
                if (options.bodyRows.length > 0 || options.titleInfo.showButtonsWhenNoData === true) {
                    if (options.titleInfo.customButtons !== '') {
                        titleHtml.push(options.titleInfo.customButtons);
                    }
                    if (options.titleInfo.showCollapseExpandButton === true) {
                        titleHtml.push('<input class="btExpand expanded" id="btnCollapseExpand' +
                                        me.gridId +
                                        '" type="button" value="" title="Collapse/Expand" />');
                    }
                    if (options.titleInfo.showExcelButton === true) {
                        titleHtml.push('<input type="button" id="btnExport' + me.gridId + '" class="btnExcel" title="Export to Excel" />');
                    }
                    if (options.titleInfo.showSendMailButton === true) {
                        titleHtml.push('<input id="btnSendMail' + me.gridId + '" class="btnSendMail" type="button" title="Send Mail" />');
                    }
                }
                titleHtml.push('</div></div>');

                return titleHtml.join('');
            }
        },
        RenderHeader: function () {
            var me = this;
            var options = this.Options;
            var headerHtml = [];

            //// Clone and Add last row of Group Header
            if (options.customizeHeader) {
                this.Options.cloneGroupHeaderRows = options.groupHeaderRows.slice(0);
                this.Options.cloneGroupHeaderRows.push({
                    Columns: me.headerColumnsCloneFromOptionColumns.slice(0)
                });
            }

            //// If there are any item of header column
            var columnLength = options.columns.length;
            if (columnLength > 0) {
                if (options.numberOfFrozenColumn > 0) {
                    headerHtml.push(me.RenderCommonHeader('frozenheader').replace('{$}_', ''));
                    headerHtml.push(me.RenderCommonHeader('frozenbody'));
                }
                headerHtml.push(me.RenderCommonHeader('mainheader').replace('{$}_', ''));
            }

            return headerHtml.join('');
        },
        RenderCommonHeader: function (type) {
            var me = this;
            var options = this.Options;
            var divHeaderClass = '';
            var divContainerClass = '';
            var tableClass = '';
            var hasId = false;
            var tableContainId = me.tableContentId;
            var columnLength = me.headerColumnsCloneFromOptionColumns.length;
            var replaceMark = '_';

            // Grid Frame
            //////////////////////////////////
            // frozen Header //  main header//
            //////////////////////////////////
            // frozen body   // main body   //
            //////////////////////////////////
            switch (type) {
                case 'frozenheader':
                    divContainerClass = 'free-cell free-top-left';
                    tableClass = 'grid-fixed-table free-cell-top-left';
                    columnLength = options.numberOfFrozenColumn;
                    break;
                case 'frozenbody':
                    divHeaderClass = 'row_header_wrapper';
                    divContainerClass = 'row_header row-headers-background';
                    tableClass = 'grid-fixed-table row_header_content';
                    columnLength = options.numberOfFrozenColumn;
                    hasId = true;
                    tableContainId = me.frozenContentId;
                    replaceMark = 'frozenBody';
                    break;
                case 'mainheader':
                    divHeaderClass = 'col_header row-headers-background scroll-y';
                    divContainerClass = 'header-container';
                    tableClass = 'grid-fixed-table col_header_content';
                    break;
                case 'mainbody':
                    divHeaderClass = 'grid-container';
                    divContainerClass = 'content-container';
                    tableClass = 'grid-fixed-table col_body_content';
                    hasId = true;
                    break;
            }

            var headerHtml = [],
                trsHeader = [],
                cellInfo,
                colIndex,
                currentCol,
                customSpan;
            //// Build Header
            if (divHeaderClass !== '') {
                headerHtml.push('<div class="' + divHeaderClass + '">');
            }
            headerHtml.push('<div class="' + divContainerClass + '">');
            headerHtml.push('<table class="' + tableClass + '" ' + (hasId ? ('id="' + tableContainId + '"') : '') + ' ><thead>');

            if (options.customizeHeader) {
                var currentGroupHeader = options.cloneGroupHeaderRows;
                if (type === 'frozenheader' || type === 'frozenbody') {
                    //// Create Header Rows for Frozen Table
                    currentGroupHeader = Fanex.Grid.Helper.CreateRowsForFrozenColumn(
                                                    options.cloneGroupHeaderRows.slice(0),
                                                    options.numberOfFrozenColumn,
                                                    me.frozenColsName);
                }
                for (var rowIndex = 0; rowIndex < currentGroupHeader.length; rowIndex++) {
                    var currentRow = currentGroupHeader[rowIndex];

                    if (currentRow.Columns.length > 0) {
                        headerHtml.push('<tr>');

                        for (colIndex = 0; colIndex < currentRow.Columns.length && colIndex < columnLength; colIndex++) {
                            currentCol = currentRow.Columns[colIndex];
                            if (isValid(currentCol)) {
                                customSpan = '';
                                var currentHeight = options.headerColumnHeight;
                                var showHeaderMergeCol = true;

                                if (isValid(currentCol) && isValid(currentCol.MergeRowNumber)) {
                                    //// If It has merge row and current row has only one columns and column has merge row, then remove next row
                                    Fanex.Grid.Helper.RemoveItemForRowSpan(currentGroupHeader, rowIndex, currentCol, me.columnsHastable);
                                    var currentMergeRowNumber = ' rowspan="' + currentCol.MergeRowNumber + '"';
                                    //if (type === 'frozenheader' || type === 'frozenbody') {
                                    //// Calculate height for merger row
                                    currentHeight = ((options.headerColumnHeight * currentCol.MergeRowNumber) + (currentCol.MergeRowNumber - 1) * 5);
                                    //}
                                    customSpan += currentMergeRowNumber;
                                }

                                //// If Current cell has merge Col
                                if (isValid(currentCol) && isValid(currentCol.MergeColNumber)) {
                                    //// Compute for With for merge
                                    currentCol.Width = Fanex.Grid.Helper.GetColMergeWidth(me.columnsForComputingWidth,
                                                                                            me.columnsHastable[currentCol.Name].ColumnIndex,
                                                                                            currentCol.MergeColNumber,
                                                                                            options.enableHiddenColumns,
                                                                                            options.columns);
                                    if (options.enableHiddenColumns === false) {
                                        showHeaderMergeCol = Fanex.Grid.Helper.HideHeaderGroupWhenShowHide(options.hiddenColumns,
                                                                                                            me.columnsHastable[currentCol.Name].ColumnIndex,
                                                                                                            currentCol.MergeColNumber);
                                        customSpan += ' colspan="' + Fanex.Grid.Helper.ReComputeMergeColumAfterShowHide(options.hiddenColumns,
                                                                                                            me.columnsHastable[currentCol.Name].ColumnIndex,
                                                                                                            currentCol.MergeColNumber) + '"';
                                    }
                                    else {
                                        customSpan += ' colspan="' + currentCol.MergeColNumber + '"';
                                    }
                                }

                                if (isValid(currentCol) && isValid(currentCol.MergeHeaderColNumber)) {
                                    customSpan += ' colspan="' + currentCol.MergeHeaderColNumber + '"';
                                }

                                cellInfo =
                                {
                                    CellTag: 'th',
                                    CustomSpan: customSpan,
                                    CssClass: currentCol.CssClass,
                                    SortClass: (currentRow.Columns[colIndex].Sort === true ? ' colSorter' : ''),
                                    CellWidth: (currentCol.Width || me.columnsHastable[currentCol.Name].Width),
                                    CellHeight: currentHeight,
                                    CellId: (me.columnsHastable[currentCol.Name].Sort === true ? (me.gridId + '_header_sort_' + currentCol.Name) : ''),
                                    Sort: currentRow.Columns[colIndex].Sort,
                                    CellColumnName: currentCol.Name,
                                    HeaderText: currentCol.HeaderText,
                                    CustomAttr: (currentGroupHeader.length > 1 && rowIndex === (currentGroupHeader.length - 1)) ?
                                                    me.columnsHastable[currentCol.Name].CustomAttr :
                                                    undefined,
                                    CustomHeaderRender: currentCol.CustomHeaderRender || me.columnsHastable[currentCol.Name].CustomHeaderRender,
                                    SortDirection: currentRow.Columns[colIndex].SortDirection || '',
                                    CanShowHide: (me.columnsHastable[currentCol.Name].CanShowHide && (!options.enableHiddenColumns) && showHeaderMergeCol),
                                    TdClass: me.columnsHastable[currentCol.Name].TdClass || '',
                                    ThClass: currentRow.Columns[colIndex].ThClass || '',
                                    //                                    (currentGroupHeader.length > 1 && rowIndex === (currentGroupHeader.length - 1)) ?
                                    //                                                        me.columnsHastable[currentCol.Name].ThClass :
                                    //                                                        '',
                                    CellAlign: me.columnsHastable[currentCol.Name].HeaderAlign || (me.columnsHastable[currentCol.Name].CellAlign || 'center')
                                };
                                trsHeader.push(me.RenderHeaderCell(cellInfo, currentCol));
                            }
                        }
                        headerHtml.push(trsHeader.join(''));
                        headerHtml.push('</tr>');
                        trsHeader = [];
                    }
                }
            }
            else {
                //// Has no frozen column
                headerHtml.push('<tr>');
                for (colIndex = 0; colIndex < columnLength; colIndex++) {
                    currentCol = me.headerColumnsCloneFromOptionColumns[colIndex];
                    customSpan = '';
                    if (isValid(currentCol) && isValid(currentCol.MergeHeaderColNumber)) {
                        customSpan += ' colspan="' + currentCol.MergeHeaderColNumber + '"';
                    }
                    cellInfo =
                    {
                        CellTag: 'th',
                        CustomSpan: customSpan,
                        CssClass: currentCol.CssClass,
                        SortClass: (currentCol.Sort === true ? ' colSorter' : ''),
                        CellWidth: (currentCol.Width || me.columnsHastable[currentCol.Name].Width),
                        CellHeight: options.headerColumnHeight,
                        CellId: (me.columnsHastable[currentCol.Name].Sort === true ? (me.gridId + '_header_sort_' + currentCol.Name) : ''),
                        Sort: currentCol.Sort,
                        CellColumnName: currentCol.Name,
                        HeaderText: currentCol.HeaderText,
                        CustomHeaderRender: currentCol.CustomHeaderRender || me.columnsHastable[currentCol.Name].CustomHeaderRender,
                        SortDirection: currentCol.SortDirection || '',
                        CustomAttr: me.columnsHastable[currentCol.Name].CustomAttr,
                        CanShowHide: me.columnsHastable[currentCol.Name].CanShowHide && (!options.enableHiddenColumns),
                        TdClass: me.columnsHastable[currentCol.Name].TdClass || '',
                        ThClass: me.columnsHastable[currentCol.Name].ThClass || '',
                        CellAlign: me.columnsHastable[currentCol.Name].HeaderAlign || (me.columnsHastable[currentCol.Name].CellAlign || 'center')
                    };
                    trsHeader.push(me.RenderHeaderCell(cellInfo, currentCol));
                }
                headerHtml.push(trsHeader.join(''));
                headerHtml.push('</tr>');
            }
            headerHtml.push('</thead><tbody>{$}' + replaceMark + '</tbody></table>');
            headerHtml.push('</div>');
            if (divHeaderClass !== '') {
                headerHtml.push('</div>');
            }
            return headerHtml.join('');
        },
        RenderFrozenRow: function (currentRow, colHtmlTag, isBody, rowIndex, treeCollapseExpandClass, isForNoData, parentHighlight, level) {
            var me = this;
            var options = me.Options;
            var frozenRowHtml = [];
            var colsLength = currentRow.Columns.length;
            var currentCollapseExpandId = '';
            var parentRowClass = '';
            var currentMergeColsIndex = 0;
            var trHighlightAtt = (options.showHighlightRow ? (' highlightatt="highlight-att-frozen-' + parentHighlight + '-' + rowIndex + '"') : '');
            var trAutoFixRowAtt = (options.autoFixFrozenRowHeight ? (' autofixatt="autofix-att-frozen-' + parentHighlight + '-' + rowIndex + '"') : '');
            var trClass = (options.showHighlightRow ? 'highlight-row ' : '') +
                            (options.autoFixFrozenRowHeight ? 'auto-fix-row ' : '') +
                            (treeCollapseExpandClass || '') +
                            (currentRow.CssClass || '') +
                            (options.showDistinctRow ? ((rowIndex + 1) % 2 === 0 ? ' freegrid-even' : '') : '');
            if (options.showTree === true && currentRow.SubRows) {
                parentRowClass = 'parent-row parent-level-' + level;
            }

            frozenRowHtml.push('<tr class="' + trClass + ' ' + parentRowClass + '" ' + (currentRow.CustomAttr || '') + trHighlightAtt + trAutoFixRowAtt + '>');
            for (var columnIndex = 0; columnIndex < colsLength; columnIndex++) {
                var currentCol = currentRow.Columns[columnIndex];
                var customSpan = '';
                var currentHeight = 'height:' + (currentRow.RowHeight || options.bodyRowHeight) + 'px;';
                var currentWidth = me.columnsHastable[currentCol.Name].Width;
                var currentHeightForComputeCenter = options.bodyRowHeight;

                //// If Merge Row, then add rowspan, If in the same row and there are no other columns, then cal height, 
                //// or there are some columns but they also have colspan, then cal height
                if (isValid(currentCol.MergeRowNumber)) {
                    customSpan += ' rowspan="' + currentCol.MergeRowNumber + '" ';
                    if (Fanex.Grid.Helper.CheckHideColSpan(currentRow.Columns)) {
                        currentHeightForComputeCenter = ((options.bodyRowHeight * currentCol.MergeRowNumber) + (currentCol.MergeRowNumber - 1) * 5);
                        currentHeight = 'height:' + currentHeightForComputeCenter + 'px;';
                        customSpan = '';
                    }
                }

                //// If Merge Column and current row is footer, then calculate height
                if (isValid(currentCol.MergeColNumber)) {
                    customSpan += ' colspan="' + currentCol.MergeColNumber + '" ';
                    currentWidth = Fanex.Grid.Helper.GetColMergeWidth(me.columnsForComputingWidth,
                                                                        me.columnsHastable[currentCol.Name].ColumnIndex,
                                                                        currentCol.MergeColNumber,
                                                                        options.enableHiddenColumns,
                                                                        options.columns);
                }

                if (currentCol.PrevRowsColMergeNumber) {
                    currentMergeColsIndex += currentCol.PrevRowsColMergeNumber;
                }

                var renderObject = me.RenderBodyCell(
                        {
                            HtmlTag: colHtmlTag,
                            CustomSpan: customSpan,
                            Height: currentHeight
                        },
                        {
                            IsNoData: isForNoData,
                            ColIndex: columnIndex,
                            RowIndex: rowIndex,
                            CssClass: (currentCol.CssClass || (me.columnsHastable[currentCol.Name].CellCssClass || '')),
                            Width: currentWidth,
                            Align: (currentCol.CellAlign || (me.columnsHastable[currentCol.Name].CellAlign || 'left')),
                            CustomAttr: (currentCol.CustomAttr || ''),
                            ParentHighlight: parentHighlight,
                            MergeColumnIndex: currentMergeColsIndex
                        },
                        currentCol,
                        currentRow,
                        isBody,
                        level
                    );
                frozenRowHtml.push(renderObject.CellHtml);
                if (renderObject.CurrentColumnShowTree === true) {
                    currentCollapseExpandId = renderObject.CurrentCollapseExpandId;
                }
                if (isValid(currentCol.MergeColNumber)) {
                    currentMergeColsIndex += currentCol.MergeColNumber - 1;
                }
            }
            frozenRowHtml.push('</tr>');

            if (options.showTree === true && currentRow.SubRows) {
                frozenRowHtml.push(me.RenderSubRow(currentRow, false, isBody, 0, currentCollapseExpandId, parentHighlight, level));
            }

            return frozenRowHtml.join('');
        },
        RenderNormalRow: function (currentRow, colHtmlTag, isBody, rowIndex, treeCollapseExpandClass, isForNoData, parentHighlight, level) {
            var me = this;
            var options = me.Options;
            var rowHtml = [];
            var colsLength = currentRow.Columns.length;
            var currentCollapseExpandId = '';
            var parentRowClass = '';
            var currentMergeColsIndex = 0;
            var trHighlightAtt = (options.showHighlightRow && isBody ? (' highlightatt="highlight-att-main-' + parentHighlight + '-' + rowIndex + '"') : '');
            var trAutoFixRow = (options.autoFixFrozenRowHeight && isBody ? (' autofixatt="autofix-att-main-' + parentHighlight + '-' + rowIndex + '"') : '');
            var trClass = (options.showHighlightRow ? 'highlight-row ' : '') +
                            (options.autoFixFrozenRowHeight ? 'auto-fix-row ' : '') +
                            (currentRow.CssClass || '') + ' ' +
                            (treeCollapseExpandClass || '') + ' ' +
                            (options.showDistinctRow ? ((rowIndex + 1) % 2 === 0 ? ' freegrid-even' : '') : '');

            if (colsLength > 0) {
                //// If show grid with tree, then add class to parent row
                if (options.showTree === true && currentRow.SubRows) {
                    parentRowClass = 'parent-row parent-level-' + level;
                }
                rowHtml.push('<tr class="' + trClass + ' ' + parentRowClass + '" ' + (currentRow.CustomAttr || '') + ' ' + trHighlightAtt + trAutoFixRow + '>');

                for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                    var currentCol = currentRow.Columns[colIndex];
                    var currentWidth = me.columnsHastable[currentCol.Name].Width;
                    var customSpan = '';
                    var currentHeight = 'height:' + (currentRow.RowHeight || options.bodyRowHeight) + 'px;';
                    var currentHeightForComputeCenter = options.bodyRowHeight;
                    if (isValid(currentCol.MergeRowNumber)) {
                        customSpan += ' rowspan="' + currentCol.MergeRowNumber + '" ';
                        currentHeightForComputeCenter *= currentCol.MergeRowNumber;
                    }

                    //// If merge Column, then calculate width for merging
                    if (isValid(currentCol.MergeColNumber)) {
                        customSpan += ' colspan="' + currentCol.MergeColNumber + '" ';
                        currentWidth = Fanex.Grid.Helper.GetColMergeWidth(me.columnsForComputingWidth,
                                                                            me.columnsHastable[currentCol.Name].ColumnIndex,
                                                                            currentCol.MergeColNumber,
                                                                            options.enableHiddenColumns,
                                                                            options.columns);
                    }
                    if (currentCol.PrevRowsColMergeNumber) {
                        currentMergeColsIndex += currentCol.PrevRowsColMergeNumber;
                    }
                    var renderObject = me.RenderBodyCell({
                        HtmlTag: colHtmlTag,
                        CustomSpan: customSpan,
                        Height: currentHeight
                    }, {
                        IsNoData: isForNoData,
                        ColIndex: colIndex,
                        RowIndex: rowIndex,
                        CssClass: (currentCol.CssClass || (me.columnsHastable[currentCol.Name].CellCssClass || '')),
                        Width: currentWidth,
                        Align: (currentCol.CellAlign || (me.columnsHastable[currentCol.Name].CellAlign || 'left')),
                        CustomAttr: (currentCol.CustomAttr || ''),
                        ParentHighlight: parentHighlight,
                        MergeColumnIndex: currentMergeColsIndex
                    },
                        currentCol,
                        currentRow,
                        isBody,
                        level
                    );
                    rowHtml.push(renderObject.CellHtml);
                    if (renderObject.CurrentColumnShowTree === true) {
                        currentCollapseExpandId = renderObject.CurrentCollapseExpandId;
                    }
                    if (isValid(currentCol.MergeColNumber)) {
                        currentMergeColsIndex += currentCol.MergeColNumber - 1;
                    }
                }
                rowHtml.push('</tr>');

                if (options.showTree === true && currentRow.SubRows) {
                    rowHtml.push(me.RenderSubRow(currentRow, true, isBody, 0, currentCollapseExpandId, parentHighlight, level));
                }
            }

            return rowHtml.join('');
        },
        RenderSubRow: function (currentRow, isMain, isBody, rowIndex, currentCollapseExpandId, parentHighlight, level) {
            var me = this;
            var options = me.Options;
            var subRowHtml = [];
            var currentSubRows = (isMain === true ? currentRow.SubRows :
                                    Fanex.Grid.Helper.CreateRowsForFrozenColumn(currentRow.SubRows, options.numberOfFrozenColumn, me.frozenColsName));
            var subRowsLength = currentSubRows.length;
            level++;
            for (var subRowIndex = 0; subRowIndex < subRowsLength; subRowIndex++) {
                var currentSubRow = currentSubRows[subRowIndex];
                if (isMain === true) {
                    subRowHtml.push(me.RenderNormalRow(currentSubRow,
                                                        'td',
                                                        isBody,
                                                        subRowIndex,
                                                        currentCollapseExpandId,
                                                        false,
                                                        parentHighlight + '-' + rowIndex + '-' + subRowIndex, level));
                }
                else {
                    subRowHtml.push(me.RenderFrozenRow(
                                                    currentSubRow,
                                                    'td',
                                                    isBody,
                                                    subRowIndex,
                                                    currentCollapseExpandId,
                                                    false,
                                                    parentHighlight + '-' + rowIndex + '-' + subRowIndex, level));
                }
            }
            return subRowHtml.join('');
        },
        RenderBodyCell: function (container, cell, currentCol, currentRow, isBody, level) {
            var me = this;
            var options = me.Options;
            var cellHtml = [];
            var currentCollapseExpandId = '';

            var currentValue = currentCol.Value;
            if (me.columnsHastable[currentCol.Name].IsAbs && currentValue < 0) {
                currentValue = Math.abs(currentValue);
            }

            if (me.columnsHastable[currentCol.Name].FormatNumber && !isNaN(currentValue) && currentValue !== '') {
                currentValue = numeral(currentValue).format(me.columnsHastable[currentCol.Name].FormatNumber);
            }

            if (me.columnsHastable[currentCol.Name].FormatDateTime &&
                isValid(currentValue) &&
                currentValue !== '' &&
                currentValue != null) {
                var momentObject = moment(currentValue);
                if (momentObject.isValid()) {
                    if (options.timeZone !== '') {
                        momentObject = momentObject.zone(options.timeZone);
                    }

                    currentValue = momentObject.format(me.columnsHastable[currentCol.Name].FormatDateTime);
                }
            }

            if (me.columnsHastable[currentCol.Name].FormatNegative) {
                if (currentCol.Value < 0) {
                    currentValue = '<span class="format-negative">' + me.columnsHastable[currentCol.Name].FormatNegative.replace('$', currentValue) + '</span>';
                }
            }

            if (me.columnsHastable[currentCol.Name].FormatPositive) {
                if (currentCol.Value > 0) {
                    currentValue = '<span class="format-positive">' + me.columnsHastable[currentCol.Name].FormatPositive.replace('$', currentValue) + '</span>';
                }
            }

            var cellContent = '';
            if (cell.IsNoData === true) {
                cellContent = currentCol.Value;
            }
            else {
                cellContent = typeof currentCol.CustomCellRender === 'function' ?
                                                currentCol.CustomCellRender(currentCol, currentValue) :
                                                ((typeof (me.columnsHastable[currentCol.Name].CustomCellRender) === 'function' && isBody) ?
                                                            me.columnsHastable[currentCol.Name].CustomCellRender(currentCol, currentValue) :
                                                            currentValue);
            }

            //// If show tree, then add icon expand
            var tdClass = 'free-grid-td-' + (cell.ColIndex + cell.MergeColumnIndex) + ' '
                            + (currentCol.TdClass || (me.columnsHastable[currentCol.Name].TdClass || ''));
            if (options.showTree === true && currentRow.SubRows && me.columnsHastable[currentCol.Name].ShowCollapseExpand === true) {
                tdClass = 'tr-grid-collapse-expand';
            }

            //// For show/hide column
            if (me.columnsHastable[currentCol.Name].CanShowHide && me.columnsHastable[currentCol.Name].CanShowHide === true && (!options.enableHiddenColumns)) {
                tdClass += ' grid-show-hide-column';
            }

            var truncateClass = '';
            var allowTruncate = me.columnsHastable[currentCol.Name].AllowTruncate === true ? true : options.allowTruncate;
            if (allowTruncate === true) {
                truncateClass = ' column-truncate';
            }

            var titleTooltip = '';
            if (typeof (currentCol.Value) === 'string' &&
                (currentCol.Value.length * me.currentFontSize > me.columnsHastable[currentCol.Name].Width) &&
                allowTruncate === true) {
                titleTooltip = ' title="' + currentCol.Value + '" ';
            }

            var isCurrentColShowTree = (options.showTree === true &&
            currentRow.SubRows &&
            currentRow.SubRows.length > 0 && me.columnsHastable[currentCol.Name].ShowCollapseExpand === true);

            var paddingLeft = '';
            if ((isCurrentColShowTree && level !== 0) ||
            (level > 0 &&
                !(currentRow.SubRows && currentRow.SubRows.length > 0) &&
                me.columnsHastable[currentCol.Name].ShowCollapseExpand === true) ||
            (level === 0 && isCurrentColShowTree &&
                (!isValid(currentRow.SubRows) || currentRow.SubRows.length === 0))) {
                var totalPaddingLeft = level * options.treeParentPaddingLeft;
                paddingLeft = 'padding-left:' + totalPaddingLeft + 'px;';
                cell.Width -= totalPaddingLeft;
            }

            cellHtml.push('<' + container.HtmlTag + ' ' + container.CustomSpan + ' class="' + tdClass + '"' + ' style="' + container.Height + '"' + ' >');
            cellHtml.push('<div class="table-cell ' +
                            cell.CssClass + ' ' +
                            truncateClass +
                            '" style="width:' + cell.Width + 'px;' + paddingLeft + '" ' +
                            'align="' + cell.Align + '" ' + titleTooltip + cell.CustomAttr + '>');

            if (isCurrentColShowTree) {
                currentCollapseExpandId = me.gridId + '_tree_' + cell.ParentHighlight;
                cellHtml.push('<span class="grid-collapse-expand grid-expand ' +
                                currentCollapseExpandId + '-class' +
                                '" id="' + currentCollapseExpandId + '"></span>');
                currentCollapseExpandId += ' child-row';
            }

            var showRowIndexNumber = (isBody && options.showNumberColumn && cell.ColIndex === 0 && !cell.IsNoData);
            var currentRowIndexForCustomPager = 0;
            if (showRowIndexNumber) {
                if (options.customPager) {
                    currentRowIndexForCustomPager = cell.RowIndex + options.currentStartRowIndex + 1;
                }
                else {
                    currentRowIndexForCustomPager = (cell.RowIndex + 1);
                }
            }

            cellHtml.push(showRowIndexNumber ? currentRowIndexForCustomPager : cellContent);
            cellHtml.push('</div></' + container.HtmlTag + '>');

            return {
                CellHtml: cellHtml.join(''),
                CurrentCollapseExpandId: currentCollapseExpandId,
                CurrentColumnShowTree: isCurrentColShowTree
            };
        },
        RenderEmptyRow: function (columnName, columnValue, mergeColumnNumber, cssClass, showOnMainBody) {
            var me = this;
            var options = me.Options;
            var minusColumnNumber = 0;
            var hiddenColumns = options.hiddenColumns,
                i;
            if (options.numberOfFrozenColumn > 0) {
                for (i = 0; i < hiddenColumns.length; i++) {
                    if (hiddenColumns[i] < mergeColumnNumber) {
                        minusColumnNumber++;
                    }
                }
            }
            var columns = [{
                Name: columnName,
                Value: columnValue,
                MergeColNumber: mergeColumnNumber - minusColumnNumber,
                CssClass: cssClass
            }];
            if (showOnMainBody) {
                var minusMainColumnNumber = mergeColumnNumber - minusColumnNumber;
                if (options.numberOfFrozenColumn > 0) {
                    for (i = 0; i < hiddenColumns.length; i++) {
                        if (hiddenColumns[i] >= mergeColumnNumber) {
                            minusMainColumnNumber++;
                        }
                    }
                }
                columns.push({
                    Name: options.columns[minusMainColumnNumber].Name,
                    Value: fanexGridCurrentLanguage.noData,
                    MergeColNumber: (options.columns.length - minusMainColumnNumber),
                    CssClass: cssClass
                });
            }

            var emptyRowHtml = this.RenderNormalRow({
                Columns: columns
            }, 'td', true, 0, '', true, '');
            return emptyRowHtml;
        },
        RenderHeaderCell: function (cellInfo, currentColumn) {
            var me = this;
            var options = me.Options;
            var cellHtml = [];
            var cellTag = cellInfo.CellTag || 'td';
            var customSpan = cellInfo.CustomSpan || ' ';
            var cssClass = cellInfo.CssClass || ' ';
            var sortClass = cellInfo.SortClass || ' ';
            var customAttr = cellInfo.CustomAttr || ' ';
            var thClass = cellInfo.ThClass || ' ';
            var cellWidth = 'width:' + (cellInfo.CellWidth || '200') + 'px;';
            var cellHeight = isValid(cellInfo.CellHeight) ? ('height:' + (cellInfo.CellHeight || options.headerColumnHeight) + 'px;') : ' ';
            var cellId = isValid(cellInfo.CellId) ? ' id="' + cellInfo.CellId + '"' : " ";
            var sort = cellInfo.Sort || false;
            var cellColumnName = cellInfo.CellColumnName || '';
            var showClass = (isValid(cellInfo.CanShowHide) && cellInfo.CanShowHide) ? ('grid-show-hide-column') : ' ' + thClass;

            cellHtml.push('<' + cellTag + ' ' + customSpan + ' class="' + showClass + '" >');

            cellHtml.push('<div class="table-cell ' + cssClass + ' ' + sortClass +
                            '" style="' + cellWidth + cellHeight + '" ' + cellId +
                            ' align="' + cellInfo.CellAlign + '" ' + customAttr + '>');
            if (sort === true) {
                cellHtml.push('<div class="display-inline-block">');
            }

            if (typeof cellInfo.CustomHeaderRender === 'function') {
                cellHtml.push(cellInfo.CustomHeaderRender(currentColumn));
            }
            else {
                cellHtml.push(cellInfo.HeaderText);
            }

            if (sort === true) {
                var sortDirection = cellInfo.SortDirection || '';
                cellHtml.push('</div><div class="divSorter ' + sortDirection.toLowerCase() + '" data-columnname="' + cellColumnName + '"> </div>');
            }

            cellHtml.push('</div>');
            cellHtml.push('</' + cellTag + '>');
            return cellHtml.join('');
        },
        RenderBody: function (headerHtml, reRenderBody) {
            var me = this;
            var options = this.Options;
            var bodyHtml = (reRenderBody === true ? '' : (headerHtml + me.RenderCommonHeader('mainbody')));
            var bodyRowsHtml = [];
            var bodyFrozenHtml = [];
            var currentBodyRows = [];
            var currentPageStartIndex = 0,
                currentRow;

            if (options.sortOption.serverSortFunction == null &&
                options.sortOption.customGridSort == null) {
                var defaultSort = false,
                customSortFunction = null,
                sortType = null,
                columnName = '',
                currentDirection = '';
                for (var colIndex = 0; colIndex < options.columns.length; colIndex++) {
                    if (options.columns[colIndex].SortDirection != null
                    && options.columns[colIndex].SortDirection !== '') {
                        defaultSort = true;
                        currentDirection = options.columns[colIndex].SortDirection;
                        customSortFunction = options.columns[colIndex].CustomSortFunction;
                        columnName = options.columns[colIndex].Name;
                        sortType = options.columns[colIndex].SortType;
                        break;
                    }
                }

                if (defaultSort) {
                    options.bodyRows = Fanex.Grid.Helper.GetSortedArray(options.bodyRows,
                                                                    columnName,
                                                                    currentDirection,
                                                                    customSortFunction,
                                                                    sortType);

                }
            }

            //// If show pager, then take approriate data range
            if (options.showPager === true && options.customPager !== true) {
                var startIndex = (options.pagerOption.currentPage * options.pagerOption.itemsPerPage);
                var endIndex = ((options.pagerOption.currentPage + 1) * options.pagerOption.itemsPerPage);
                currentBodyRows = options.bodyRows.slice(startIndex, endIndex);
                currentPageStartIndex = startIndex;
            }
            else {
                this.Options.currentStartRowIndex = options.pagerOption.currentPage * options.pagerOption.itemsPerPage;
                currentBodyRows = options.bodyRows;
            }

            var bodyLength = currentBodyRows.length;
            var currentFrozenRows = (options.numberOfFrozenColumn > 0) ?
                                    Fanex.Grid.Helper.CreateRowsForFrozenColumn(currentBodyRows, options.numberOfFrozenColumn, me.frozenColsName) :
                                    [];
            var frozenBodyLength = currentFrozenRows.length;

            if (bodyLength > 0) {
                //// Render Frozen Row and Main Row at the same time
                for (var rowIndex = 0; rowIndex < frozenBodyLength; rowIndex++) {
                    currentRow = currentBodyRows[rowIndex];
                    var currentFrozenRow = currentFrozenRows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                    bodyFrozenHtml.push(me.RenderFrozenRow(currentFrozenRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }

                //// If MainRow still has item, then continue render
                for (rowIndex = frozenBodyLength; rowIndex < bodyLength; rowIndex++) {
                    currentRow = currentBodyRows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }
            }
            else {
                //// Render There is no data, showNoDataOnFrozen
                var emptyData = fanexGridCurrentLanguage.noData;
                if (options.numberOfFrozenColumn > 0) {
                    if (options.showNoDataOnFrozen) {
                        //// Show No Info on the frozen table
                        bodyRowsHtml.push(me.RenderEmptyRow(options.columns[0].Name, emptyData, options.columns.length, 'no-data-frozen', false));
                        bodyFrozenHtml.push(me.RenderEmptyRow(options.columns[0].Name, emptyData, options.numberOfFrozenColumn, 'no-data-frozen', false));
                    }
                    else {
                        //// Show No Info on the main table
                        bodyRowsHtml.push(me.RenderEmptyRow(options.columns[0].Name, '', options.numberOfFrozenColumn, 'no-data-frozen', true));
                        bodyFrozenHtml.push(me.RenderEmptyRow(options.columns[0].Name, '', options.numberOfFrozenColumn, '', false));
                    }
                }
                else {
                    //// Show No Info on the main table
                    bodyRowsHtml.push(me.RenderEmptyRow(options.columns[0].Name, emptyData, options.columns.length, 'no-data-not-frozen', false));
                }
            }

            if (reRenderBody === true) {
                //if (ub.msie) {
                me.$grid.find('#' + me.frozenContentId + '> tbody').remove();
                me.$grid.find('#' + me.tableContentId + '> tbody').remove();
                var div = document.createElement("div");
                div.innerHTML = "<table><tbody>" + bodyFrozenHtml.join('') + "</tbody></table>";
                var frozenContainer = document.getElementById(me.frozenContentId);
                if (frozenContainer) {
                    frozenContainer.appendChild(div.firstChild.tBodies[0]);
                }
                div.innerHTML = "<table><tbody>" + bodyRowsHtml.join('') + "</tbody></table>";
                var mainContainer = document.getElementById(me.tableContentId);
                if (mainContainer) {
                    mainContainer.appendChild(div.firstChild.tBodies[0]);
                }
                //document.getElementById(me.tableContentId).getElementsByTagName('tbody')[0].outerHTML = '<body>' + bodyRowsHtml.join('') + '</body>';
                //                }
                //                else {
                //                    
                //                }
            }
            else {
                // Fixbug for replace $' string
                var bodyHtmlTemp = bodyHtml.split('{$}frozenBody');
                if (bodyHtmlTemp.length === 2) {
                    bodyHtml = bodyHtmlTemp[0] + bodyFrozenHtml.join('') + bodyHtmlTemp[1];
                }
                bodyHtmlTemp = bodyHtml.split('{$}_');
                if (bodyHtmlTemp.length === 2) {
                    bodyHtml = bodyHtmlTemp[0] + bodyRowsHtml.join('') + bodyHtmlTemp[1];
                }
            }

            return Fanex.Grid.Helper.RemoveSpaceIE9(bodyHtml);
        },
        RenderFooter: function (reRender) {
            var me = this,
            //options = me.Options,
                footerHtml = [],
                frozenFooterHtml = [],
                currentFooterHtml = me.RenderFooterBody();
            reRender = reRender || false;
            if (reRender) {
                //currentFooterHtml
                me.$grid.find('.row_footer_content > thead').empty().append(currentFooterHtml.frozenFooterHtml);
                me.$grid.find('.col_footer_content > thead').empty().append(currentFooterHtml.footerHtml);
            }
            else {
                footerHtml.push('<div class="col_footer row-footer-background scroll-y">' +
                                '<div class="footer-container">' +
                                    '<table class="col_footer_content grid-fixed-table">' +
                                        '<thead>');

                frozenFooterHtml.push(' <div class="row_footer row-footer-background z999">' +
                                    ' <table class="grid-fixed-table row_footer_content">' +
                                    '    <thead>');


                currentFooterHtml = me.RenderFooterBody();

                footerHtml.push(currentFooterHtml.footerHtml);

                frozenFooterHtml.push(currentFooterHtml.frozenFooterHtml);

                frozenFooterHtml.push('   </thead>' + '</table>' + '</div>');

                footerHtml.push(' </thead>' + '</table>' + '</div>' + '</div>');

                return frozenFooterHtml.join('') + footerHtml.join('');
            }
        },
        RenderFooterBody: function () {
            var me = this;
            var options = me.Options;
            var footerHtml = [];
            var frozenFooterHtml = [];
            var footerRowsLength = options.footerRows.length,
                currentRow;

            var currentFrozenRows = (options.numberOfFrozenColumn > 0) ?
                                    Fanex.Grid.Helper.CreateRowsForFrozenColumn(options.footerRows, options.numberOfFrozenColumn, me.frozenColsName) :
                                    [];
            var frozenFooterLength = currentFrozenRows.length;

            //// Render Frozen fotter and main Footer
            for (var rowIndex = 0; rowIndex < frozenFooterLength; rowIndex++) {
                currentRow = options.footerRows[rowIndex];
                var currentFrozenRow = currentFrozenRows[rowIndex];
                footerHtml.push(me.RenderNormalRow(currentRow, 'th', false, rowIndex, '', false, ''));
                frozenFooterHtml.push(me.RenderFrozenRow(currentFrozenRow, 'th', false, rowIndex, '', false, ''));
            }

            //// Render only main Footer
            for (rowIndex = frozenFooterLength; rowIndex < footerRowsLength; rowIndex++) {
                currentRow = options.footerRows[rowIndex];
                footerHtml.push(me.RenderNormalRow(currentRow, 'th', false, rowIndex, '', false, ''));
            }

            return {
                footerHtml: footerHtml.join(''),
                frozenFooterHtml: frozenFooterHtml.join('')
            };
        },
        RenderPager: function () {
            var me = this;
            var options = this.Options;
            var pagerOption = {};
            if (options.bodyRows.length > 0) {
                if ($.fn.fanexPagination === undefined) {
                    alert('Please include Fanex.Pagination.cs');
                    return;
                }

                if (options.customPager && options.customPager === true) {
                    pagerOption =
                    {
                        callback: function (pageIndex, itemsPerPage, jq) {
                            if (me.Options.pagerOption.itemsPerPage !== itemsPerPage) {
                                pageIndex = 0;
                            }
                            options.pagerOption.pagerSelectCallBack(pageIndex, itemsPerPage, jq);
                        }
                    };
                }
                else {
                    pagerOption =
                    {
                        callback: function (pageIndex, itemsPerPage) {
                            if (me.Options.pagerOption.itemsPerPage !== itemsPerPage) {
                                pageIndex = 0;
                            }
                            me.Options.pagerOption.currentPage = pageIndex;
                            me.Options.pagerOption.itemsPerPage = itemsPerPage;
                            me.RenderBody('', true);
                            ////Re-render footer 
                            ////options.showFooter && options.bodyRows.length > 0 ? me.RenderFooter() : ""
                            if (options.showFooter && options.bodyRows.length > 0 && typeof (options.pagerOption.customRenderFooter) === 'function') {
                                var startIndex = (options.pagerOption.currentPage * options.pagerOption.itemsPerPage);
                                var endIndex = ((options.pagerOption.currentPage + 1) * options.pagerOption.itemsPerPage);
                                var currentBodyRows = options.bodyRows.slice(startIndex, endIndex);
                                me.Options.footerRows = options.pagerOption.customRenderFooter(
                                                                                                currentBodyRows,
                                                                                                options.pagerOption.currentPage,
                                                                                                options.pagerOption.itemsPerPage);
                                me.RenderFooter(true);
                            }
                            //                            if (typeof (options.pagerOption.afterPagedFunction) === 'function') {
                            //                                options.pagerOption.afterPagedFunction(options.pagerOption);
                            //                            }
                            me.gridOptions.isResetScroller = true;
                            $(me.$grid).gridScroller(me.gridOptions);
                            me.RenderPager();
                            me.RegisterMouseHoverEvent();
                            me.AutoResizeRowHeight();
                            //// Save for rerender
                            Fanex.Grid.List[me.tableContentId].pagerOption = me.Options.pagerOption;
                            if (typeof (options.pagerOption.afterPagedFunction) === 'function') {
                                options.pagerOption.afterPagedFunction(options.pagerOption);
                            }
                            return false;
                        }
                    };
                }

                pagerOption.startPerPage = options.pagerOption.startPerPage;
                pagerOption.stepPerPage = options.pagerOption.pageStep;
                pagerOption.maxTtemsPerPage = options.pagerOption.maxItemsPerPage;
                pagerOption.itemsPerPage = options.pagerOption.itemsPerPage;
                pagerOption.currentPage = options.pagerOption.currentPage;
                pagerOption.totalItem = options.pagerOption.totalItem;
                pagerOption.itemsPerPageArray = options.pagerOption.itemsPerPageArray;
                pagerOption.showDetail = options.pagerOption.showDetail;

                this.$grid.find('#pagination').fanexPagination(pagerOption.totalItem, pagerOption);
            }
        },
        RegisterEvents: function () {
            var me = this;
            var options = me.Options;
            //// Sorting
            me.RegisterSortEvent();

            //// For Onclick Title Button
            if (options.showTitle === true) {
                if (typeof options.titleInfo.exportExcelFunction === 'function') {
                    me.$grid.parent().off('click', '#btnExport' + me.gridId, null).on('click', '#btnExport' + me.gridId, options.titleInfo.exportExcelFunction);
                }
                if (typeof options.titleInfo.backFunction === 'function') {
                    me.$grid.parent().off('click', '#btnBack' + me.gridId, null).on('click', '#btnBack' + me.gridId, options.titleInfo.backFunction);
                }
                if (typeof options.titleInfo.sendMailFunction === 'function') {
                    me.$grid.parent()
                            .off('click', '#btnSendMail' + me.gridId, null)
                            .on('click', '#btnSendMail' + me.gridId, options.titleInfo.sendMailFunction);
                }
                if (options.titleInfo.showCollapseExpandButton === true) {
                    me.$grid.parent().off('click', '#btnCollapseExpand' + me.gridId, null).on('click', '#btnCollapseExpand' + me.gridId, function () {
                        var $this = $(this);
                        if ($this.hasClass('expanded')) {
                            me.$grid.find('.child-row').hide();
                            me.$grid.find('.grid-collapse-expand').removeClass('grid-expand').addClass('grid-collapse');
                            $this.removeClass('expanded').addClass('collapsed');
                        }
                        else {
                            $this.removeClass('collapsed').addClass('expanded');
                            me.$grid.find('.grid-collapse-expand').removeClass('grid-collapse').addClass('grid-expand');
                            me.$grid.find('.child-row').show();
                        }
                        me.gridOptions.isResetScroller = false;
                        var gridOptions = Fanex.Grid.List[me.tableContentId].gridOptions;
                        if (gridOptions) {
                            me.gridOptions.gridHeight = gridOptions.gridHeight;
                        }
                        $(me.$grid).gridScroller(me.gridOptions);
                    });
                }
            }

            //// Bind collapse expand event
            if (options.showTree === true) {
                me.$grid.off('click', '.parent-row > td.tr-grid-collapse-expand', null).on('click', '.parent-row > td.tr-grid-collapse-expand', function () {
                    var $this = $(this);
                    var collapseexpandspan = $this.find('.grid-collapse-expand');
                    var isExpand = false;
                    if (collapseexpandspan.hasClass('grid-expand')) {
                        me.$grid.find('.' + collapseexpandspan.attr('id') + '-class').removeClass('grid-expand').addClass('grid-collapse');
                        isExpand = false;
                    }
                    else {
                        me.$grid.find('.' + collapseexpandspan.attr('id') + '-class').removeClass('grid-collapse').addClass('grid-expand');
                        isExpand = true;
                    }
                    var $child = me.$grid.find('.' + collapseexpandspan.attr('id'));
                    if ($child.length > 0) {
                        $child.toggle();
                        for (var index = 0; index < $child.length; index++) {
                            var $currentChild = $($child[index]);
                            me.RecursiveCollapseExpandChild($currentChild, isExpand);
                        }
                        me.gridOptions.isResetScroller = false;
                        $(me.$grid).gridScroller(me.gridOptions);
                    }
                });
            }
        },
        RecursiveCollapseExpandChild: function ($current, isExpand) {
            var me = this;
            var collapseexpandspan = $current.find('.grid-collapse-expand');
            var $child = me.$grid.find('.' + collapseexpandspan.attr('id'));

            if (isExpand) {
                if (collapseexpandspan.hasClass('grid-expand')) {
                    $child.show();
                }
                else {
                    $child.hide();
                }
            }
            else {
                $child.hide();
            }

            for (var index = 0; index < $child.length; index++) {
                var $currentChild = $($child[index]);
                me.RecursiveCollapseExpandChild($currentChild, isExpand);
            }
        },
        RegisterSortEvent: function () {
            var me = this;
            var options = me.Options;
            //// For Sorting
            var colsLength = options.columns.length;
            for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                var currentCol = options.columns[colIndex];

                if (currentCol.Sort === true) {
                    /*jshint ignore:start*/
                    me.$grid.off('click', '#' + me.gridId + '_header_sort_' + currentCol.Name, null)
                            .on('click', '#' + me.gridId + '_header_sort_' + currentCol.Name, function () {
                                var $this = $(this).find('.divSorter');
                                var currentDirection = '';
                                if ($this.hasClass('desc')) {
                                    me.$grid.find('.divSorter').removeClass('asc').removeClass('desc');
                                    $this.addClass('asc');
                                    currentDirection = 'asc';
                                }
                                else if ($this.hasClass('asc')) {
                                    me.$grid.find('.divSorter').removeClass('asc').removeClass('desc');
                                    $this.addClass('desc');
                                    currentDirection = 'desc';
                                }
                                else {
                                    me.$grid.find('.divSorter').removeClass('asc').removeClass('desc');
                                    $this.addClass('desc');
                                    currentDirection = 'desc';
                                }
                                var customSortFunction = null;
                                var sortType = null;
                                for (var colIndex = 0; colIndex < options.columns.length; colIndex++) {
                                    if (options.columns[colIndex].Name === $this.data('columnname')) {
                                        options.columns[colIndex].SortDirection = currentDirection.toLowerCase();
                                        customSortFunction = options.columns[colIndex].CustomSortFunction;
                                        sortType = options.columns[colIndex].SortType;
                                    }
                                    else {
                                        options.columns[colIndex].SortDirection = '';
                                    }
                                }
                                //customGridSort: null
                                if (typeof (options.sortOption.serverSortFunction) === 'function') {
                                    options.sortOption.serverSortFunction($this.data('columnname'), currentDirection);
                                }
                                else {
                                    if (typeof (options.sortOption.beforeGridSorted) === 'function') {
                                        options.bodyRows = options.sortOption.beforeGridSorted(options.bodyRows, $this.data('columnname'), currentDirection);
                                    }
                                    if (typeof (options.sortOption.customGridSort) === 'function') {
                                        options.bodyRows = options.sortOption.customGridSort(
                                                            options.bodyRows,
                                                            $this.data('columnname'),
                                                            currentDirection,
                                                            customSortFunction,
                                                            sortType);
                                    }
                                    else {
                                        options.bodyRows = Fanex.Grid.Helper.GetSortedArray(options.bodyRows,
                                                                                        $this.data('columnname'),
                                                                                        currentDirection,
                                                                                        customSortFunction,
                                                                                        sortType);
                                    }
                                    me.ReRenderBodyAfterSort($this.data('columnname'), currentDirection);
                                    if (typeof (options.sortOption.afterGridSorted) === 'function') {
                                        options.bodyRows = options.sortOption.afterGridSorted(options.bodyRows, $this.data('columnname'), currentDirection);
                                    }
                                }
                            });
                    /*jshint ignore:end*/
                    continue;
                }
            }
        },
        RegisterMouseHoverEvent: function () {
            var me = this;
            var options = me.Options;
            //// For Mouse hover event
            if (options.showHighlightRow === true && options.numberOfFrozenColumn > 0) {
                me.$grid.find('.highlight-row').unbind('mouseenter mouseleave').mouseenter(function () {
                    var $this = $(this);
                    var hlattr = $this.attr('highlightatt');
                    if (isValid(hlattr)) {
                        if (hlattr.indexOf('frozen') > 0) {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('frozen', 'main') + '"]').addClass('mousehoverbeyond');
                        }
                        else {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('main', 'frozen') + '"]').addClass('mousehoverbeyond');
                        }
                    }
                }).mouseleave(function () {
                    var $this = $(this);
                    var hlattr = $this.attr('highlightatt');
                    if (isValid(hlattr)) {
                        if (hlattr.indexOf('frozen') > 0) {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('frozen', 'main') + '"]').removeClass('mousehoverbeyond');
                        }
                        else {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('main', 'frozen') + '"]').removeClass('mousehoverbeyond');
                        }
                    }
                });
            }
        },

        AutoResizeRowHeight: function () {
            var me = this,
                options = me.Options;
            if (options.autoFixFrozenRowHeight) {
                me.$grid.find('.content-container .auto-fix-row').each(function () {
                    var $this = $(this),
                        currentHeight = $this.height(),
                        atfattr = $this.attr('autofixatt');

                    if (isValid(atfattr)) {
                        me.$grid.find('.row_header tr[autofixatt="' + atfattr.replace('main', 'frozen') + '"]').css('height', currentHeight + 'px');
                    }
                });
                // Header
                var currentFrozenHeader = me.$grid.find('.grid-fixed-table.free-cell-top-left thead tr'),
                    currentFrozenBody = me.$grid.find('.grid-fixed-table.row_header_content thead tr');
                if (currentFrozenHeader.length > 0 && currentFrozenBody.length) {
                    me.$grid.find('.grid-fixed-table.col_header_content thead tr').each(function (index) {
                        var $trTable = $(this),
                            currentHeight = $trTable.height();

                        $(currentFrozenHeader[index]).css('height', currentHeight + 'px');
                        $(currentFrozenBody[index]).css('height', currentHeight + 'px');
                    });
                }
                // Footer
                var currentFrozenFooter = me.$grid.find('.grid-fixed-table.row_footer_content thead tr');
                if (currentFrozenFooter.length > 0) {
                    me.$grid.find('.col_footer_content.grid-fixed-table thead tr').each(function (index) {
                        var $trTable = $(this),
                            currentHeight = $trTable.height();

                        $(currentFrozenFooter[index]).css('height', currentHeight + 'px');
                    });
                }
            }
        }
    };

    //// Grid Helper
    Fanex.Grid.Helper =
    {
        DetectBrowser: function () {
            //// Grid Scroller
            var matchedBrowser, browserDectect;

            // Use of jQuery.browser is frowned upon.
            // More details: http://api.jquery.com/jQuery.browser
            // jQuery.uaMatch maintained for back-compat
            function ubMatch(ua) {
                ua = ua.toLowerCase();

                var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(trident)(?:.*rv:([\w.]+))?/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

                return {
                    browserDectect: match[1] || "",
                    version: match[2] || "0"
                };
            }

            matchedBrowser = ubMatch(navigator.userAgent);
            browserDectect = {};

            if (matchedBrowser.browserDectect) {
                browserDectect[matchedBrowser.browserDectect] = true;
                browserDectect.version = matchedBrowser.version;

                if (matchedBrowser.browserDectect === 'trident') {
                    browserDectect.msie = true;
                }
            }

            // Chrome is Webkit, but Webkit is also Safari.
            if (browserDectect.chrome) {
                browserDectect.webkit = true;
            } else if (browserDectect.webkit) {
                browserDectect.safari = true;
            }

            return browserDectect;
        },
        RemoveItemForRowSpan: function (rows, currentRowIndex, mainColumn) {
            var rowSpanSize = mainColumn.MergeRowNumber;
            var columnName = mainColumn.Name;
            var currentLength = currentRowIndex + rowSpanSize;
            var rowsLength = currentLength < rows.length ? currentLength : rows.length;
            for (var rowIndex = currentRowIndex + 1; rowIndex < rowsLength; rowIndex++) {
                for (var colIndex = 0; colIndex < rows[rowIndex].Columns.length; colIndex++) {
                    var currentCol = rows[rowIndex].Columns[colIndex];
                    if (currentCol.Name === columnName) {
                        if (isValid(currentCol.Sort) && currentCol.Sort === true) {
                            var firstColIndex = Fanex.Grid.Helper.GetColumnIndexFromColumnName(rows[currentRowIndex], currentCol.Name);
                            rows[currentRowIndex].Columns[firstColIndex].Sort = true;
                            rows[currentRowIndex].Columns[firstColIndex].SortDirection = currentCol.SortDirection;
                        }

                        if (isValid(mainColumn.MergeColNumber)) {
                            var mergeColLength = mainColumn.MergeColNumber + colIndex;
                            mergeColLength = (mergeColLength <= rows[rowIndex].Columns.length ? mergeColLength : 0);
                            for (var mergeColIndex = mergeColLength; mergeColIndex >= colIndex; mergeColIndex--) {
                                rows[rowIndex].Columns.splice(mergeColIndex, 1);
                                //rows[rowIndex].Columns.remove(mergeColIndex);
                            }
                        }
                        rows[rowIndex].Columns.splice(colIndex, 1);
                    }
                }
            }
        },
        GetColumnIndexFromColumnName: function (row, columnName) {
            for (var index = 0; index < row.Columns.length; index++) {
                if (row.Columns[index].Name === columnName) {
                    return index;
                }
            }
            return -1;
        },
        CreateRowsForFrozenColumn: function (mainRows, frozenColNumber, frozenColsName) {
            var frozenRows = [];
            var rowLength = mainRows.length;

            for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
                var currentRow = mainRows[rowIndex];
                var newRow = clone(currentRow);
                newRow.Columns = [];
                var isset = false;
                var colsLength = currentRow.Columns.length < frozenColNumber ? currentRow.Columns.length : frozenColNumber;

                for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                    var currentCol = currentRow.Columns[colIndex];
                    if (Fanex.Grid.Helper.CheckExistName(frozenColsName, currentCol.Name)) {
                        newRow.Columns.push(clone(currentRow.Columns[colIndex]));
                        isset = true;
                    }
                }
                if (isset) {
                    frozenRows.push(newRow);
                }
            }

            return frozenRows;
        },
        CheckExistName: function (frozenColsName, name) {
            for (var colIndex = 0; colIndex < frozenColsName.length; colIndex++) {
                if (frozenColsName[colIndex] === name) {
                    return true;
                }
            }
            return false;
        },
        CheckHideColSpan: function (currentFrozenColums) {
            var colsLength = currentFrozenColums.length;
            for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                if (!isValid(currentFrozenColums[colIndex].MergeRowNumber)) {
                    return false;
                }
            }
            return true;
        },
        GetArrayWidth: function (columns, enableHiddenColumns, isForComputingWidth) {
            var arrayWidth = [];
            var columnLength = columns.length;
            for (var columnIndex = 0; columnIndex < columnLength; columnIndex++) {
                var currentColumn = columns[columnIndex];
                if (isValid(enableHiddenColumns) &&
                    enableHiddenColumns === false &&
                    currentColumn.CanShowHide &&
                    currentColumn.CanShowHide === true &&
                    isForComputingWidth === false) {
                    continue;
                }
                else {
                    arrayWidth.push(currentColumn.Width);
                }
            }
            return arrayWidth;
        },
        GetColMergeWidth: function (arrayWidth, startIndex, colMergeNumber, enableHiddenColumns, columns) {
            var colWidth = 0;
            var finalColMergeNumber = colMergeNumber;
            var colLength = arrayWidth.length < (startIndex + colMergeNumber) ? arrayWidth.length : (startIndex + colMergeNumber);
            for (var colIndex = startIndex; colIndex < colLength; colIndex++) {
                if (isValid(enableHiddenColumns) && enableHiddenColumns === false && columns[colIndex].CanShowHide && columns[colIndex].CanShowHide === true) {
                    finalColMergeNumber--;
                }
                else {
                    colWidth += arrayWidth[colIndex];
                }
            }
            colWidth += ((finalColMergeNumber - 1) * 5);
            return colWidth;
        },
        GetColumnWidth: function (columns, name) {
            var colLength = columns.length;
            for (var colIndex = 0; colIndex < colLength; colIndex++) {
                if (columns[colIndex].Name === name) {
                    return columns[colIndex].Width;
                }
            }
            return 0;
        },
        GetColumnsHastable: function (columns) {
            var hastable = {};
            var colLength = columns.length;
            for (var colIndex = 0; colIndex < colLength; colIndex++) {
                var currentCol = columns[colIndex];
                hastable[currentCol.Name] = currentCol;
                hastable[currentCol.Name].ColumnIndex = colIndex;
            }
            return hastable;
        },
        SortByNumber: function (col1Value, col2Value, sortDirection) {
            var isNumber1 = !isNaN(col1Value);
            var isNumber2 = !isNaN(col2Value);

            if (isNumber1 && isNumber2) {
                var parseValCol1 = parseFloat(col1Value);
                var parseValCol2 = parseFloat(col2Value);
                if (sortDirection === 'asc') {
                    return parseValCol1 > parseValCol2 ? 1 : -1;
                }
                else {
                    return parseValCol1 < parseValCol2 ? 1 : -1;
                }
            }

            if (sortDirection === 'asc') {
                if (!isNumber1) {
                    return 1;
                }
            }
            else {
                if (!isNumber2) {
                    return 1;
                }
            }

            return -1;
        },
        GetSortedArray: function (rows, sortField, sortDirection, customSortFunction, sortType) {
            var sortColIndex = null;
            if (rows.length > 0) {
                var firstRow = rows[0];
                var colLength = firstRow.Columns.length;

                for (var colIndex = 0; colIndex < colLength; colIndex++) {
                    if (firstRow.Columns[colIndex].Name === sortField) {
                        sortColIndex = colIndex;
                        break;
                    }
                }
            }

            if (sortType != null) {
                sortType = sortType.toLowerCase();
            }

            sortDirection = sortDirection.toLowerCase();

            if (sortDirection === 'asc') {
                return rows.sort(function (row1, row2) {
                    return Fanex.Grid.Helper.CompareRow(sortColIndex, row1, row2, sortField, sortType, function (col1Value, col2Value) {
                        if (typeof (customSortFunction) === 'function') {
                            return customSortFunction(col1Value, col2Value, sortDirection);
                        }

                        if (sortType != null) {
                            switch (sortType) {
                                case 'number':
                                    return Fanex.Grid.Helper.SortByNumber(col1Value, col2Value, sortDirection);
                                case 'string':
                                    break;
                            }
                        }

                        return col1Value > col2Value ? 1 : -1;
                    });
                });
            }
            else {
                return rows.sort(function (row1, row2) {
                    return Fanex.Grid.Helper.CompareRow(sortColIndex, row1, row2, sortField, sortType, function (col1Value, col2Value) {
                        if (typeof (customSortFunction) === 'function') {
                            return customSortFunction(col1Value, col2Value, sortDirection);
                        }

                        if (sortType != null) {
                            switch (sortType) {
                                case 'number':
                                    return Fanex.Grid.Helper.SortByNumber(col1Value, col2Value, sortDirection);
                                case 'string':
                                    break;
                            }
                        }

                        return col1Value < col2Value ? 1 : -1;
                    });
                });
            }
        },
        CompareRow: function (sortColIndex, row1, row2, sortField, sortType, compareFunction) {
            //            var col1Value = row1.Columns[sortColIndex].Value;
            //            var col2Value = row2.Columns[sortColIndex].Value;
            //            if (sortType != null) {
            //                switch (sortType) {
            //                    case 'number':
            //                        
            //                }
            //            }

            return compareFunction(row1.Columns[sortColIndex].Value, row2.Columns[sortColIndex].Value);
        },
        SetColumnDisplay: function (columns, showHideArray) {
            var columnsLengh = columns.length;
            for (var colIndex = 0; colIndex < columnsLengh; colIndex++) {
                columns[colIndex].CanShowHide = false;
            }
            var showhidelength = showHideArray.length;
            for (var index = 0; index < showhidelength; index++) {
                columns[showHideArray[index]].CanShowHide = true;
            }
            return columns;
        },
        ComputeNewFrozenColumn: function (showhideArray, frozenColumnNumber) {
            var currentFrozenNumber = frozenColumnNumber;
            for (var index = 0; index < showhideArray.length; index++) {
                if (showhideArray[index] < currentFrozenNumber) {
                    frozenColumnNumber--;
                }
            }
            return frozenColumnNumber;
        },
        HideHeaderGroupWhenShowHide: function (hideColumns, startIndex, mergeColNumber) {
            var length = startIndex + mergeColNumber;
            for (var index = startIndex; index < length; index++) {
                if (!Fanex.Grid.Helper.ArrayContains(hideColumns, index)) {
                    return false;
                }
            }
            return true;
        },
        ReComputeMergeColumAfterShowHide: function (hideColumns, startIndex, mergeColNumber) {
            var currentMergeCol = mergeColNumber;
            var length = startIndex + mergeColNumber;
            for (var index = startIndex; index < length; index++) {
                if (Fanex.Grid.Helper.ArrayContains(hideColumns, index)) {
                    currentMergeCol--;
                }
            }
            return currentMergeCol;
        },
        UpdateSortInforAfterShowHideColumns: function (options, sortOption) {
            if (isValid(sortOption)) {
                var colsLength = options.columns.length;
                var customSortFunction = null;
                for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                    if (options.columns[colIndex].Name === sortOption.SortColumnName) {
                        options.columns[colIndex].SortDirection = sortOption.SortDirection.toLowerCase();
                        customSortFunction = options.columns[colIndex].CustomSortFunction;
                    }
                }
                options.bodyRows = Fanex.Grid.Helper.GetSortedArray(options.bodyRows, sortOption.SortColumnName, sortOption.SortDirection, customSortFunction);
            }
        },
        RemoveSpaceIE9: function (html) {
            if (ub.msie && parseInt(ub.version, 10) === 9 && html !== undefined) {
                var expr = new RegExp('>[ \t\r\n\v\f]*<', 'g');
                html = html.replace(expr, '><');
            }

            return html;
        },
        CreateHeaderColumnsFromOptionsColumn: function (columns) {
            var colLength = columns.length;
            var colArray = [];
            for (var colIndex = 0; colIndex < colLength; colIndex++) {
                var currentCol = clone(columns[colIndex]);
                var currentWidth = currentCol.Width;
                if (isValid(currentCol.MergeHeaderColNumber) && currentCol.MergeHeaderColNumber > 0) {
                    var currentMaxLength = currentCol.MergeHeaderColNumber + colIndex;
                    colIndex++;
                    for (; colIndex < currentMaxLength && colIndex < colLength; colIndex++) {
                        currentWidth += columns[colIndex].Width + 5;
                    }
                    colIndex--;
                }
                currentCol.Width = currentWidth;
                colArray.push(currentCol);
            }
            return colArray;
        },
        ArrayContains: function (array, obj) {
            var i = array.length;
            while (i--) {
                if (array[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        ComputeResizeColumn: function (mainContainer, options) {
            var resizeObject = {},
                columnHashtable = Fanex.Grid.Helper.GetColumnsHastable(options.columns),
                pixelsPerCharacter = options.pixelsPerCharacter;

            resizeObject = Fanex.Grid.Helper.ComputeMaxWidthInRows(options.bodyRows, resizeObject, columnHashtable, pixelsPerCharacter);

            if (options.showFooter) {
                resizeObject = Fanex.Grid.Helper.ComputeMaxWidthInRows(options.footerRows, resizeObject, columnHashtable, pixelsPerCharacter);
            }

            var mainColLength = options.columns.length;
            for (var mainColIndex = 0; mainColIndex < mainColLength; mainColIndex++) {
                var currentResizeObject = resizeObject[options.columns[mainColIndex].Name];
                if (currentResizeObject != null) {
                    if (currentResizeObject.calculated || options.calTextWidthWithFontSize) {
                        options.columns[mainColIndex].Width = resizeObject[options.columns[mainColIndex].Name].length;
                    }
                    else {
                        options.columns[mainColIndex].Width = Fanex.Grid.Helper.ComputeTextWidth(mainContainer, currentResizeObject.rawData) + 20;
                    }
                }
            }

            options = Fanex.Grid.Helper.AutoAddWidthForFullScreen(options, mainContainer);

            return options;
        },
        AutoAddWidthForFullScreen: function (options, mainContainer) {
            var currentContainerWidth = mainContainer.parent().width(),
                totalCalulatedWidth = 0,
                colLength = options.columns.length,
                resizeCols = [];

            for (var i = 0; i < colLength; i++) {
                var currentCol = options.columns[i];
                if (currentCol.CanResize === true) {
                    if (typeof (currentCol.MaxResizeWidth) !== 'undefined' && currentCol.Width > currentCol.MaxResizeWidth) {
                        currentCol.Width = currentCol.MaxResizeWidth;
                    }

                    resizeCols.push({
                        colIndex: i,
                        colName: currentCol.Name,
                        colWidth: currentCol.Width
                    });
                }
                totalCalulatedWidth += currentCol.Width;

            }

            //// Add width for others columns
            totalCalulatedWidth += (options.columns.length - 1) * 5 + options.marginRight + (options.hideYBackGroundScroller ? 0 : options.scrollWidth);
            if (resizeCols.length > 0 && currentContainerWidth > totalCalulatedWidth) {
                var totalAddWidth = currentContainerWidth - totalCalulatedWidth,
                    addRowForEachColumn = totalAddWidth / resizeCols.length;

                for (i = 0; i < resizeCols.length; i++) {
                    var currentResizeCol = resizeCols[i];
                    options.columns[currentResizeCol.colIndex].Width = currentResizeCol.colWidth + addRowForEachColumn;
                }
            }

            return options;
        },
        ComputeMaxWidthInRows: function (rows, resizeObject, columnHashtable, pixelsPerCharacter) {
            var rowLength = rows.length;
            //currentPixelsPerChar = 0;

            for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
                var currentRow = rows[rowIndex],
                    colLength = currentRow.Columns.length;
                for (var colIndex = 0; colIndex < colLength; colIndex++) {
                    var currentCol = currentRow.Columns[colIndex];
                    if (columnHashtable[currentCol.Name].CanResize === true) {
                        var textLength = 0;
                        var calculated = true;
                        if (typeof (resizeObject[currentCol.Name]) === 'undefined') {
                            resizeObject[currentCol.Name] = {
                                length: columnHashtable[currentCol.Name].Width,
                                calculated: true,
                                rawData: ''
                            };
                        }

                        if (columnHashtable[currentCol.Name].CalResizeFunction != null) {
                            textLength = columnHashtable[currentCol.Name].CalResizeFunction(currentCol.Value);
                        }
                        else {
                            if (columnHashtable[currentCol.Name].PixelsPerCharacter != null) {
                                if (currentCol.Value != null) {
                                    textLength = currentCol.Value.toString().length * columnHashtable[currentCol.Name].PixelsPerCharacter;
                                }
                            }
                            else {
                                //currentpixelsPerChar = Fanex.Grid.;
                                if (currentCol.Value != null) {
                                    textLength = currentCol.Value.toString().length * pixelsPerCharacter;
                                }
                                calculated = false;
                            }

                            ////resizeResult = currentCol.Value.toString().length * currentpixelsPerChar;
                        }

                        if (resizeObject[currentCol.Name].length < textLength) {
                            resizeObject[currentCol.Name].length = textLength;
                            if (calculated === false) {
                                resizeObject[currentCol.Name].calculated = calculated;
                                if (currentCol.Value != null) {
                                    resizeObject[currentCol.Name].rawData = currentCol.Value.toString();
                                }
                            }
                        }
                    }
                }
            }

            return resizeObject;
        },
        ComputeTextWidth: function (mainContainer, text) {
            var tempElement = $('<div>' + text + '</div>')
            .css({
                'position': 'absolute',
                'float': 'left',
                'white-space': 'nowrap',
                'visibility': 'hidden'
            }).appendTo(mainContainer);
            var textWidth = tempElement.width();

            tempElement.remove();

            return textWidth;
        }
    };

    Fanex.Grid.List = Fanex.Grid.List || {};

    Fanex.Grid.Constant = Fanex.Grid.Constant ||
    {
        NO_DATA_INFO: $.fn.fanexGrid.defaults.noDataText
    };

    Fanex.Grid.Language = Fanex.Grid.Language || {};

    $.fn.gridScroller = function (opts) {
        return this.each(function () {
            var o = $(this);
            var xscrollbar = o.find(".x-scrollbar");
            var yscrollbar = o.find(".y-scrollbar");
            var container = o.find(".grid-container");
            var rowheader = o.find(".row_header");
            o.parent().removeClass('display-none');
            o.parent().show();
            o.show();
            o.parent().find('.grid-title').removeClass('display-none');
            var options = $.extend({}, $.fn.renderScroller.defaults, opts);

            if (!isValid(Fanex.Grid.List[options.tblContentId])) {
                $(window).resize(function () {
                    if (!o.hasClass("display-none")) {
                        //o.resetGrid(options.tblContentId);
                        var opt = $.extend({}, {}, Fanex.Grid.List[options.tblContentId].gridOptions);
                        opt.manualCopyHeader = true;
                        o.renderScroller(opt);
                        //                        o.find('.grid-fixed-table').each(function () {
                        //                            $(this).append(' ');
                        //                        });
                        //console.log("resize-" + options.tblContentId);
                    }
                });
                Fanex.Grid.List[options.tblContentId] =
                {
                    gridOptions: options,
                    pagerOption: null,
                    sortOption: null
                };
            }
            else {
                Fanex.Grid.List[options.tblContentId].gridOptions = options;
            }

            o.renderScroller(options);
            //o.find('.grid-fixed-table').append(' ');

            if (options.isResetScroller) {
                o.resetScroller(o, container, rowheader, xscrollbar, yscrollbar);
            } else {
                var top = yscrollbar.scrollTop();
                container.prop("scrollTop", top);
                rowheader.prop("scrollTop", top);
            }

            return new Scroller(o, container, rowheader, xscrollbar, yscrollbar);
        });
    };

    $.fn.initGrid = function (options) {
        return this.each(function () {
            var o = $(this);
            //Render Free Cell
            var freeCellTpl = '<div class="free-cell free-bottom-left">\
                    <table class="grid-fixed-table">\
                        <thead>\
                            <tr>\
                                <th class="free-cell-bottom-left">\
                                    <div>\
                                    </div>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table>\
                </div>\
                <div class="free-cell free-top-right">\
                    <table class="grid-fixed-table">\
                        <thead>\
                            <tr>\
                                <th class="free-cell-top-right">\
                                    <div>\
                                    </div>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table>\
                </div>\
                <div class="free-cell free-bottom-right">\
                    <table class="grid-fixed-table">\
                        <thead>\
                            <tr>\
                                <th class="free-cell-bottom-right">\
                                    <div>\
                                    </div>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table>\
                </div>';
            o.append(freeCellTpl);
            //Render Scrollbar
            var scrollbarTpl = '<div class="y-scrollbar">\
                    <div class="scrollbar-y-content">\
                        &nbsp;</div>\
                </div>\
                <div class="x-scrollbar">\
                    <div class="scrollbar-x-content">\
                        &nbsp;</div>\
                </div>';
            o.append(scrollbarTpl);
            if (options.isShowPager) {
                var pagerTpl = '<div class="grid-pager">\
                                <div class="grid-pager-content">\
                                    <div id="pagination">&nbsp;</div>\
                                </div>\
                            </div>';
                o.append(pagerTpl);
            }
        });
    };

    $.fn.resetGrid = function () {
        return this.each(function () {
            var o = $(this);
            var xscrollbar = o.find(".x-scrollbar");
            var container = o.find(".grid-container");
            var colHeaderContainer = o.find(".col_header");
            var colFooterContainer = o.find(".col_footer");

            o.css("width", "");
            container.css("width", "");
            o.find(".content-container").css("width", "");
            xscrollbar.css("width", "");
            colHeaderContainer.css("width", "");
            colFooterContainer.css("width", "");
            colHeaderContainer.find(".header-container").css("width", "");
            o.find(".footer-container").css("width", "");
            o.find(".scrollbar-x-content").css("width", "");
            o.find(".free-cell-bottom-left").css("width", "");
        });
    };

    $.fn.resetScroller = function (o, container, rowheader, xscrollbar, yscrollbar) {
        yscrollbar.prop("scrollTop", 0);
        container.prop("scrollTop", 0);
        rowheader.prop("scrollTop", 0);

        container.prop("scrollLeft", 0);
        xscrollbar.prop("scrollLeft", 0);
        o.find(".col_header").prop("scrollLeft", 0);
        o.find(".col_footer").prop("scrollLeft", 0);
    };

    $.fn.renderScroller = function (options) {
        return this.each(function () {
            var bar = 17;
            var o = $(this);

            var isParentShow = o.parent().is(':visible');
            if (!isParentShow) {
                o.parent().css({ position: "absolute", visibility: "hidden", display: "block" });
            }

            var title = o.find(".grid-title");
            var titleHeight = (!title.hasClass('display-none') && title.length > 0) ? title.height() : 0;
            var pager = o.find(".grid-pager");
            var pagerHeight = pager.length > 0 ? pager.height() : 0;
            var xscrollbar = o.find(".x-scrollbar");
            var yscrollbar = o.find(".y-scrollbar");
            var container = o.find(".grid-container");
            var tblContent = o.find("#" + options.tblContentId);

            var freeCellTop = o.find(".free-top-right");
            var freeCellBottom = o.find(".free-bottom-right");

            var colHeaderContainer = o.find(".col_header");
            var rowHeaderContainer = o.find(".row_header");
            var rowHeaderWarpper = o.find(".row_header_wrapper");
            var colFooterContainer = o.find(".col_footer");
            var rowFooterContainer = o.find(".row_footer");
            var isShowFooter = !colFooterContainer.hasClass('display-none') && colFooterContainer.find("thead tr").length > 0;

            var numOfFreezeCol = options.numberFreezeCol;
            var col = options.column.length,
                i;
            if (col > 0) {
                options.gridWidth = 0;
                options.freezeWidth = 0;
                for (i = 0; i < col; i++) {
                    var colw = options.column[i];
                    options.gridWidth += colw;
                    if (i < numOfFreezeCol) {
                        options.freezeWidth += colw;
                    }
                }

                // (padding + border + padding) * col
                //options.gridWidth += (options.padding + 1 + options.padding) * col;
                options.gridWidth += (options.padding + 1 + options.padding) * col;
                options.freezeWidth += (numOfFreezeCol - 1) * options.padding * 2 + numOfFreezeCol - 1;
            }

            if (tblContent.height() === 0 && options.fullHeight === false) {
                tblContent.height(options.gridHeight);
            }

            var tblWidth = Math.max(tblContent.width(), options.gridWidth);
            var freezeWidth = options.freezeWidth;

            var parentWidth = o.parent().width();
            var browserWindowWidth = $(window).width();
            if (parentWidth > browserWindowWidth) {
                parentWidth = browserWindowWidth;
            }

            var gridWidth = options.fullWidth ? ((parentWidth < options.minWidth ? options.minWidth : parentWidth) - options.marginRight) : options.gridWidth;
            var isScrollX = gridWidth < tblWidth + 17;
            gridWidth = isScrollX ? gridWidth : (tblWidth + bar);

            o.css("width", gridWidth + "px");
            o.find(".content-container").css("width", tblWidth + "px");
            o.find(".col_header_content").css("width", tblWidth + "px");
            container.css("width", gridWidth + "px");
            xscrollbar.css("width", (gridWidth - freezeWidth - bar - (options.padding) * 2 - 1) + "px");
            colHeaderContainer.css("width", gridWidth + "px");
            colHeaderContainer.find(".header-container").css("width", tblWidth + "px");
            o.find(".footer-container").css("width", tblWidth + "px");
            o.find(".scrollbar-x-content").css("width", (tblWidth - freezeWidth - (isOnChromeBrowser ? 5 : 0)) + "px");
            o.find(".free-cell-bottom-left").css("width", freezeWidth + "px");
            pager.css("width", gridWidth + "px");
            rowHeaderContainer.css({
                "width": (freezeWidth + 5 + 17 + options.highlightFrozenWidth) + "px"
            });
            rowHeaderWarpper.css({
                "width": (freezeWidth + 5 + options.highlightFrozenWidth) + "px"
            });

            var tblHeight = tblContent.height();
            var freezeHeight = tblContent.find("thead").height();
            //var freezeFooterHeight = isShowFooter ? colFooterContainer.find("thead").height() + 3 : 0;
            var freezeFooterHeight = isShowFooter ? colFooterContainer.find("thead").height() + options.bottomBorderWidth : 0;
            var gridHeight = options.fullHeight ? ($(window).height() - options.gridHeight) : options.gridHeight;
            var isScrollY = gridHeight - titleHeight - pagerHeight - bar - freezeFooterHeight < tblHeight;
            gridHeight = isScrollY ? gridHeight : tblHeight + titleHeight + pagerHeight + bar + freezeFooterHeight;

            if (options.hideYBackGroundScroller) {
                o.css("width", (gridWidth - (!isScrollY && !isScrollX ? 18 : 0)) + "px");
                pager.css("width", (gridWidth - ((!isScrollY && !isScrollX ? 18 : 0) ? 18 : 0)) + "px");
            }

            var containerHeight = gridHeight - titleHeight - freezeFooterHeight - pagerHeight - bar + 1 - extraPosition;
            o.css("height", (gridHeight - 1 - (isScrollX ? -1 : bar)) + "px");
            rowHeaderContainer.css("height", containerHeight + "px");
            container.css("height", containerHeight + "px");
            rowHeaderWarpper.css("height", containerHeight + "px");
            yscrollbar.css("height", (containerHeight - freezeHeight - (ub.chrome || ub.msie ? 1 : 0) - options.heightScrollYAdd) + "px");
            o.find(".free-cell-top-right")
            .css("height", (freezeHeight - ((ub.msie || ub.chrome || ff16) ? (options.padding * 2 + 1) : 0) + (ub.chrome ? 1 : 0)) + "px");
             
            if (isShowFooter) {
                o.find(".free-cell-bottom-right").css("height", (freezeFooterHeight + (isScrollX ? bar : 0) + 1) + "px");
            }
            freeCellBottom.css("top", (gridHeight - pagerHeight - freezeFooterHeight - bar) + "px");
            o.find(".scrollbar-y-content").css("height", (tblHeight - freezeHeight) + "px");

            //// Fixed bug for IE10, wrong body Height
            var newTblHeight = tblContent.height();
            if (ub.msie && tblHeight !== newTblHeight) {
                tblHeight = newTblHeight;
                o.find(".scrollbar-y-content").css("height", (tblHeight - freezeHeight) + "px");
            }

            yscrollbar.css("top", (freezeHeight + titleHeight -
                                    (ub.chrome ? (colHeaderContainer.find("thead tr").length - 2) : 0) +
                                    options.heightScrollYAdd) + "px");
            xscrollbar.css("top", (gridHeight - pagerHeight - bar - 1 + extraPosition) + "px");
            if (numOfFreezeCol > 0) {
                o.find(".free-bottom-left").css("top", (gridHeight - pagerHeight - bar - 1 + extraPosition) + "px");
            }
            else {
                o.find(".free-bottom-left").remove();
            }

            rowFooterContainer.css({
                "top": (gridHeight - pagerHeight - freezeFooterHeight - bar + 1 - extraPosition) + "px",
                "border-top-width": options.bottomBorderWidth + "px"
            });
            colFooterContainer.css({
                "width": gridWidth + "px",
                "top": (gridHeight - pagerHeight - freezeFooterHeight - bar + 1 - extraPosition) + "px",
                "border-top-width": options.bottomBorderWidth + "px"
            });
            //pager.css("top", (gridHeight - pagerHeight - (isScrollX ? -(isShowFooter ? 0 : 1) : bar) - (isShowFooter ? 1 : 1)) + "px");
            pager.css("top", (gridHeight - pagerHeight - (isScrollX ? -(isShowFooter ? 0 : 1) : bar) - 2 + extraPosition * 2) + "px");

            xscrollbar.css("left", (freezeWidth + (options.padding) * 2 + 1 - extraPosition) + "px");
            yscrollbar.css("left", (gridWidth - bar - 1 + extraPosition) + "px");
            freeCellTop.css("left", (gridWidth - bar - 1 + extraPosition) + "px");
            freeCellBottom.css("left", (gridWidth - bar - 1) + "px");

            if (isScrollY) {
                yscrollbar.css("overflow-y", "scroll");
            }
            else {
                yscrollbar.css("overflow-y", "hidden");
            }

            if (isScrollX) {
                xscrollbar.css("overflow-x", "scroll");
            }
            else {
                xscrollbar.css("overflow-x", "hidden");
            }

            ////Recalculate Title Width
            var gridTitle = o.parent().find(".grid-title");
            if (gridTitle.length > 0) {
                gridTitle.width(o.width());
            }
            //// Fixbug show scroller on row header on chrome
            if (isOnChromeBrowser) {
                rowHeaderContainer.css("overflow", "hidden !important");
            }

            ////fix bug scoll in IE
            if (ub.msie) {
                yscrollbar.addClass("y-scrollbar-fix-width");
                xscrollbar.addClass("x-scrollbar-fix-height");
            }

            if (!isParentShow) {
                o.parent().css({ position: "", visibility: "", display: "" });
            }
        });
    };

    $.fn.renderScroller.defaults =
    {
        tblContentId: 'grid1',
        isUseLeftTable: false,
        isShowPager: false,
        column: [],
        numberFreezeCol: 2,
        fullWidth: true,
        fullHeight: true,
        gridWidth: 0,
        //=totalColumnWidth + totalColumn*4 +totalColumn
        minWidth: 600,
        gridHeight: 300,
        freezeWidth: 241,
        //=totalColumnWidth + (totalColumn-1)*2 + (totalColumn-1)
        padding: 2,
        marginRight: 20,
        isResetScroller: true,
        highlightFrozenWidth: 0,
        heightScrollYAdd: 0,
        hideYBackGroundScroller: true,
        bottomBorderWidth: 3
    };

    var Scroller = function (obj, container, rowheader, xscrollbar, yscrollbar) {
        this.preLeft = xscrollbar.scrollLeft();
        this.preTop = yscrollbar.scrollTop();
        this.colHeaderContainer = $(obj).find(".col_header");
        this.rowHeaderContainer = $(obj).find(".row_header");
        this.colFooterContainer = $(obj).find(".col_footer");
        this.init(container, rowheader, xscrollbar, yscrollbar);
    };

    Scroller.prototype =
    {
        init: function (container, rowheader, xscrollbar, yscrollbar) {
            var me = this;
            yscrollbar.scroll(function () {
                var top = yscrollbar.scrollTop();
                if (me.preTop !== top) {
                    container.prop("scrollTop", top);
                    me.rowHeaderContainer.prop("scrollTop", top);
                    me.preTop = top;
                }
            });

            container.scroll(function () {
                var top = container.scrollTop();
                if (me.preTop !== top) {
                    me.rowHeaderContainer.prop("scrollTop", top);
                    yscrollbar.prop("scrollTop", top);
                    me.preTop = top;
                }
                //
                if (isOnSmartPhoneBrowser) {
                    var left = container.scrollLeft();
                    if (me.preLeft !== left) {
                        me.colHeaderContainer.prop("scrollLeft", left);
                        me.colFooterContainer.prop("scrollLeft", left);
                        xscrollbar.prop("scrollLeft", top);
                        me.preLeft = left;
                    }
                }
            });

            rowheader.scroll(function () {
                var top = rowheader.scrollTop();
                if (me.preTop !== top) {
                    container.prop("scrollTop", top);
                    yscrollbar.prop("scrollTop", top);
                    me.preTop = top;
                }
            });

            xscrollbar.scroll(function () {
                var left = xscrollbar.scrollLeft();
                if (me.preLeft !== left) {
                    me.colHeaderContainer.prop("scrollLeft", left);
                    me.colFooterContainer.prop("scrollLeft", left);
                    container.prop("scrollLeft", left);
                    me.preLeft = left;
                }
            });

            if (isOnSmartPhoneBrowser) {
                me.colHeaderContainer.scroll(function () {
                    var left = me.colHeaderContainer.scrollLeft();
                    if (me.preLeft !== left) {
                        container.prop("scrollLeft", left);
                        me.colFooterContainer.prop("scrollLeft", left);
                        xscrollbar.prop("scrollLeft", top);
                        me.preLeft = left;
                    }
                });
                me.colFooterContainer.scroll(function () {
                    var left = me.colFooterContainer.scrollLeft();
                    if (me.preLeft !== left) {
                        container.prop("scrollLeft", left);
                        me.colHeaderContainer.prop("scrollLeft", left);
                        xscrollbar.prop("scrollLeft", top);
                        me.preLeft = left;
                    }
                });
            }
        }
    };


    //----------------------------------------------
    // Search Devives

    var deviceIphone = "iphone";
    var deviceIpod = "ipod";
    var deviceIpad = "ipad";
    var deviceS60 = "series60";
    var deviceSymbian = "symbian";
    var engineWebKit = "webkit";
    var deviceAndroid = "android";
    var deviceBB = "blackberry";
    var devicePalm = "palm";
    var deviceWinMob = "windows ce";

    var uagent = navigator.userAgent.toLowerCase();
    var currentDevice = "";
    function detectSmartPhone() {
        if (uagent.indexOf(deviceIphone) > -1) {
            currentDevice = deviceIphone;
            return true;
        }
        else if (uagent.indexOf(deviceIpod) > -1) {
            currentDevice = deviceIpod;
            return true;
        }
        else if (uagent.indexOf(deviceIpad) > -1) {
            currentDevice = deviceIpad;
            return true;
        }
        else if (uagent.indexOf(deviceS60) > -1) {
            currentDevice = deviceS60;
            return true;
        }
        else if (uagent.indexOf(deviceSymbian) > -1) {
            currentDevice = deviceSymbian;
            return true;
        }
        else if (uagent.indexOf(engineWebKit) > -1) {
            currentDevice = engineWebKit;
            return true;
        }
        else if (uagent.indexOf(deviceAndroid) > -1) {
            currentDevice = deviceAndroid;
            return true;
        }
        else if (uagent.indexOf(deviceBB) > -1) {
            currentDevice = deviceBB;
            return true;
        }
        else if (uagent.indexOf(devicePalm) > -1) {
            currentDevice = devicePalm;
            return true;
        }
        else if (uagent.indexOf(deviceWinMob) > -1) {
            currentDevice = deviceWinMob;
            return true;
        }
        else {
            return false;
        }
    }

    var isOnSmartPhoneBrowser = detectSmartPhone();
    var isOnChromeBrowser = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    var ub = Fanex.Grid.Helper.DetectBrowser();
    ub.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    var ff16 = ub.mozilla && parseInt(ub.version, 10) >= 16;
    var ff18 = ub.mozilla && (parseInt(ub.version, 10) >= 18 && parseInt(ub.version, 10) < 25);
    var extraPosition = ff18 ? 1 : 0;

    function isValid(obj) {
        if (typeof obj !== "undefined" && obj != null) {
            return true;
        }
        return false;
    }

    function clone(obj) {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                target[i] = obj[i];
            }
        }
        return target;
    }

})(jQuery);

//// Language
/* jshint ignore:start */
if (typeof (fanexGridLanguage) === 'undefined') {
    /* File Created: December 4, 2013 */
    var fanexGridLanguage = {};
    fanexGridLanguage['en-US'] = {
        noData: 'There is no data',
        pageSize: 'Page size',
        goToPage: 'Go To Page',
        pagingText: 'Displaying <b>{0}</b> to <b>{1}</b> of <b>{2}</b> item(s)'
    };

    var fanexGridCurrentLanguage = fanexGridLanguage['en-US'];
}
/* jshint ignore:end */
// Array Remove - By John Resig (MIT Licensed)
//Array.prototype.removeArrayItem1 = function (from, to) {
//    var rest = this.slice((to || from) + 1 || this.length);
//    this.length = from < 0 ? this.length + from : from;
//    return this.push.apply(this, rest);
//};




/// <reference path="/@JSense.js" />
/*global fanexGridCurrentLanguage*/
(function ($) {
    $.fn.fanexPagination = function (maxentries, opts) {
        opts = $.extend({
            itemsPerPage: 20,
            startPerPage: 10,
            stepPerPage: 10,
            itemsPerPageArray: [],
            numDisplayEntries: 5,
            currentPage: 0,
            numEdgeEntries: 3,
            linkTo: "javascript:void(0)",
            prevText: "&lt;",
            nextText: "&gt;",
            ellipseText: "...",
            prevShowAlways: true,
            nextShowAlways: true,
            maxTtemsPerPage: 100,
            showDetail: true,

            callback: function () { return false; }
        }, opts || {});

        return this.each(function () {
            /**
            * Calculate the maximum number of pages
            */
            function numPages() {
                return Math.ceil(maxentries / opts.itemsPerPage);
            }

            /**
            * Calculate start and end point of pagination links depending on 
            * currentPage and numDisplayEntries.
            * @return {Array}
            */
            function getInterval() {
                var ne_half = Math.floor(opts.numDisplayEntries / 2);
                var np = numPages();
                var upper_limit = np - opts.numDisplayEntries;
                var start = currentPage > ne_half ? Math.max(Math.min(currentPage - ne_half, upper_limit), 0) : 0;
                var end = currentPage > ne_half ? Math.min(currentPage + (ne_half + 1), np) : Math.min(opts.numDisplayEntries, np);

                return [start, end];
            }

            /**
            * This is the event handling function for the pagination links. 
            * @param {int} page_id The new page number
            */
            function pageSelected(page_id, evt) {
                currentPage = page_id;
                //drawLinks();
                var continuePropagation = opts.callback(parseInt(page_id), parseInt(opts.itemsPerPage), panel);
                if (!continuePropagation) {
                    if (evt.stopPropagation) {
                        evt.stopPropagation();
                    }
                    else {
                        evt.cancelBubble = true;
                    }
                }
                return continuePropagation;
            }

            /**
            * This function inserts the pagination links into the container element
            */
            function drawLinks() {
                panel.empty();
                var interval = getInterval();
                var np = numPages();
                // This helper function returns a handler function that calls pageSelected with the right page_id
                var getClickHandler = function (page_id) {
                    return function (evt) { return pageSelected(page_id, evt); }
                }

                //Generate Items Per Page
                $('<div class="itemperpage">' + fanexGridCurrentLanguage.pageSize + ' </div>').appendTo(panel);
                var optPageSize = $('<select id="itemperpage"></select>').css("width", "50px");
                var totalItemPerPage = opts.itemsPerPageArray.length;

                if (totalItemPerPage > 0) {
                    for (var j = 0; j < totalItemPerPage; j++) {
                        var itemperpage = opts.itemsPerPageArray[j];

                        if (itemperpage == opts.itemsPerPage) {
                            $('<option value="' + itemperpage + '" selected="true">' + itemperpage + '</option>').appendTo(optPageSize);
                        }
                        else {
                            $('<option value="' + itemperpage + '">' + itemperpage + '</option>').appendTo(optPageSize);
                        }
                    }
                }
                else {
                    for (var i = opts.startPerPage; i <= opts.maxTtemsPerPage; i += opts.stepPerPage) {
                        if (i == opts.itemsPerPage) {
                            $('<option value="' + i + '" selected="true">' + i + '</option>').appendTo(optPageSize);
                        }
                        else {
                            $('<option value="' + i + '">' + i + '</option>').appendTo(optPageSize);
                        }
                    }
                }

                optPageSize.bind("change", function () {
                    itemPerPage(this);
                });
                optPageSize.appendTo(panel);
                //            $('<span class="btnseparator"></span>').appendTo(panel);
                // Helper function for generating a single link (or a span tag if it's the current page)
                var numberList = $('<ul ></ul>');

                var appendItem = function (page_id, lastcss, appendopts) {
                    page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
                    currentPage = currentPage < np ? currentPage : np - 1;
                    appendopts = $.extend({ text: page_id + 1, classes: "" }, appendopts || {});
                    if (page_id == currentPage) {
                        var lnk = $("<span class='current'>" + (appendopts.text) + "</span>");
                    }
                    else {
                        var lnk = $("<a>" + (appendopts.text) + "</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', opts.linkTo.replace(/__id__/, page_id));
                    }
                    if (appendopts.classes) { lnk.addClass(appendopts.classes); }
                    $(numberList).append($('<li class="' + (appendopts.classes == "" ? 'sep ' : ' ') + lastcss + '"></li>').append(lnk));
                }
                // Generate "Previous"-Link
                if (opts.prevText && (currentPage > 0 || opts.prevShowAlways)) {
                    var tempCurrentPage = (typeof (currentPage) == 'string' ? parseInt(currentPage) : currentPage);
                    appendItem(tempCurrentPage - 1, '', { text: opts.prevText, classes: "prev" });
                }
                // Generate starting points
                if (interval[0] > 0 && opts.numEdgeEntries > 0) {
                    var end = Math.min(opts.numEdgeEntries, interval[0]);
                    for (var i = 0; i < end; i++) {
                        appendItem(i, ((i == (end - 1)) ? ' last' : ''));
                    }
                    if (opts.numEdgeEntries < interval[0] && opts.ellipseText) {
                        $('<li><span class="lnk go-to-page" title="' + fanexGridCurrentLanguage.goToPage + '">' + opts.ellipseText + '</span></li>').appendTo(numberList);
                    }
                }
                // Generate interval links
                for (var i = interval[0]; i < interval[1]; i++) {
                    appendItem(i, (i == (interval[1] - 1) ? ' last' : ''));
                }
                // Generate ending points
                if (interval[1] < np && opts.numEdgeEntries > 0) {
                    if (np - opts.numEdgeEntries > interval[1] && opts.ellipseText) {
                        $('<li><span class="lnk go-to-page" title="' + fanexGridCurrentLanguage.goToPage + '">' + opts.ellipseText + '</span></li>').appendTo(numberList);
                    }
                    var begin = Math.max(np - opts.numEdgeEntries, interval[1]);
                    for (var i = begin; i < np; i++) {
                        appendItem(i, (i == (np - 1) ? ' last' : ''));
                    }

                }
                // Generate "Next"-Link
                if (opts.nextText && (currentPage < np - 1 || opts.nextShowAlways)) {
                    var tempCurrentPage = (typeof (currentPage) == 'string' ? parseInt(currentPage) : currentPage);
                    appendItem(tempCurrentPage + 1, '', { text: opts.nextText, classes: "next" });
                }
                var list = $('<div class="numberlist"></div>');
                $(list).append($(numberList)).appendTo(panel);

                // Generate Status
                if (opts.showDetail) {
                    var pagingText = fanexGridCurrentLanguage.pagingText
                                                            .replace('{0}', (opts.itemsPerPage * opts.currentPage + 1))
                                                            .replace('{1}', Math.min(opts.itemsPerPage * (opts.currentPage + 1), maxentries))
                                                            .replace('{2}', maxentries);
                    $('<div class="detailtext">' + pagingText + '</div>').appendTo(panel);
                }

                //GotoPage Pane
                $(drawGoToPage()).appendTo(panel);
                panel.find("#pagenav_ibtn").bind("click", function () {
                    var txtPage = panel.find("#txtpage");
                    if (isNumberNotNull(txtPage)) {
                        var curr_page = Math.min(parseInt(parseFloat(txtPage.val())) - 1, np - 1);
                        if (curr_page < 0) {
                            txtPage.val(0);
                            curr_page = 0;
                        }

                        pageSelected(curr_page, this);
                    }
                });

                panel.find(".go-to-page").bind("click", function () {
                    var pagelist = panel.find('.numberlist');
                    var offset = pagelist.offset();
                    var jumpPage = panel.find('.gotopage_box');
                    jumpPage.toggle();
                    var w = pagelist.width();
                    var gotow = jumpPage.width();
                    //                goto.css("left", (offset.left + (w - gotow) / 2 - 10) + "px");
                    //                goto.css("top", "-25px");
                    var gotoOffset = jumpPage.offset();
                    jumpPage.offset({
                        top: offset.top - 25,
                        left: (offset.left + (w - gotow) / 2)
                    });
                });

                panel.find("#txtpage").bind("keypress", function (e) {
                    if (!e) e = window.event;
                    var code = (e.keyCode) ? e.keyCode : e.which;

                    if (code == 69 || code == 101 || code == 45 || code == 37 || code == 39 || code == 36 || code == 35) //e or E or "-"
                        return true;
                    if ((code < 48 || code > 57) && code != 8 && code != 13 && code != 0 && code != 46 && code != 9) {
                        return false;
                    }

                    if (code == 13) {
                        try {
                            panel.find("#pagenav_ibtn").click();
                            return true;
                        } catch (error)
                    { return false; }
                    }
                });
            }

            //check Numeric input field by id
            function isNumberNotNull(txtPage) {
                var result = false;
                try {
                    if (!$.trim(txtPage.val()) == "") {
                        result = !isNaN(txtPage.val());
                    }
                } catch (error) {
                }

                return result;
            }

            function drawGoToPage() {
                var goto_page = '<table class="c gotopage_box" id="page_menu" cellpadding="0px" cellspacing="0px"><tr><td class="go-to-page-text">' + fanexGridCurrentLanguage.goToPage + '</td><td><input type="text" name="txtpage" id="txtpage" class="txt" size="4"></td><td><input type="button" id="pagenav_ibtn" class="pagenav_ibtn" ></input></td></tr></table>';
                return goto_page;
            }

            function itemPerPage(obj) {
                opts.itemsPerPage = $(obj).val();
                drawLinks();
                //alert(opts.currentPage);
                opts.callback(parseInt(opts.currentPage), parseInt(opts.itemsPerPage), this);
            }
            // Extract currentPage from options
            var currentPage = opts.currentPage;

            // Create a sane value for maxentries and itemsPerPage
            maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
            opts.itemsPerPage = (!opts.itemsPerPage || opts.itemsPerPage < 0) ? 1 : opts.itemsPerPage;
            // Store DOM element for easy access from all inner functions
            var panel = $(this);
            // Attach control functions to the DOM element 
            this.selectPage = function (page_id) { pageSelected(page_id); }
            this.prevPage = function () {
                if (currentPage > 0) {
                    pageSelected(currentPage - 1);
                    return true;
                }
                else {
                    return false;
                }
            }
            this.nextPage = function () {
                if (currentPage < numPages() - 1) {
                    pageSelected(currentPage + 1);
                    return true;
                }
                else {
                    return false;
                }
            }
            // When all initialisation is done, draw the links
            drawLinks();
            // call callback function
            //opts.callback(currentPage, opts.itemsPerPage, this);
        });
    }
})(jQuery);

//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a){function b(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function c(a,b){return function(c){return k(a.call(this,c),b)}}function d(a,b){return function(c){return this.lang().ordinal(a.call(this,c),b)}}function e(){}function f(a){w(a),h(this,a)}function g(a){var b=q(a),c=b.year||0,d=b.month||0,e=b.week||0,f=b.day||0,g=b.hour||0,h=b.minute||0,i=b.second||0,j=b.millisecond||0;this._milliseconds=+j+1e3*i+6e4*h+36e5*g,this._days=+f+7*e,this._months=+d+12*c,this._data={},this._bubble()}function h(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return b.hasOwnProperty("toString")&&(a.toString=b.toString),b.hasOwnProperty("valueOf")&&(a.valueOf=b.valueOf),a}function i(a){var b,c={};for(b in a)a.hasOwnProperty(b)&&qb.hasOwnProperty(b)&&(c[b]=a[b]);return c}function j(a){return 0>a?Math.ceil(a):Math.floor(a)}function k(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function l(a,b,c,d){var e,f,g=b._milliseconds,h=b._days,i=b._months;g&&a._d.setTime(+a._d+g*c),(h||i)&&(e=a.minute(),f=a.hour()),h&&a.date(a.date()+h*c),i&&a.month(a.month()+i*c),g&&!d&&db.updateOffset(a),(h||i)&&(a.minute(e),a.hour(f))}function m(a){return"[object Array]"===Object.prototype.toString.call(a)}function n(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function o(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&s(a[d])!==s(b[d]))&&g++;return g+f}function p(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=Tb[a]||Ub[b]||b}return a}function q(a){var b,c,d={};for(c in a)a.hasOwnProperty(c)&&(b=p(c),b&&(d[b]=a[c]));return d}function r(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}db[b]=function(e,f){var g,h,i=db.fn._lang[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=db().utc().set(d,a);return i.call(db.fn._lang,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function s(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function t(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function u(a){return v(a)?366:365}function v(a){return a%4===0&&a%100!==0||a%400===0}function w(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[jb]<0||a._a[jb]>11?jb:a._a[kb]<1||a._a[kb]>t(a._a[ib],a._a[jb])?kb:a._a[lb]<0||a._a[lb]>23?lb:a._a[mb]<0||a._a[mb]>59?mb:a._a[nb]<0||a._a[nb]>59?nb:a._a[ob]<0||a._a[ob]>999?ob:-1,a._pf._overflowDayOfYear&&(ib>b||b>kb)&&(b=kb),a._pf.overflow=b)}function x(a){return null==a._isValid&&(a._isValid=!isNaN(a._d.getTime())&&a._pf.overflow<0&&!a._pf.empty&&!a._pf.invalidMonth&&!a._pf.nullInput&&!a._pf.invalidFormat&&!a._pf.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===a._pf.charsLeftOver&&0===a._pf.unusedTokens.length)),a._isValid}function y(a){return a?a.toLowerCase().replace("_","-"):a}function z(a,b){return b._isUTC?db(a).zone(b._offset||0):db(a).local()}function A(a,b){return b.abbr=a,pb[a]||(pb[a]=new e),pb[a].set(b),pb[a]}function B(a){delete pb[a]}function C(a){var b,c,d,e,f=0,g=function(a){if(!pb[a]&&rb)try{require("./lang/"+a)}catch(b){}return pb[a]};if(!a)return db.fn._lang;if(!m(a)){if(c=g(a))return c;a=[a]}for(;f<a.length;){for(e=y(a[f]).split("-"),b=e.length,d=y(a[f+1]),d=d?d.split("-"):null;b>0;){if(c=g(e.slice(0,b).join("-")))return c;if(d&&d.length>=b&&o(e,d,!0)>=b-1)break;b--}f++}return db.fn._lang}function D(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function E(a){var b,c,d=a.match(vb);for(b=0,c=d.length;c>b;b++)d[b]=Yb[d[b]]?Yb[d[b]]:D(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function F(a,b){return a.isValid()?(b=G(b,a.lang()),Vb[b]||(Vb[b]=E(b)),Vb[b](a)):a.lang().invalidDate()}function G(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(wb.lastIndex=0;d>=0&&wb.test(a);)a=a.replace(wb,c),wb.lastIndex=0,d-=1;return a}function H(a,b){var c,d=b._strict;switch(a){case"DDDD":return Ib;case"YYYY":case"GGGG":case"gggg":return d?Jb:zb;case"Y":case"G":case"g":return Lb;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?Kb:Ab;case"S":if(d)return Gb;case"SS":if(d)return Hb;case"SSS":if(d)return Ib;case"DDD":return yb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Cb;case"a":case"A":return C(b._l)._meridiemParse;case"X":return Fb;case"Z":case"ZZ":return Db;case"T":return Eb;case"SSSS":return Bb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?Hb:xb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return xb;default:return c=new RegExp(P(O(a.replace("\\","")),"i"))}}function I(a){a=a||"";var b=a.match(Db)||[],c=b[b.length-1]||[],d=(c+"").match(Qb)||["-",0,0],e=+(60*d[1])+s(d[2]);return"+"===d[0]?-e:e}function J(a,b,c){var d,e=c._a;switch(a){case"M":case"MM":null!=b&&(e[jb]=s(b)-1);break;case"MMM":case"MMMM":d=C(c._l).monthsParse(b),null!=d?e[jb]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[kb]=s(b));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=s(b));break;case"YY":e[ib]=s(b)+(s(b)>68?1900:2e3);break;case"YYYY":case"YYYYY":case"YYYYYY":e[ib]=s(b);break;case"a":case"A":c._isPm=C(c._l).isPM(b);break;case"H":case"HH":case"h":case"hh":e[lb]=s(b);break;case"m":case"mm":e[mb]=s(b);break;case"s":case"ss":e[nb]=s(b);break;case"S":case"SS":case"SSS":case"SSSS":e[ob]=s(1e3*("0."+b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=I(b);break;case"w":case"ww":case"W":case"WW":case"d":case"dd":case"ddd":case"dddd":case"e":case"E":a=a.substr(0,1);case"gg":case"gggg":case"GG":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=b)}}function K(a){var b,c,d,e,f,g,h,i,j,k,l=[];if(!a._d){for(d=M(a),a._w&&null==a._a[kb]&&null==a._a[jb]&&(f=function(b){var c=parseInt(b,10);return b?b.length<3?c>68?1900+c:2e3+c:c:null==a._a[ib]?db().weekYear():a._a[ib]},g=a._w,null!=g.GG||null!=g.W||null!=g.E?h=Z(f(g.GG),g.W||1,g.E,4,1):(i=C(a._l),j=null!=g.d?V(g.d,i):null!=g.e?parseInt(g.e,10)+i._week.dow:0,k=parseInt(g.w,10)||1,null!=g.d&&j<i._week.dow&&k++,h=Z(f(g.gg),k,j,i._week.doy,i._week.dow)),a._a[ib]=h.year,a._dayOfYear=h.dayOfYear),a._dayOfYear&&(e=null==a._a[ib]?d[ib]:a._a[ib],a._dayOfYear>u(e)&&(a._pf._overflowDayOfYear=!0),c=U(e,0,a._dayOfYear),a._a[jb]=c.getUTCMonth(),a._a[kb]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=l[b]=d[b];for(;7>b;b++)a._a[b]=l[b]=null==a._a[b]?2===b?1:0:a._a[b];l[lb]+=s((a._tzm||0)/60),l[mb]+=s((a._tzm||0)%60),a._d=(a._useUTC?U:T).apply(null,l)}}function L(a){var b;a._d||(b=q(a._i),a._a=[b.year,b.month,b.day,b.hour,b.minute,b.second,b.millisecond],K(a))}function M(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function N(a){a._a=[],a._pf.empty=!0;var b,c,d,e,f,g=C(a._l),h=""+a._i,i=h.length,j=0;for(d=G(a._f,g).match(vb)||[],b=0;b<d.length;b++)e=d[b],c=(h.match(H(e,a))||[])[0],c&&(f=h.substr(0,h.indexOf(c)),f.length>0&&a._pf.unusedInput.push(f),h=h.slice(h.indexOf(c)+c.length),j+=c.length),Yb[e]?(c?a._pf.empty=!1:a._pf.unusedTokens.push(e),J(e,c,a)):a._strict&&!c&&a._pf.unusedTokens.push(e);a._pf.charsLeftOver=i-j,h.length>0&&a._pf.unusedInput.push(h),a._isPm&&a._a[lb]<12&&(a._a[lb]+=12),a._isPm===!1&&12===a._a[lb]&&(a._a[lb]=0),K(a),w(a)}function O(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function P(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function Q(a){var c,d,e,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,a._d=new Date(0/0),void 0;for(f=0;f<a._f.length;f++)g=0,c=h({},a),c._pf=b(),c._f=a._f[f],N(c),x(c)&&(g+=c._pf.charsLeftOver,g+=10*c._pf.unusedTokens.length,c._pf.score=g,(null==e||e>g)&&(e=g,d=c));h(a,d||c)}function R(a){var b,c,d=a._i,e=Mb.exec(d);if(e){for(a._pf.iso=!0,b=0,c=Ob.length;c>b;b++)if(Ob[b][1].exec(d)){a._f=Ob[b][0]+(e[6]||" ");break}for(b=0,c=Pb.length;c>b;b++)if(Pb[b][1].exec(d)){a._f+=Pb[b][0];break}d.match(Db)&&(a._f+="Z"),N(a)}else a._d=new Date(d)}function S(b){var c=b._i,d=sb.exec(c);c===a?b._d=new Date:d?b._d=new Date(+d[1]):"string"==typeof c?R(b):m(c)?(b._a=c.slice(0),K(b)):n(c)?b._d=new Date(+c):"object"==typeof c?L(b):b._d=new Date(c)}function T(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function U(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function V(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function W(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function X(a,b,c){var d=hb(Math.abs(a)/1e3),e=hb(d/60),f=hb(e/60),g=hb(f/24),h=hb(g/365),i=45>d&&["s",d]||1===e&&["m"]||45>e&&["mm",e]||1===f&&["h"]||22>f&&["hh",f]||1===g&&["d"]||25>=g&&["dd",g]||45>=g&&["M"]||345>g&&["MM",hb(g/30)]||1===h&&["y"]||["yy",h];return i[2]=b,i[3]=a>0,i[4]=c,W.apply({},i)}function Y(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=db(a).add("d",f),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function Z(a,b,c,d,e){var f,g,h=U(a,0,1).getUTCDay();return c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:u(a-1)+g}}function $(a){var b=a._i,c=a._f;return null===b?db.invalid({nullInput:!0}):("string"==typeof b&&(a._i=b=C().preparse(b)),db.isMoment(b)?(a=i(b),a._d=new Date(+b._d)):c?m(c)?Q(a):N(a):S(a),new f(a))}function _(a,b){db.fn[a]=db.fn[a+"s"]=function(a){var c=this._isUTC?"UTC":"";return null!=a?(this._d["set"+c+b](a),db.updateOffset(this),this):this._d["get"+c+b]()}}function ab(a){db.duration.fn[a]=function(){return this._data[a]}}function bb(a,b){db.duration.fn["as"+a]=function(){return+this/b}}function cb(a){var b=!1,c=db;"undefined"==typeof ender&&(a?(gb.moment=function(){return!b&&console&&console.warn&&(b=!0,console.warn("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.")),c.apply(null,arguments)},h(gb.moment,c)):gb.moment=db)}for(var db,eb,fb="2.5.1",gb=this,hb=Math.round,ib=0,jb=1,kb=2,lb=3,mb=4,nb=5,ob=6,pb={},qb={_isAMomentObject:null,_i:null,_f:null,_l:null,_strict:null,_isUTC:null,_offset:null,_pf:null,_lang:null},rb="undefined"!=typeof module&&module.exports&&"undefined"!=typeof require,sb=/^\/?Date\((\-?\d+)/i,tb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,ub=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,vb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,wb=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,xb=/\d\d?/,yb=/\d{1,3}/,zb=/\d{1,4}/,Ab=/[+\-]?\d{1,6}/,Bb=/\d+/,Cb=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Db=/Z|[\+\-]\d\d:?\d\d/gi,Eb=/T/i,Fb=/[\+\-]?\d+(\.\d{1,3})?/,Gb=/\d/,Hb=/\d\d/,Ib=/\d{3}/,Jb=/\d{4}/,Kb=/[+-]?\d{6}/,Lb=/[+-]?\d+/,Mb=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Nb="YYYY-MM-DDTHH:mm:ssZ",Ob=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],Pb=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],Qb=/([\+\-]|\d\d)/gi,Rb="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),Sb={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},Tb={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},Ub={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},Vb={},Wb="DDD w W M D d".split(" "),Xb="M D H h m s w W".split(" "),Yb={M:function(){return this.month()+1},MMM:function(a){return this.lang().monthsShort(this,a)},MMMM:function(a){return this.lang().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.lang().weekdaysMin(this,a)},ddd:function(a){return this.lang().weekdaysShort(this,a)},dddd:function(a){return this.lang().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return k(this.year()%100,2)},YYYY:function(){return k(this.year(),4)},YYYYY:function(){return k(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+k(Math.abs(a),6)},gg:function(){return k(this.weekYear()%100,2)},gggg:function(){return k(this.weekYear(),4)},ggggg:function(){return k(this.weekYear(),5)},GG:function(){return k(this.isoWeekYear()%100,2)},GGGG:function(){return k(this.isoWeekYear(),4)},GGGGG:function(){return k(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return s(this.milliseconds()/100)},SS:function(){return k(s(this.milliseconds()/10),2)},SSS:function(){return k(this.milliseconds(),3)},SSSS:function(){return k(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+k(s(a/60),2)+":"+k(s(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+k(s(a/60),2)+k(s(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},Zb=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];Wb.length;)eb=Wb.pop(),Yb[eb+"o"]=d(Yb[eb],eb);for(;Xb.length;)eb=Xb.pop(),Yb[eb+eb]=c(Yb[eb],2);for(Yb.DDDD=c(Yb.DDD,3),h(e.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c,d;for(this._monthsParse||(this._monthsParse=[]),b=0;12>b;b++)if(this._monthsParse[b]||(c=db.utc([2e3,b]),d="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=new RegExp(d.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=db([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"==typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return Y(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),db=function(c,d,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._i=c,g._f=d,g._l=e,g._strict=f,g._isUTC=!1,g._pf=b(),$(g)},db.utc=function(c,d,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=e,g._i=c,g._f=d,g._strict=f,g._pf=b(),$(g).utc()},db.unix=function(a){return db(1e3*a)},db.duration=function(a,b){var c,d,e,f=a,h=null;return db.isDuration(a)?f={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(f={},b?f[b]=a:f.milliseconds=a):(h=tb.exec(a))?(c="-"===h[1]?-1:1,f={y:0,d:s(h[kb])*c,h:s(h[lb])*c,m:s(h[mb])*c,s:s(h[nb])*c,ms:s(h[ob])*c}):(h=ub.exec(a))&&(c="-"===h[1]?-1:1,e=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*c},f={y:e(h[2]),M:e(h[3]),d:e(h[4]),h:e(h[5]),m:e(h[6]),s:e(h[7]),w:e(h[8])}),d=new g(f),db.isDuration(a)&&a.hasOwnProperty("_lang")&&(d._lang=a._lang),d},db.version=fb,db.defaultFormat=Nb,db.updateOffset=function(){},db.lang=function(a,b){var c;return a?(b?A(y(a),b):null===b?(B(a),a="en"):pb[a]||C(a),c=db.duration.fn._lang=db.fn._lang=C(a),c._abbr):db.fn._lang._abbr},db.langData=function(a){return a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr),C(a)},db.isMoment=function(a){return a instanceof f||null!=a&&a.hasOwnProperty("_isAMomentObject")},db.isDuration=function(a){return a instanceof g},eb=Zb.length-1;eb>=0;--eb)r(Zb[eb]);for(db.normalizeUnits=function(a){return p(a)},db.invalid=function(a){var b=db.utc(0/0);return null!=a?h(b._pf,a):b._pf.userInvalidated=!0,b},db.parseZone=function(a){return db(a).parseZone()},h(db.fn=f.prototype,{clone:function(){return db(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=db(this).utc();return 0<a.year()&&a.year()<=9999?F(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):F(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return x(this)},isDSTShifted:function(){return this._a?this.isValid()&&o(this._a,(this._isUTC?db.utc(this._a):db(this._a)).toArray())>0:!1},parsingFlags:function(){return h({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(){return this.zone(0)},local:function(){return this.zone(0),this._isUTC=!1,this},format:function(a){var b=F(this,a||db.defaultFormat);return this.lang().postformat(b)},add:function(a,b){var c;return c="string"==typeof a?db.duration(+b,a):db.duration(a,b),l(this,c,1),this},subtract:function(a,b){var c;return c="string"==typeof a?db.duration(+b,a):db.duration(a,b),l(this,c,-1),this},diff:function(a,b,c){var d,e,f=z(a,this),g=6e4*(this.zone()-f.zone());return b=p(b),"year"===b||"month"===b?(d=432e5*(this.daysInMonth()+f.daysInMonth()),e=12*(this.year()-f.year())+(this.month()-f.month()),e+=(this-db(this).startOf("month")-(f-db(f).startOf("month")))/d,e-=6e4*(this.zone()-db(this).startOf("month").zone()-(f.zone()-db(f).startOf("month").zone()))/d,"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:j(e)},from:function(a,b){return db.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)},fromNow:function(a){return this.from(db(),a)},calendar:function(){var a=z(db(),this).startOf("day"),b=this.diff(a,"days",!0),c=-6>b?"sameElse":-1>b?"lastWeek":0>b?"lastDay":1>b?"sameDay":2>b?"nextDay":7>b?"nextWeek":"sameElse";return this.format(this.lang().calendar(c,this))},isLeapYear:function(){return v(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=V(a,this.lang()),this.add({d:a-b})):b},month:function(a){var b,c=this._isUTC?"UTC":"";return null!=a?"string"==typeof a&&(a=this.lang().monthsParse(a),"number"!=typeof a)?this:(b=this.date(),this.date(1),this._d["set"+c+"Month"](a),this.date(Math.min(b,this.daysInMonth())),db.updateOffset(this),this):this._d["get"+c+"Month"]()},startOf:function(a){switch(a=p(a)){case"year":this.month(0);case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),this},endOf:function(a){return a=p(a),this.startOf(a).add("isoWeek"===a?"week":a,1).subtract("ms",1)},isAfter:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)>+db(a).startOf(b)},isBefore:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)<+db(a).startOf(b)},isSame:function(a,b){return b=b||"ms",+this.clone().startOf(b)===+z(a,this).startOf(b)},min:function(a){return a=db.apply(null,arguments),this>a?this:a},max:function(a){return a=db.apply(null,arguments),a>this?this:a},zone:function(a){var b=this._offset||0;return null==a?this._isUTC?b:this._d.getTimezoneOffset():("string"==typeof a&&(a=I(a)),Math.abs(a)<16&&(a=60*a),this._offset=a,this._isUTC=!0,b!==a&&l(this,db.duration(b-a,"m"),1,!0),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.zone(this._tzm):"string"==typeof this._i&&this.zone(this._i),this},hasAlignedHourOffset:function(a){return a=a?db(a).zone():0,(this.zone()-a)%60===0},daysInMonth:function(){return t(this.year(),this.month())},dayOfYear:function(a){var b=hb((db(this).startOf("day")-db(this).startOf("year"))/864e5)+1;return null==a?b:this.add("d",a-b)},quarter:function(){return Math.ceil((this.month()+1)/3)},weekYear:function(a){var b=Y(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==a?b:this.add("y",a-b)},isoWeekYear:function(a){var b=Y(this,1,4).year;return null==a?b:this.add("y",a-b)},week:function(a){var b=this.lang().week(this);return null==a?b:this.add("d",7*(a-b))},isoWeek:function(a){var b=Y(this,1,4).week;return null==a?b:this.add("d",7*(a-b))},weekday:function(a){var b=(this.day()+7-this.lang()._week.dow)%7;return null==a?b:this.add("d",a-b)},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},get:function(a){return a=p(a),this[a]()},set:function(a,b){return a=p(a),"function"==typeof this[a]&&this[a](b),this},lang:function(b){return b===a?this._lang:(this._lang=C(b),this)}}),eb=0;eb<Rb.length;eb++)_(Rb[eb].toLowerCase().replace(/s$/,""),Rb[eb]);_("year","FullYear"),db.fn.days=db.fn.day,db.fn.months=db.fn.month,db.fn.weeks=db.fn.week,db.fn.isoWeeks=db.fn.isoWeek,db.fn.toJSON=db.fn.toISOString,h(db.duration.fn=g.prototype,{_bubble:function(){var a,b,c,d,e=this._milliseconds,f=this._days,g=this._months,h=this._data;h.milliseconds=e%1e3,a=j(e/1e3),h.seconds=a%60,b=j(a/60),h.minutes=b%60,c=j(b/60),h.hours=c%24,f+=j(c/24),h.days=f%30,g+=j(f/30),h.months=g%12,d=j(g/12),h.years=d},weeks:function(){return j(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*s(this._months/12)},humanize:function(a){var b=+this,c=X(b,!a,this.lang());return a&&(c=this.lang().pastFuture(b,c)),this.lang().postformat(c)},add:function(a,b){var c=db.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=db.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=p(a),this[a.toLowerCase()+"s"]()},as:function(a){return a=p(a),this["as"+a.charAt(0).toUpperCase()+a.slice(1)+"s"]()},lang:db.fn.lang,toIsoString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"}});for(eb in Sb)Sb.hasOwnProperty(eb)&&(bb(eb,Sb[eb]),ab(eb.toLowerCase()));bb("Weeks",6048e5),db.duration.fn.asMonths=function(){return(+this-31536e6*this.years())/2592e6+12*this.years()},db.lang("en",{ordinal:function(a){var b=a%10,c=1===s(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),rb?(module.exports=db,cb(!0)):"function"==typeof define&&define.amd?define("moment",function(b,c,d){return d.config&&d.config()&&d.config().noGlobal!==!0&&cb(d.config().noGlobal===a),db}):cb()}).call(this);
/*!
* numeral.js
* version : 1.5.3
* author : Adam Draper
* license : MIT
* http://adamwdraper.github.com/Numeral-js/
*/
(function () { function a(a) { this._value = a } function b(a, b, c, d) { var e, f, g = Math.pow(10, b); return f = (c(a * g) / g).toFixed(b), d && (e = new RegExp("0{1," + d + "}$"), f = f.replace(e, "")), f } function c(a, b, c) { var d; return d = b.indexOf("$") > -1 ? e(a, b, c) : b.indexOf("%") > -1 ? f(a, b, c) : b.indexOf(":") > -1 ? g(a, b) : i(a._value, b, c) } function d(a, b) { var c, d, e, f, g, i = b, j = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], k = !1; if (b.indexOf(":") > -1) a._value = h(b); else if (b === q) a._value = 0; else { for ("." !== o[p].delimiters.decimal && (b = b.replace(/\./g, "").replace(o[p].delimiters.decimal, ".")), c = new RegExp("[^a-zA-Z]" + o[p].abbreviations.thousand + "(?:\\)|(\\" + o[p].currency.symbol + ")?(?:\\))?)?$"), d = new RegExp("[^a-zA-Z]" + o[p].abbreviations.million + "(?:\\)|(\\" + o[p].currency.symbol + ")?(?:\\))?)?$"), e = new RegExp("[^a-zA-Z]" + o[p].abbreviations.billion + "(?:\\)|(\\" + o[p].currency.symbol + ")?(?:\\))?)?$"), f = new RegExp("[^a-zA-Z]" + o[p].abbreviations.trillion + "(?:\\)|(\\" + o[p].currency.symbol + ")?(?:\\))?)?$"), g = 0; g <= j.length && !(k = b.indexOf(j[g]) > -1 ? Math.pow(1024, g + 1) : !1); g++); a._value = (k ? k : 1) * (i.match(c) ? Math.pow(10, 3) : 1) * (i.match(d) ? Math.pow(10, 6) : 1) * (i.match(e) ? Math.pow(10, 9) : 1) * (i.match(f) ? Math.pow(10, 12) : 1) * (b.indexOf("%") > -1 ? .01 : 1) * ((b.split("-").length + Math.min(b.split("(").length - 1, b.split(")").length - 1)) % 2 ? 1 : -1) * Number(b.replace(/[^0-9\.]+/g, "")), a._value = k ? Math.ceil(a._value) : a._value } return a._value } function e(a, b, c) { var d, e, f = b.indexOf("$"), g = b.indexOf("("), h = b.indexOf("-"), j = ""; return b.indexOf(" $") > -1 ? (j = " ", b = b.replace(" $", "")) : b.indexOf("$ ") > -1 ? (j = " ", b = b.replace("$ ", "")) : b = b.replace("$", ""), e = i(a._value, b, c), 1 >= f ? e.indexOf("(") > -1 || e.indexOf("-") > -1 ? (e = e.split(""), d = 1, (g > f || h > f) && (d = 0), e.splice(d, 0, o[p].currency.symbol + j), e = e.join("")) : e = o[p].currency.symbol + j + e : e.indexOf(")") > -1 ? (e = e.split(""), e.splice(-1, 0, j + o[p].currency.symbol), e = e.join("")) : e = e + j + o[p].currency.symbol, e } function f(a, b, c) { var d, e = "", f = 100 * a._value; return b.indexOf(" %") > -1 ? (e = " ", b = b.replace(" %", "")) : b = b.replace("%", ""), d = i(f, b, c), d.indexOf(")") > -1 ? (d = d.split(""), d.splice(-1, 0, e + "%"), d = d.join("")) : d = d + e + "%", d } function g(a) { var b = Math.floor(a._value / 60 / 60), c = Math.floor((a._value - 60 * b * 60) / 60), d = Math.round(a._value - 60 * b * 60 - 60 * c); return b + ":" + (10 > c ? "0" + c : c) + ":" + (10 > d ? "0" + d : d) } function h(a) { var b = a.split(":"), c = 0; return 3 === b.length ? (c += 60 * Number(b[0]) * 60, c += 60 * Number(b[1]), c += Number(b[2])) : 2 === b.length && (c += 60 * Number(b[0]), c += Number(b[1])), Number(c) } function i(a, c, d) { var e, f, g, h, i, j, k = !1, l = !1, m = !1, n = "", r = !1, s = !1, t = !1, u = !1, v = !1, w = "", x = "", y = Math.abs(a), z = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], A = "", B = !1; if (0 === a && null !== q) return q; if (c.indexOf("(") > -1 ? (k = !0, c = c.slice(1, -1)) : c.indexOf("+") > -1 && (l = !0, c = c.replace(/\+/g, "")), c.indexOf("a") > -1 && (r = c.indexOf("aK") >= 0, s = c.indexOf("aM") >= 0, t = c.indexOf("aB") >= 0, u = c.indexOf("aT") >= 0, v = r || s || t || u, c.indexOf(" a") > -1 ? (n = " ", c = c.replace(" a", "")) : c = c.replace("a", ""), y >= Math.pow(10, 12) && !v || u ? (n += o[p].abbreviations.trillion, a /= Math.pow(10, 12)) : y < Math.pow(10, 12) && y >= Math.pow(10, 9) && !v || t ? (n += o[p].abbreviations.billion, a /= Math.pow(10, 9)) : y < Math.pow(10, 9) && y >= Math.pow(10, 6) && !v || s ? (n += o[p].abbreviations.million, a /= Math.pow(10, 6)) : (y < Math.pow(10, 6) && y >= Math.pow(10, 3) && !v || r) && (n += o[p].abbreviations.thousand, a /= Math.pow(10, 3))), c.indexOf("b") > -1) for (c.indexOf(" b") > -1 ? (w = " ", c = c.replace(" b", "")) : c = c.replace("b", ""), g = 0; g <= z.length; g++) if (e = Math.pow(1024, g), f = Math.pow(1024, g + 1), a >= e && f > a) { w += z[g], e > 0 && (a /= e); break } return c.indexOf("o") > -1 && (c.indexOf(" o") > -1 ? (x = " ", c = c.replace(" o", "")) : c = c.replace("o", ""), x += o[p].ordinal(a)), c.indexOf("[.]") > -1 && (m = !0, c = c.replace("[.]", ".")), h = a.toString().split(".")[0], i = c.split(".")[1], j = c.indexOf(","), i ? (i.indexOf("[") > -1 ? (i = i.replace("]", ""), i = i.split("["), A = b(a, i[0].length + i[1].length, d, i[1].length)) : A = b(a, i.length, d), h = A.split(".")[0], A = A.split(".")[1].length ? o[p].delimiters.decimal + A.split(".")[1] : "", m && 0 === Number(A.slice(1)) && (A = "")) : h = b(a, null, d), h.indexOf("-") > -1 && (h = h.slice(1), B = !0), j > -1 && (h = h.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + o[p].delimiters.thousands)), 0 === c.indexOf(".") && (h = ""), (k && B ? "(" : "") + (!k && B ? "-" : "") + (!B && l ? "+" : "") + h + A + (x ? x : "") + (n ? n : "") + (w ? w : "") + (k && B ? ")" : "") } function j(a, b) { o[a] = b } function k(a) { var b = a.toString().split("."); return b.length < 2 ? 1 : Math.pow(10, b[1].length) } function l() { var a = Array.prototype.slice.call(arguments); return a.reduce(function (a, b) { var c = k(a), d = k(b); return c > d ? c : d }, -1 / 0) } var m, n = "1.5.3", o = {}, p = "en", q = null, r = "0,0", s = "undefined" != typeof module && module.exports; m = function (b) { return m.isNumeral(b) ? b = b.value() : 0 === b || "undefined" == typeof b ? b = 0 : Number(b) || (b = m.fn.unformat(b)), new a(Number(b)) }, m.version = n, m.isNumeral = function (b) { return b instanceof a }, m.language = function (a, b) { if (!a) return p; if (a && !b) { if (!o[a]) throw new Error("Unknown language : " + a); p = a } return (b || !o[a]) && j(a, b), m }, m.languageData = function (a) { if (!a) return o[p]; if (!o[a]) throw new Error("Unknown language : " + a); return o[a] }, m.language("en", { delimiters: { thousands: ",", decimal: "." }, abbreviations: { thousand: "k", million: "m", billion: "b", trillion: "t" }, ordinal: function (a) { var b = a % 10; return 1 === ~ ~(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th" }, currency: { symbol: "$"} }), m.zeroFormat = function (a) { q = "string" == typeof a ? a : null }, m.defaultFormat = function (a) { r = "string" == typeof a ? a : "0.0" }, "function" != typeof Array.prototype.reduce && (Array.prototype.reduce = function (a, b) { "use strict"; if (null === this || "undefined" == typeof this) throw new TypeError("Array.prototype.reduce called on null or undefined"); if ("function" != typeof a) throw new TypeError(a + " is not a function"); var c, d, e = this.length >>> 0, f = !1; for (1 < arguments.length && (d = b, f = !0), c = 0; e > c; ++c) this.hasOwnProperty(c) && (f ? d = a(d, this[c], c, this) : (d = this[c], f = !0)); if (!f) throw new TypeError("Reduce of empty array with no initial value"); return d }), m.fn = a.prototype = { clone: function () { return m(this) }, format: function (a, b) { return c(this, a ? a : r, void 0 !== b ? b : Math.round) }, unformat: function (a) { return "[object Number]" === Object.prototype.toString.call(a) ? a : d(this, a ? a : r) }, value: function () { return this._value }, valueOf: function () { return this._value }, set: function (a) { return this._value = Number(a), this }, add: function (a) { function b(a, b) { return a + c * b } var c = l.call(null, this._value, a); return this._value = [this._value, a].reduce(b, 0) / c, this }, subtract: function (a) { function b(a, b) { return a - c * b } var c = l.call(null, this._value, a); return this._value = [a].reduce(b, this._value * c) / c, this }, multiply: function (a) { function b(a, b) { var c = l(a, b); return a * c * b * c / (c * c) } return this._value = [this._value, a].reduce(b, 1), this }, divide: function (a) { function b(a, b) { var c = l(a, b); return a * c / (b * c) } return this._value = [this._value, a].reduce(b), this }, difference: function (a) { return Math.abs(m(this._value).subtract(a).value()) } }, s && (module.exports = m), "undefined" == typeof ender && (this.numeral = m), "function" == typeof define && define.amd && define([], function () { return m }) }).call(this);