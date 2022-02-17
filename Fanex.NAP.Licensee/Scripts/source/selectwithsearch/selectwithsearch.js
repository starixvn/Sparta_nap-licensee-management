/*global angular */
(function () {
    "use strict";
    angular.module('fanex.selectwithsearch', [])
        .filter("itemFormatFilter", function () {
            return function (value, item, level, formatCallback) {
                return formatCallback ? formatCallback(value, item.model, level) : value;
            };
        })
        .provider('selectwithsearchConfig', function () {
            var config = {
                hasFilter: true,
                idMember: "Id",
                nameMember: "name",
                itemFormatter: null,
                templateUrl: "selectwithsearch.template.html",
                sourceData: null,
                //width: 250,
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
        .directive('selectwithsearch', ['$timeout', '$parse', '$compile', '$http', '$filter', 'selectwithsearchConfig',
            function ($timeout, $parse, $compile, $http, $filter, dropdowntreeConfig) {
                function containsText(item, searchText) {
                    var found = item.label.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

                    if (!found && item.children) {
                        for (var i = 0; i < item.children.length; i++) {
                            found = containsText(item.children[i], searchText);
                            if (found) {
                                break;
                            }
                        }
                    }

                    return found;
                }               


                function createDropDownModelItem(settings, modelItem) {
                    var itemLabel = modelItem[settings.nameMember];
                    var item = {
                        Id: settings.idMember ? modelItem[settings.idMember] : undefined,
                        label: itemLabel ? itemLabel.substr(0, settings.maxTextLength) : '',
                        model: modelItem,
                        disabled: modelItem.disabled === true,
                        cssClass: modelItem.cssClass,
                    };

                    return item;
                }

                // RETURN
                return {
                    restrict: 'E',
                    require: 'ngModel',
                    scope: {
                        selectedItems: "=ngModel",
                        settings: "=?",
                        requiredSettings: "=?",
                        textSettings: "=?",
                        ngOnOpen: "&",
                        ngOnClose: "&",
                        ngChange: "&",
                        disabled: '=ngDisabled'
                    },
                    link: function (scope, element, attrs, modelCtrl) {
                        var changeHandler = scope.ngChange || angular.noop; 
                        
                        scope._settings = scope._settings = angular.extend({}, dropdowntreeConfig);
                        scope._textSettings = {};
                        scope._requiredSettings = {};

                        scope.searchText = {
                            value: ""
                        };
                        scope.items = []; // dropdown model items
                        scope.header = "";
                        var _isWatchSelectedItems = true;

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

                        function getHeaderText(selectedItem) {
                            if (!selectedItem || selectedItem.Id == scope._textSettings.NAId) {
                                return scope._textSettings.NAText;
                            }

                            return selectedItem.Name;
                        }

                        function refreshViewValue(isRefreshSelectedItems) {
                            modelCtrl.$setViewValue(scope.selectedItems);                            
                        }

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

                            $timeout(function () {
                                scope.items = parseSourceData(scope._settings.sourceData);
                            }, 100);
                            
                            if (!scope.selectedItems) {
                                scope.selectedItems = {
                                    Id: scope._textSettings.NAId,
                                    Name: scope._textSettings.NAText,
                                    IsNA: true
                                }
                            }
                        });

                        //watch model change
                        scope.$watch("textSettings", function () {
                            var defaultTextSettings = {
                                Filter: "Search",
                                ItemsSelected: "# selected",
                                NAText: "Please select ...",
                                NAId: -1
                            };

                            scope._textSettings = angular.extend(defaultTextSettings, scope.textSettings);
                            scope.header = getHeaderText(scope.selectedItems);
                        }, true);


                        scope.$watch("requiredSettings", function () {
                            var defaultRequiredSettings = {
                                Require: true
                            };

                            scope._requiredSettings = angular.extend(defaultRequiredSettings, scope.requiredSettings);

                        }, true);

                        scope.$watch("selectedItems", function (newVal) {
                            if (_isWatchSelectedItems === true && scope._settings && angular.isDefined(newVal)) {
                                _isWatchSelectedItems = false;

                                scope.validate();
                                changeHandler();
                                scope.header = getHeaderText(scope.selectedItems);                                
                            
                                _isWatchSelectedItems = true;
                            }
                        });

                        var popup = angular.element('<selectwithsearch-popup></selectwithsearch-popup>');
                        element.append($compile(popup)(scope));

                        scope.checkItem = function (item) {
                            scope.selectedItems = {
                                Id: item.Id, 
                                Name: item.label,
                                IsNA: false
                            };
                            refreshViewValue(true);
                            scope.toggleSelect();
                        };

                        scope.checkNA = function () {
                            scope.selectedItems = {
                                Id: scope._textSettings.NAId,
                                Name: scope._textSettings.NAText,
                                IsNA: true
                            }
                            refreshViewValue(true);
                            scope.toggleSelect();
                        }                       

                        scope.getItemClass = function (item) {
                            return item.disabled ? 'disabled' : item.cssClass;
                        };                        

                        scope.filterSearchText = function (item) {
                            return scope.searchText.value ? containsText(item, scope.searchText.value) : true;
                        };

                        scope.clearSearchText = function () {
                            scope.searchText.value = "";
                            scope.focusSearchBox();
                        };

                        scope.touched = function () {
                            modelCtrl.$setTouched();
                        };

                        scope.validate = function () {
                            var inValid = !scope.selectedItems || scope.selectedItems.IsNA;
                            modelCtrl.$setValidity('required', !inValid);
                        }
                    }
                };
            }
        ])

    .directive('selectwithsearchPopup', ['$document',
        function ($document) {
            return {
                restrict: 'E',
                replace: true,
                scope: false,
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

                        scope.touched();
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
                }
            };
        }
    ]);
}());