/// <reference path="/@JSense.js" />
"use strict";
/*exported MultiSelectControl*/

var MultiSelectControl = function () {
    var $this = this;

    var setting =
    {
        ContainerId: "multi-select-control",
        IdProperty: "EntityId",
        NameProperty: "EntityName",
        ParentIdProperty: "ParentId",
        SelectedParentIdList: "",
        SelectedChildIdList: "",
        ControlWidth: 210,
        ControlHeight: 400,
        DefaultData: null,
        IsSearch: true,
        IsDefaultShow: false,
        IsCloseControlWhenBlur: false,
        SelectedAllText: "",
        NoItemText: "No item found!",
        SelectedText: "{0}",
        FilterEmptyText: "Please select!",
        IsFilterAllLevel: false,
        OnParentCheckFunction: "",
        OnChildCheckFunction: ""
    };

    var initEvent = function () {
        //expand filter
        $("#" + setting.ContainerId + " #btn-expand-filter").on("click", function () {
            if ($("#" + setting.ContainerId + " " + ".control-filter").css("display") === "block") {
                closeFilter();
            } else {
                openFilter();
            }
        });

        $("#" + setting.ContainerId + " .control-header").on("click", function () {
            if ($("#" + setting.ContainerId + " " + ".control-filter").css("display") === "block") {
                closeFilter();
            } else {
                openFilter();
            }
        });

        // on blur control
        $("#" + setting.ContainerId).on("mouseleave", function () {
            if (setting.IsCloseControlWhenBlur) {
                closeFilter();
            }
        });

        //close filter
        $("#" + setting.ContainerId + " #btn-close-filter").on("click", function () {
            $("#" + setting.ContainerId + " #filter-text").val("Enter keywords");
            $("#" + setting.ContainerId + " #filter-text").attr("class", "filter-text");
            filterTextChanged("");
        });

        // filter text changed
        $("#" + setting.ContainerId + " #filter-text").on("focus", function () {
            var text = $(this).val();
            if (text === "Enter keywords") {
                $(this).val("");
                $(this).attr("class", "filter-text-onchange");
            }
        });

        $("#" + setting.ContainerId + " " + "#filter-text").on("blur", function () {
            var text = $(this).val();
            if (text === "") {
                $(this).val("Enter keywords");
                $(this).attr("class", "filter-text");
            }
        });

        $("#" + setting.ContainerId + " " + "#filter-text").keyup(function () {
            filterTextChanged($(this).val().toLowerCase());
        });

        //check all
        $("#" + setting.ContainerId + " " + "#btn-check-all").on("click", function () {
            $("#" + setting.ContainerId + " " + ".control-filter input[type=checkbox]").prop("checked", true);
            setFilterHeaderText();
        });

        //uncheck all
        $("#" + setting.ContainerId + " " + "#btn-uncheck-all").on("click", function () {
            $("#" + setting.ContainerId + " " + ".control-filter input[type=checkbox]").prop("checked", false);
            setFilterHeaderText();
        });

        // parent checked
        $("#" + setting.ContainerId + " " + ".parent").on("click", function () {
            var parentId = parseInt($(this).attr("data-parent-id"), 10);
            var checkStatus = $(this).is(':checked');

            $("#" + setting.ContainerId + " " + ".parent-" + parentId).prop("checked", checkStatus);
            setFilterHeaderText();

            try {
                eval(setting.OnParentCheckFunction); // jshint ignore:line
            }
            catch (error) {
                console.log(error);
            }
        });

        // child checked
        $("#" + setting.ContainerId + " " + ".child").on("click", function () {
            var parentId = parseInt($(this).attr("data-parent-id"), 10);
            var childCount = $("#" + setting.ContainerId + " " + ".parent-" + parentId).length;
            var childCheckedCount = $("#" + setting.ContainerId + " " + ".parent-" + parentId + "[type='checkbox']:checked").length;
            $("#" + setting.ContainerId + " " + "#parent-" + parentId).prop("checked", childCheckedCount === childCount);
            setFilterHeaderText();

            try {
                eval(setting.OnChildCheckFunction); // jshint ignore:line
            }
            catch (error) {
                console.log(error);
            }
        });
    };

    var openFilter = function (isDefaultShow) {
        $("#" + setting.ContainerId + " " + ".control-filter").show();
        var minHeight = $("#" + setting.ContainerId + " " + ".control-filter").height() + 40;
        var height = setting.ControlHeight + 25 + 40 + (setting.IsSearch ? 20 : 0);
        $("#" + setting.ContainerId + " " + ".multi-select-control").height(isDefaultShow ? height : minHeight);
        $("#btn-expand-filter").addClass("arrow-collapse");
        $("#btn-expand-filter").removeClass("arrow-expand");
    };

    var closeFilter = function () {
        $("#" + setting.ContainerId + " " + ".multi-select-control").height(25);
        $("#" + setting.ContainerId + " " + ".control-filter").hide();
        $("#btn-expand-filter").addClass("arrow-expand");
        $("#btn-expand-filter").removeClass("arrow-collapse");
    };

    var setFilterHeaderText = function () {
        var parentChecked = $("#" + setting.ContainerId + " " + ".parent[type='checkbox']:checked").length;
        var parents = $("#" + setting.ContainerId + " " + ".parent[type='checkbox']").length;
        if (parents === 0) {
            $("#" + setting.ContainerId + " " + ".control-header").html(setting.NoItemText);
        }
        else {
            if (parentChecked === parents) {
                $("#" + setting.ContainerId + " " + ".control-header").html(setting.SelectedAllText);
            }
            else {
                var childChecked = $("#" + setting.ContainerId + " " + ".child[type='checkbox']:checked").length;
                var headerText = "";
                if (parentChecked === 0 && childChecked === 0) {
                    headerText = setting.FilterEmptyText;
                }
                else if (setting.IsFilterAllLevel) {
                    headerText = setting.SelectedText.replace("{0}", parentChecked).replace("{1}", childChecked);
                } else {
                    headerText = setting.SelectedText.replace("{0}", childChecked);
                }
                $("#" + setting.ContainerId + " " + ".control-header").html(headerText);
            }
        }
    };

    var filterTextChanged = function (filterText) {
        $("#" + setting.ContainerId + " " + ".child-row").show();
        $("#" + setting.ContainerId + " " + ".child-row input[type='checkbox']").attr("status", "show");
        $("#" + setting.ContainerId + " " + ".parent-row").show();
        $("#" + setting.ContainerId + " " + ".parent-row input[type='checkbox']").attr("status", "show");

        // filter parent
        var parentNameList = $("#" + setting.ContainerId + " " + ".parent-name");
        for (var j = 0; j < parentNameList.length; j++) {
            var parentIdTag = $(parentNameList[j]).attr("data-for");
            var parentIdVal = $("#" + setting.ContainerId + " #" + parentIdTag).attr("data-parent-id");
            var numOfCheckChild = $("#" + setting.ContainerId + " " + ".parent-" + parentIdVal).length;
            var parentName = $(parentNameList[j]).html().toLowerCase();
            if (numOfCheckChild === 0 && parentName.indexOf(filterText) < 0) {
                $("#" + setting.ContainerId + " " + "#parent-" + parentIdVal).attr("status", "hide");
                $("#" + setting.ContainerId + " " + "#parent-row-" + parentIdVal).hide();
            }
        }

        // filter child
        var childNameList = $("#" + setting.ContainerId + " " + ".child-name");
        for (var i = 0; i < childNameList.length; i++) {
            var childInputTag = $(childNameList[i]).attr("data-for");
            var childId = parseInt($("#" + setting.ContainerId + " " + "#" + childInputTag).attr("data-child-id"), 10);
            var childName = $(childNameList[i]).html().toLowerCase();

            if (childName.indexOf(filterText) < 0) {
                // hide child not contains key words
                var parentNameOfChild = $("#" + setting.ContainerId + " " + "#" + childInputTag).attr("data-parent-name").toLowerCase();
                if (parentNameOfChild.indexOf(filterText) < 0) {
                    $("#" + setting.ContainerId + " " + "#" + childInputTag).attr("status", "hide");
                    $("#" + setting.ContainerId + " " + "#child-row-" + childId).hide();

                    // hide parent if its child hide all.
                    var parentId = parseInt($("#" + setting.ContainerId + " " + "#" + childInputTag).attr("data-parent-id"), 10);
                    var numOfChild = $("#" + setting.ContainerId + " " + ".parent-" + parentId).length;
                    var numOfHideChild = $("#" + setting.ContainerId + " " + ".parent-" + parentId + "[status='hide']").length;

                    if (numOfHideChild === numOfChild) {
                        $("#" + setting.ContainerId + " " + "#parent-" + parentId).attr("status", "hide");
                        $("#" + setting.ContainerId + " " + "#parent-row-" + parentId).hide();
                    }
                }
            }
        }

        openFilter();
        setFilterHeaderText();
    };

    $this.renderControl = function (option) {
        /// <summary>
        /// Render Control.
        /// </summary>
        /// <param name="option">Option</param>
        $.extend(setting, option);
        if (setting.DefaultData == null || setting.DefaultData == undefined) {// jshint ignore:line
            return;
        }
        // control header
        var parentIdArray = setting.SelectedParentIdList.split(",");
        var childIdArray = setting.SelectedChildIdList.split(",");
        var controlHtml = '<div class="multi-select-control" style="width:' + setting.ControlWidth + 'px;">';
        controlHtml += '<div class="control-header">' + setting.SelectedAllText + '</div>';
        controlHtml += '<div id="btn-expand-filter" class="arrow-expand icon" title="Click to expand the selector."></div>';
        controlHtml += '<div class="control-filter">';

        // show search textbox
        if (setting.IsSearch) {
            controlHtml += '<span class="filter-header">Filter: </span><input type="text" class="filter-text" id="filter-text" value="Enter keywords" />';
            // clear filter textbox.
            controlHtml += '<div class="close-filter icon" id="btn-close-filter" title="Click to clear the keywords."></div>';
        }

        // check all & uncheck all element.
        controlHtml += '<table><tr><td><div class="check-all icon"></div></td><td><span id="btn-check-all" class="btn-check">Check all</span></td>';
        controlHtml += '<td><div class="uncheck-all icon"></div></td><td><span id="btn-uncheck-all" class="btn-check">Uncheck all</span></td></tr></table>';

        // break line.
        controlHtml += '<hr />';

        // checkbox list.
        controlHtml += '<div class="checkbox-tree" style="margin-top: -5px;max-height:' + setting.ControlHeight + 'px"><table width="100%">';
        for (var i = 0; i < setting.DefaultData.length; i++) {
            if (setting.DefaultData[i][setting.ParentIdProperty] === 0) {
                var parent = setting.DefaultData[i];
                var check = '';
                if (parentIdArray.indexOf(parent[setting.IdProperty].toString()) >= 0) {
                    check = 'checked="checked"';
                } else {
                    check = '';
                }
                controlHtml += '<tr id="parent-row-' + parent[setting.IdProperty] + '" class="parent-row"><td style="width: 30px;">';
                controlHtml += '<input type="checkbox" data-parent-id="' + parent[setting.IdProperty] + '" data-parent-name="' + parent[setting.NameProperty]
                            + '" id="parent-' + parent[setting.IdProperty] + '" class="parent" status="show" ' + check + '/>';
                controlHtml += '</td><td colspan="2"><label class="parent-name" data-for="parent-' + parent[setting.IdProperty] + '">' + parent[setting.NameProperty] + '</label></td></tr>';

                for (var j = 0; j < setting.DefaultData.length; j++) {
                    if (setting.DefaultData[j][setting.ParentIdProperty] === parent[setting.IdProperty]) {
                        var child = setting.DefaultData[j];
                        if (childIdArray.indexOf(child[setting.IdProperty].toString()) >= 0) { // jshint ignore:line
                            check = 'checked="checked"';
                        } else { // jshint ignore:line
                            check = '';
                        }
                        controlHtml += '<tr id="child-row-' + child[setting.IdProperty]
                                    + '" class="child-row"><td style="text-align:center;"></td><td style="width: 30px;">';
                        controlHtml += '<input type="checkbox" data-child-id="' + child[setting.IdProperty] + '" data-parent-name="'
                                    + parent[setting.NameProperty] + '" data-child-name="' + child[setting.NameProperty] + '" data-parent-id="'
                                    + parent[setting.IdProperty] + '" id="child-' + child[setting.IdProperty] + '" class="parent-'
                                    + parent[setting.IdProperty] + ' child" status="show" ' + check + '/>';
                        controlHtml += '</td><td><label class="child-name" data-for="child-' + child[setting.IdProperty] + '">' + child[setting.NameProperty] + '</label></td></tr>';
                    }
                }
            }
        }

        controlHtml += '</table></div></div></div>';
        $('#' + setting.ContainerId).html(controlHtml);
        initEvent();
        setFilterHeaderText();
        if (setting.IsDefaultShow) {
            openFilter(setting.IsDefaultShow);
        }
    };

    $this.getParentFilterId = function () {
        /// <summary>
        /// Get parent filter ID.
        /// </summary>
        /// <returns type="">ID Array</returns>
        var parentIdList = [];
        var parentCheckedList = $("#" + setting.ContainerId + " " + ".parent[type='checkbox']:checked");
        for (var i = 0; i < parentCheckedList.length; i++) {
            var parentId = $(parentCheckedList[i]).attr("data-parent-id");
            parentIdList.push(parentId);
        }
        return parentIdList;
    };

    $this.getParentFilterName = function () {
        /// <summary>
        /// Get parent filter Name.
        /// </summary>
        /// <returns type="">Name Array</returns>
        var parentNameList = [];
        var parentCheckedList = $("#" + setting.ContainerId + " " + ".parent[type='checkbox']:checked");
        for (var i = 0; i < parentCheckedList.length; i++) {
            var parentName = $(parentCheckedList[i]).attr("data-parent-name");
            parentNameList.push(parentName);
        }
        return parentNameList;
    };

    $this.getChildFilterId = function () {
        /// <summary>
        /// Get child filter ID.
        /// </summary>
        /// <returns type="">ID Array</returns>
        var SeletedChildIdList = [];
        var childCheckedList = $("#" + setting.ContainerId + " " + ".child[type='checkbox']:checked");
        for (var i = 0; i < childCheckedList.length; i++) {
            var childId = $(childCheckedList[i]).attr("data-child-id");
            SeletedChildIdList.push(childId);
        }
        return SeletedChildIdList;
    };

    $this.getChildFilterName = function () {
        /// <summary>
        /// Get child filter Name.
        /// </summary>
        /// <returns type="">Name Array</returns>
        var childNameList = [];
        var childCheckedList = $("#" + setting.ContainerId + " " + ".child[type='checkbox']:checked");
        for (var i = 0; i < childCheckedList.length; i++) {
            var childName = $(childCheckedList[i]).attr("data-child-name");
            childNameList.push(childName);
        }
        return childNameList;
    };
};