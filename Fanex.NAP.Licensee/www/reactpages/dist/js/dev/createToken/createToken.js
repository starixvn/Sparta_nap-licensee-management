webpackJsonp([16],{

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(3);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Form = __webpack_require__(182);

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Form2.default, null);
        }
    }]);

    return App;
}(_react2.default.Component);

exports.default = App;


_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app-container'));

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _Popup = __webpack_require__(54);

var _Popup2 = _interopRequireDefault(_Popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

        _this.onGenerate = function (event) {
            event.preventDefault();
            _this.setState({ isDisable: false, isShowMessage: true });
        };

        _this.onSubmit = function () {
            _this.setState({
                isShowPopup: false,
                seconds: _this.state.seconds + _this._convertHoursToSecond(_this.state.extraTime)
            });

            if (!_this.timerID) {
                _this.timerID = setInterval(function () {
                    return _this._tick();
                }, 1000);
            }
        };

        _this.state = {
            timeControl: '',
            seconds: 3600,
            extraTime: 0,
            isDisable: true,
            isShowMessage: false,
            isShowPopup: false
        };
        return _this;
    }

    _createClass(Form, [{
        key: '_tick',
        value: function _tick() {
            if (this.state.seconds == 0) {
                clearInterval(this.timerID);
                this.timerID = false;
            } else {
                var curentSeconds = this.state.seconds - 1;
                this.setState({
                    seconds: curentSeconds,
                    timeControl: this._secondsToTimeString(curentSeconds)
                });
            }
        }
    }, {
        key: '_convertHoursToSecond',
        value: function _convertHoursToSecond(hours) {
            return hours * 60 * 60;
        }
    }, {
        key: '_secondsToTimeString',
        value: function _secondsToTimeString(secs) {
            var hours = Math.floor(secs / 3600);
            var minutes = Math.floor(secs % 3600 / 60);
            var seconds = Math.floor(secs % 3600 % 60);

            return ('0' + hours).slice(-2) + " : " + ('0' + minutes).slice(-2) + " : " + ('0' + seconds).slice(-2);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({
                timeControl: this._secondsToTimeString(this.state.seconds)
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.timerID = setInterval(function () {
                return _this2._tick();
            }, 1000);
        }
    }, {
        key: '_buildContent',
        value: function _buildContent() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                { className: 'confirm-popup' },
                _react2.default.createElement(
                    'div',
                    { className: 'form-group row pop-content' },
                    _react2.default.createElement(
                        'label',
                        { className: 'col-lg-1 col-md-1 col-sm-1' },
                        'Hour'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-2 col-md-2 col-sm-2' },
                        _react2.default.createElement(
                            'div',
                            { className: 'group-input' },
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group-prepend icon-plus' },
                                _react2.default.createElement(
                                    'label',
                                    null,
                                    '+'
                                )
                            ),
                            _react2.default.createElement('input', { type: 'text', className: 'form-control', onChange: function onChange(e) {
                                    return _this3.setState({ extraTime: e.target.value });
                                } })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-3 col-md-3 col-sm-3' },
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-primary full-width', onClick: function onClick() {
                                    return _this3.onSubmit();
                                } },
                            'Submit'
                        )
                    )
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _state = this.state,
                timeControl = _state.timeControl,
                isDisable = _state.isDisable,
                isShowMessage = _state.isShowMessage,
                isShowPopup = _state.isShowPopup;


            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'add-form' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'card' },
                            _react2.default.createElement(
                                'div',
                                { className: 'card-header' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'card-header-content' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row header-content' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-9 col-sm-9 col-md-9' },
                                            'Current Token will be expired in ',
                                            timeControl
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-3 col-sm-3' },
                                            _react2.default.createElement(
                                                'button',
                                                { className: 'btn-extend pull-right', onClick: function onClick() {
                                                        return _this4.setState(function () {
                                                            return { isShowPopup: true };
                                                        });
                                                    } },
                                                'Extend time'
                                            )
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'card-body' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'card-title' },
                                    'Create new token for ',
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'title-name' },
                                        'ITsupport1'
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'card-body-content' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row' },
                                        _react2.default.createElement(
                                            'label',
                                            { className: 'col-lg-3 col-sm-3 col-md-3' },
                                            'Request by'
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-9 col-sm-9' },
                                            _react2.default.createElement('input', { type: 'text', className: 'full-width' })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row' },
                                        _react2.default.createElement(
                                            'label',
                                            { className: 'col-lg-3 col-sm-3 col-md-3' },
                                            'Redmine ID'
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-9 col-sm-9' },
                                            _react2.default.createElement('input', { type: 'text', className: 'full-width' })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row' },
                                        _react2.default.createElement(
                                            'label',
                                            { className: 'col-sm-3 col-lg-3 col-md-3' },
                                            'Exprired in'
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-9 col-sm-9' },
                                            _react2.default.createElement('input', { type: 'text', className: 'full-width' })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row pull-right' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-12' },
                                            _react2.default.createElement(
                                                'button',
                                                { className: 'btn-submit', onClick: this.onGenerate },
                                                'Generate'
                                            )
                                        )
                                    ),
                                    _react2.default.createElement('div', { className: 'clearfix' }),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row' },
                                        _react2.default.createElement(
                                            'label',
                                            { className: 'col-lg-3 col-sm-3 col-md-3' },
                                            'Your token'
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-lg-9 col-sm-9' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'group-input group-prepend' },
                                                _react2.default.createElement('input', { type: 'text', className: 'full-width', disabled: isDisable }),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'input-group-prepend' },
                                                    _react2.default.createElement(
                                                        'button',
                                                        { className: 'btn-copy', disabled: isDisable },
                                                        'Copy'
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    isShowMessage == true ? _react2.default.createElement(
                                        'div',
                                        { className: 'form-group row' },
                                        _react2.default.createElement(
                                            'label',
                                            { className: 'col-lg-12 col-sm-12 col-md-12' },
                                            'New token "czxcx" has been created. Make sure you copy it now, you won\'t be able to see it again'
                                        )
                                    ) : null
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(_Popup2.default, { isShow: isShowPopup,
                    title: 'Extend Time',
                    content: this._buildContent(),
                    className: 'no-scroll',
                    style: { top: '100px', bottom: 'auto', width: '540px' },
                    onClose: function onClose() {
                        return _this4.setState(function () {
                            return { isShowPopup: false };
                        });
                    } })
            );
        }
    }]);

    return Form;
}(_react.Component);

exports.default = Form;

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(3);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popup = function (_React$Component) {
    _inherits(Popup, _React$Component);

    function Popup(props) {
        _classCallCheck(this, Popup);

        var _this = _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, props));

        _this.zIndex = props.zIndex ? props.zIndex : 50;
        return _this;
    }

    _createClass(Popup, [{
        key: '_onClose',
        value: function _onClose(callBack) {
            callBack && callBack();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                title = _props.title,
                style = _props.style,
                content = _props.content,
                onClose = _props.onClose,
                noShowCloseButton = _props.noShowCloseButton,
                isShow = _props.isShow,
                className = _props.className;

            var combinedStyle = Object.assign({}, style, { zIndex: this.zIndex + 1 });

            return _react2.default.createElement(
                'div',
                { className: 'popup ' + (isShow ? 'show' : '') },
                isShow && _react2.default.createElement('div', { className: 'popup-block-body', style: { zIndex: this.zIndex } }),
                _react2.default.createElement(
                    'div',
                    { className: 'popup-container ' + className, style: combinedStyle },
                    _react2.default.createElement(
                        'div',
                        { className: 'popup-title' },
                        _react2.default.createElement(
                            'p',
                            { title: title },
                            title
                        ),
                        !noShowCloseButton && _react2.default.createElement(
                            'a',
                            { className: 'popup-close', href: 'javascript:;', onClick: function onClick() {
                                    return _this2._onClose(onClose);
                                } },
                            '\xD7'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'popup-content' },
                        content
                    )
                )
            );
        }
    }]);

    return Popup;
}(_react2.default.Component);

exports.default = Popup;
;

/***/ })

},[181]);
//# sourceMappingURL=createToken.js.map