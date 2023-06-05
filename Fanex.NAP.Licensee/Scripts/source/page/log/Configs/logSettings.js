
var logSettings = (function () {
    "use strict";

    var itemsMapping = logConfig.itemsMapping;
    var itemsIgnore = logConfig.itemsIgnore;

    var mimeType = 'application/xml';

    var me = {};

    // Function: init log setting
    var getAttributeFromNode = function (xmlNode) {
        var panel = xmlNode.nodeName;
        var content = [];
        $.each(xmlNode.attributes, function (index, attribute) {
            content.push({
                key: attribute.name,
                value: attribute.value
            });
        });

        return content.length === 0 ? undefined : { panel: panel, content: content };
    };

    var initLogSetting = function (setting) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(setting, mimeType);

        var settings = [
            // { panel, content }
        ];

        // set root data
        var rootNode = doc.firstChild;
        var attrs = getAttributeFromNode(rootNode);
        if (attrs !== undefined) {
            settings.push(attrs);
        }

        // set childs data
        if (rootNode.children.length > 0) {
            $.each(rootNode.children, function (index, xmlNode) {
                var childAttrs = getAttributeFromNode(xmlNode);

                if (childAttrs !== undefined) {
                    settings.push(childAttrs);
                }
            });
        }

        return settings;
    };
    // End-Function: init log setting

    // Function: replace setting names
    var replaceSettingNames = function (settings, actionId) {
        var config = itemsMapping.find(function (item) {
            return item.ActionIds.split(',').includes(actionId.toString());
        });

        if (config === undefined) return;

        if (config !== null) {
            $.each(settings, function (index, setting) {
                setting.panel = replacePropertyName(setting.panel, config.Configs);
                $.each(setting.content, function (index, value) {
                    value.key = replacePropertyName(value.key, config.Configs);
                });
            });
        }
    };

    var replacePropertyName = function (propertyName, configs) {
        var config = configs.find(function (item) {
            return item.Alias === propertyName;
        });

        if (config !== undefined) {
            propertyName = config.Item;
        }

        return propertyName;
    };
    // End-Function: replace setting names

    // Function: ignore properties
    var ignoreProperties = function (settings, actionId) {
        var item = itemsIgnore.find(function (value) {
            return value.ActionIds.split(',').includes(actionId.toString());
        });

        if (item === undefined) return;
        $.each(settings, function (index, setting) {
            setting.content = removeItems(setting.content, item.Items);
        });
    }

    var removeItems = function (array, items) {
        return array.filter(function (item) {
            return !items.includes(item.key);
        });
    }
    // End-Function: ignore properties

    me.formatData = function (xml, actionId, callBackFunc) {

        if (xml === null) {
            return undefined;
        }

        var settings = initLogSetting(xml);

        if (callBackFunc != undefined) {
            callBackFunc(settings);
        }

        ignoreProperties(settings, actionId);
        replaceSettingNames(settings, actionId);

        return settings;
    }

    // Function: create table data
    me.createTable = function (oldData, newData) {
        var detailContent = '';

        var rootData = oldData !== undefined ? oldData : newData;

        $.each(rootData, function (index, value) {
            var oldValue = oldData === undefined ? undefined : oldData[index];
            var newValue = newData === undefined ? undefined : newData[index];

            if (index === 0 || !compareSetting(oldValue, newValue)) {
                var table = '<table class="log-data-table">';

                table += createPanel(value.panel);
                table += createContentSetting(value, newValue);

                table += '</table>';

                detailContent += table;
            }
        })

        return detailContent;
    }

    var compareSetting = function (oldValue, newValue) {
        var isSame = true;

        if (oldValue === undefined || newValue === undefined || oldValue.content.length !== newValue.content.length) {
            return false;
        } else {
            oldValue.content.forEach(function (oldObj) {
                var index = newValue.content.findIndex(function (newObj) {
                    return newObj.key === oldObj.key && newObj.value === oldObj.value;
                });

                if (index === -1) {
                    isSame = false;
                }
            })
        }

        return isSame;
    }

    var createPanel = function (panel) {
        return '<tr class="panel-setting"><td class="log-panel" colSpan="6">' + panel + '</td></tr>';
    }

    var isNumeric = function (str) {
        if (typeof str != 'string') return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    var addCommas = function (nStr) {
        var number = parseFloat(nStr);

        return number.toLocaleString("en-US");;
    }

    var getContentValue = function (value) {
        return isNumeric(value) ? addCommas(value) : value;
    }

    var createContentColumn = function (obj, newObj) {
        var div = $('<div>')
        var td = $('<td>');

        td.addClass('log-value');
        if (newObj !== undefined && newObj.value !== obj.value) {

            if (obj.value === ' ') {
                td.append('<span>' + getContentValue(newObj.value) + '</span>');
            } else if (newObj.value == ' ') {
                td.append('<span>' + getContentValue(obj.value) + '</span>');
            } else {
                td.addClass('highlight-content');

                td.append('<span class="new-value">' + getContentValue(newObj.value) + '</span>');
                td.append('<br>');
                td.append('<span class="old-value">' + getContentValue(obj.value) + '</span>');
            }
        } else {
            td.append('<span>' + getContentValue(obj.value) + '</span>');
        }
        div.append(td);

        return div.html();
    }

    var createEmptyColumn = function (length) {
        var emptySetting = '';
        for (var i = 0; i < length; i++) {
            emptySetting += '<td class="log-title"></td><td class="log-value"></td>';
        }

        return emptySetting;
    }

    var createContentSetting = function (value, newValue) {
        var maxColumnsInline = 6;
        var countObj = 0;
        var contentSetting = '';
        var contentLength = value.content.length;
        var tr = '<tr class="content-setting">';

        $.each(value.content, function (index, item) {
            countObj += 1;
            tr += '<td class="log-title">' + item.key + '</td>';

            var newItem = undefined;
            if (newValue !== undefined) {
                newItem = newValue.content.find(function (i) {
                    return i.key === item.key;
                });
            };

            tr += createContentColumn(item, newItem);
            if (countObj % (maxColumnsInline / 2) === 0 || index === contentLength - 1) {
                if (countObj % (maxColumnsInline / 2) !== 0) {
                    var length = maxColumnsInline / 2 - countObj % (maxColumnsInline / 2);
                    tr += createEmptyColumn(length);
                }

                tr += '</tr>';
                contentSetting += tr;
                tr = '<tr class="content-setting">';
            }
        });

        return contentSetting;
    }

    // End-Function: create table data

    return me;
})();