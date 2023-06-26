/*global angular */
(function () {
    "use strict";
    angular.module('fanex.dropdowntreesingle', [])
        .filter("itemFormatFilter", function () {
            return function (value, item, level, formatCallback) {
                return formatCallback ? formatCallback(value, item.model, level) : value;
            };
        })
        .provider('dropdowntreesingleConfig', function () {
            var config = {
                disabledParent: true,
                collapsedAll: false, // temp setting, not 2 way binding
                hasFilter: false, // default not support search
                hasToolbar: true,
                hasEnter: true,
                idMember: "id",
                nameMember: "name",
                selectedMember: null,
                dataMember: null,
                childrenMember: "children",
                itemFormatter: null,
                templateUrl: "fanex.directive.dropdowntreesingle.template.html",
                sourceData: null,
                selectedFilter: null, // function to checked item
                width: 250,
                height: null, // auto
                maxTextLength: 100,
                selectedTextLength: 30
            };
            return {
                set: function (options) {
                    angular.extend(config, options);
                },
                $get: function () {
                    return angular.extend({}, config);
                }
            };
        })
        .directive('dropdowntreesingle', ['$timeout', '$parse', '$compile', '$http', '$filter', 'dropdowntreesingleConfig',
            function ($timeout, $parse, $compile, $http, $filter, dropdowntreeConfig) {
                function containsText(item, searchText, correctSearch) {
                    var found = containsAny(item, searchText, correctSearch);

                    if (!found && item.children) {
                        for (var i = 0; i < item.children.length; i++) {
                            found = containsText(item.children[i], searchText, correctSearch);
                            if (found) {
                                break;
                            }
                        }
                    }

                    return found;
                }

                function containsAny(item, searchText, correctSearch) {
                    var searchTexts = searchText.split(",");
                    var found = false;
                    for (var i = 0; i < searchTexts.length; i++) {
                        if (correctSearch && searchTexts.length > 1) {
                            found = item.label.toLowerCase() == searchTexts[i].trim().toLowerCase();
                        } else {
                            found = item.label.toLowerCase().indexOf(searchTexts[i].trim().toLowerCase()) > -1;
                        }
                        if (found) {
                            break;
                        }
                    }

                    return found;
                }

                function createDropDownModelItem(settings, modelItem) {
                    var itemLabel = modelItem[settings.nameMember];
                    var item = {
                        id: settings.idMember ? modelItem[settings.idMember] : undefined,
                        label: itemLabel ? itemLabel.substr(0, settings.maxTextLength) : '',
                        model: modelItem,
                        selected: modelItem.selected === true ||
                            (settings.selectedFilter && settings.selectedFilter(modelItem)),
                        disabled: modelItem.disabled === true,
                        cssClass: modelItem.cssClass,
                        showChildren: true,
                        subInfoClass: modelItem.SubInfoClass,
                        subInfoText: modelItem.SubInfoText
                    };

                    if (modelItem[settings.childrenMember]) {
                        item.children = [];
                        var children = modelItem[settings.childrenMember];
                        var length = children.length;
                        for (var i = 0; i < length; i++) {
                            var child = createDropDownModelItem(settings, children[i]);
                            child.parent = item;
                            item.children.push(child);
                        }
                    }

                    return item;
                }

                // RETURN
                return {
                    restrict: 'E',
                    require: 'ngModel',
                    scope: {
                        selectedItemModel: "=ngModel",
                        settings: "=?",
                        textSettings: "=?",
                        invalidSearch: "=?ngInvalidSearch",
                        ngOnOpen: "&",
                        ngOnClose: "&",
                        ngChange: "&",
                        disabled: '=ngDisabled'
                    },
                    link: function (scope, element, attrs, modelCtrl) {
                        var required = attrs.required || attrs.ngRequired;
                        var changeHandler = scope.ngChange || angular.noop; // $parse(attrs.change)(scope) || angular.noop;

                        var _selectedItemLabel;

                        scope._settings = scope._settings = angular.extend({}, dropdowntreeConfig);
                        scope._textSettings = {};

                        scope.searchText = {
                            value: ""
                        };
                        scope.collapsedAll = false;
                        scope.items = []; // dropdown model items
                        scope.header = "";
                        var _isWatchSelectedItem = true;
                        var _isInnerSelectedItem = false;

                        // scope.disabled = angular.isDefined(attrs.disabled) || $parse(attrs.ngDisabled)(scope);

                        function getSelectedItem(items) {
                            var selectedItemModel;
                            var selectedItemLabel;

                            var length = items ? items.length : 0;
                            for (var i = 0; i < length; i++) {
                                var item = items[i];
                                if (item.selected) {
                                    var cloneItem = angular.copy(item.model, {});
                                    delete cloneItem[scope._settings.childrenMember];
                                    selectedItemModel = scope._settings.selectedMember ?
                                        cloneItem[scope._settings.selectedMember] :
                                        cloneItem;
                                    selectedItemLabel = cloneItem[scope._settings.nameMember]
                                    break;
                                }

                                if (item.children && item.children.length > 0) {
                                    var children = getSelectedItem(item.children);
                                    if (children.itemModel && children.itemLabel) {
                                        selectedItemModel = children.itemModel;
                                        selectedItemLabel = children.itemLabel;
                                        break;
                                    }
                                }
                            }

                            return {
                                itemLabel: selectedItemLabel,
                                itemModel: selectedItemModel
                            };
                        }

                        function parseSourceData(sourceData) {
                            var items = [];
                            if (!sourceData) {
                                return;
                            }
                            var settings = scope._settings;
                            var length = sourceData.length;
                            for (var i = 0; i < length; i++) {
                                var item = createDropDownModelItem(settings, sourceData[i]);
                                items.push(item);
                            }

                            return items;
                        }

                        function getHeaderText() {
                            if (angular.isArray(scope._settings.sourceData) === false || scope._settings.sourceData.length === 0) {
                                return scope._textSettings.NoData;
                            }
                            if (_selectedItemLabel === undefined) {
                                return scope._textSettings.NoItemSelected;
                            }

                            return _selectedItemLabel;
                        }

                        function refreshViewValue(isRefreshSelectedItem) {
                            var data = getSelectedItem(scope.items);
                            _selectedItemLabel = data.itemLabel;

                            if (isRefreshSelectedItem) {
                                scope.selectedItemModel = data.itemModel;
                                modelCtrl.$setViewValue(scope.selectedItemModel);
                            }
                            modelCtrl.$render();
                        }

                        function parseData() {
                            if (scope._settings.dataMember) {
                                scope._settings.sourceData = scope._settings.sourceData[scope._settings.dataMember];
                            }

                            scope.items = parseSourceData(scope._settings.sourceData);

                            if (angular.isDefined(scope.selectedItemModel)) {
                                updateSelectedState(scope.items, scope.selectedItemModel);
                            }

                            var data = getSelectedItem(scope.items);
                            _selectedItemLabel = data.itemLabel;
                            scope.selectedItemModel = data.itemModel;
                        }

                        function updateSelectedState(items, selectedItem) {
                            var idMember = scope._settings.idMember;
                            angular.forEach(items, function (item) {
                                var selected = item.id === selectedItem[idMember] ? true : false;
                                item.selected = selected;

                                if (item.children && item.children.length > 0) {
                                    updateSelectedState(item.children, selectedItem);
                                }
                            });
                        }

                        function validSearchText() {
                            var searchTexts = [];
                            angular.forEach(scope.searchText.value.split(","), function (text) {
                                searchTexts.push(text.trim().toLowerCase());
                            });

                            if (searchTexts.length < 2) {
                                modelCtrl.$setValidity('validSearch', true);
                                return;
                            }

                            var foundTexts = [];

                            angular.forEach(scope.items, function (item) {
                                angular.forEach(item.children, function (child) {
                                    if (searchTexts.includes(child.label.toLowerCase())) {
                                        foundTexts.push(child.label.toLowerCase());
                                    }
                                });
                            });

                            var notFoundTexts = [];
                            angular.forEach(searchTexts, function (text) {
                                if (!foundTexts.includes(text)) {
                                    notFoundTexts.push(text);
                                }
                            });
                            var notFoundTextsStr = notFoundTexts.join(", ");
                            modelCtrl.$setValidity('validSearch', notFoundTextsStr.length == 0);
                            scope.invalidSearch = notFoundTextsStr;
                        }

                        function selectItemBySearchText(items, searchText) {
                            var foundItem = false;
                            angular.forEach(items, function (item) {
                                if (item.label.toLowerCase() === searchText.toLowerCase() && (!scope._settings.disabledParent || item.children === undefined)) {
                                    scope.selectItem(item);
                                    foundItem = true;
                                    return;
                                }
                                selectItemBySearchText(item.children, searchText);
                            });
                            return foundItem;
                        }

                        function startParseData() {
                            $timeout(function () {
                                parseData();
                                scope.toggleCollapseExpanse(scope._settings.collapsedAll);
                                scope.header = getHeaderText();
                            }, 100);
                        }

                        // required validate
                        attrs.$observe('required', function (newVal) {
                            required = newVal;
                        });

                        scope.$watch("settings", function (newValue) {
                            if (!newValue) {
                                return;
                            }

                            scope._settings = angular.extend({}, dropdowntreeConfig, scope.settings);
                            if (typeof scope._settings.itemFormatter === "string") {
                                var filterInstance = $filter(scope._settings.itemFormatter);
                                scope._settings.itemFormatter = function (value, item, level) {
                                    return filterInstance(value, item, level);
                                };
                            }

                            var sourceDataType = typeof scope._settings.sourceData;

                            if (sourceDataType === "string") // url
                            {
                                $http.get(scope._settings.sourceData)
                                    .success(function (response) {
                                        scope._settings.sourceData = response;

                                        startParseData();
                                    });
                            } else if (sourceDataType === "function") // function
                            {
                                scope._settings.sourceData = scope._settings.sourceData();
                                startParseData();
                            } else {
                                startParseData();
                            }
                        });

                        scope.$watch("textSettings", function () {
                            var defaultTextSettings = {
                                Filter: "Filter",
                                CollapseExpanse: "Collapse/Expanse",
                                CollapseBranch: "Collapse/Expanse this branch",
                                NoItemSelected: "Please select ...",
                                NoData: "(No Data)"
                            };

                            scope._textSettings = angular.extend(defaultTextSettings, scope.textSettings);
                            scope.header = getHeaderText();
                        }, true);

                        //watch model change
                        scope.$watch("selectedItemModel", function (newVal) {
                            if (_isWatchSelectedItem === true && scope._settings && angular.isDefined(newVal)) {
                                _isWatchSelectedItem = false;

                                if (_isInnerSelectedItem === false) {
                                    updateSelectedState(scope.items, newVal);
                                    refreshViewValue();
                                    validSearchText();
                                }

                                //changeHandler();

                                scope.header = getHeaderText();
                                modelCtrl.$setValidity('required', scope.valid());
                                _isWatchSelectedItem = true;
                            }
                        });

                        var popup = angular.element('<dropdowntreesingle-popup></dropdowntreesingle-popup>');
                        element.append($compile(popup)(scope));

                        scope.valid = function validModel() {
                            if (!required) {
                                return true;
                            }
                            var value = scope.selectedItemModel;
                            return value !== undefined;
                        };

                        scope.selectItem = function (item) {
                            var selectedItem = {};
                            if (scope._settings.disabledParent && angular.isDefined(item.children)) {
                                return;
                            }

                            selectedItem[scope._settings.idMember] = item.id;
                            updateSelectedState(scope.items, selectedItem);

                            var data = getSelectedItem(scope.items);
                            _selectedItemLabel = data.itemLabel;
                            scope.selectedItemModel = data.itemModel;
                            modelCtrl.$setViewValue(scope.selectedItemModel);
                            scope.toggleSelect();
                        };

                        scope.getCollapseExpandClass = function (item) {
                            if (!item.children || item.children.length === 0) {
                                return 'glyphicon-none';
                            }
                            return item.showChildren ? 'glyphicon-triangle-bottom' : 'glyphicon-triangle-right';
                        };

                        scope.getItemClass = function (item) {
                            return item.disabled ? 'disabled' : item.cssClass;
                        };

                        scope.getExtendItemClass = function (item) {
                            return item.subInfoClass;
                        };

                        scope.toggleCollapseExpanse = function (value) {
                            if (typeof value === "boolean") {
                                scope.collapsedAll = value;
                            } else {
                                scope.collapsedAll = !scope.collapsedAll;
                            }

                            angular.forEach(scope.items, function (item) {
                                item.showChildren = !scope.collapsedAll;
                            });

                            refreshViewValue(true);
                        };

                        scope.filterSearchText = function (item) {
                            var correctSearch = attrs.correctSearch;
                            return scope.searchText.value ? containsText(item, scope.searchText.value, correctSearch) : true;
                        };

                        scope.selectSearchText = function (e) {
                            e.preventDefault();

                            if (!scope._settings.hasEnter) {
                                return;
                            }

                            var searchTexts = [];
                            angular.forEach(scope.searchText.value.split(","), function (text) {
                                searchTexts.push(text.trim().toLowerCase());
                            });

                            var foundItem = selectItemBySearchText(scope.items, searchTexts[0]);

                            var notFoundTextsStr = searchTexts.length > 1
                                ? "don't support selected by searching multiple values"
                                : foundItem ? "" : searchTexts[0];

                            modelCtrl.$setValidity('validSearch', notFoundTextsStr.length == 0);
                            scope.invalidSearch = notFoundTextsStr;

                            refreshViewValue(true);
                        }

                        scope.clearSearchText = function () {
                            scope.searchText.value = "";
                            scope.focusSearchBox();
                            modelCtrl.$setValidity('validSearch', true);
                            scope.invalidSearch = "";
                        };

                        scope.touched = function () {
                            modelCtrl.$setTouched();
                        };
                    }
                };
            }
        ])

        .directive('dropdowntreesinglePopup', ['$document',
            function ($document) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: false,
                    // templateUrl: 'fanex.dropdowntree.template.html',
                    template: '<div><div ng-include="_settings.templateUrl"></div><div>',
                    link: function (scope, element) {
                        var onOpenHandler = scope.ngOnOpen || angular.noop;
                        var onCloseHandler = scope.ngOnClose || angular.noop;
                        var dropdownElement;

                        function isElementInArray(element, elementArray) {
                            for (var i = 0; i < elementArray.length; i++) {
                                if (element === elementArray[i]) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        function assignDropdownElement() {
                            if (!dropdownElement) {
                                dropdownElement = angular.element(element[0].querySelector('.dropdown'));
                            }
                        }

                        scope.toggleSelect = function () {
                            assignDropdownElement();
                            if (dropdownElement.hasClass('open')) {
                                dropdownElement.removeClass('open');
                                $document.unbind('click', clickHandler);
                                onCloseHandler();
                            } else {
                                dropdownElement.addClass('open');
                                $document.bind('click', clickHandler);
                                scope.focusSearchBox();
                                onOpenHandler();
                            }
                        };

                        function clickHandler(event) {
                            if (isElementInArray(event.target, element.find(event.target.tagName))) {
                                return;
                            }
                            dropdownElement.removeClass('open');
                            $document.unbind('click', clickHandler);
                            onCloseHandler();
                            scope.$apply();
                        }

                        scope.focusSearchBox = function focusSearchBox() {
                            var searchBox = dropdownElement.find('input')[0];
                            if (searchBox) {
                                searchBox.focus();
                            }
                        };

                        scope.changeSearchText = function () {
                            if (!scope._settings.hasEnter) {
                                scope.searchText.value = scope.searchText.value.replace(/[, ]+/g, ",").trim().split(',').join(',');
                            }
                        };
                    }
                };
            }
        ]);
}());