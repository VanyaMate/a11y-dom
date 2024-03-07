"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A11yDom = void 0;
var A11yDom = /** @class */ (function () {
    function A11yDom(_document, _options) {
        this._document = _document;
        this._options = _options;
        this._dom = {
            element: null,
            parent: null,
            children: [],
        };
        this._currentNode = null;
        this._currentNodeIndex = 0;
        if (this._options.parse === 'tabindex') {
            this._tabIndexParser(this._document, this._dom);
        }
        else {
            this._a11yParser(this._document, this._dom);
        }
        if (this._dom.children.length) {
            this._currentNodeIndex = 0;
            this._currentNode = this._dom;
        }
        this._document.addEventListener('keydown', this._addSwitchBinds.bind(this));
        this._document.addEventListener('keydown', this._addGoInBinds.bind(this));
        this._document.addEventListener('keydown', this._addBackOutBinds.bind(this));
        if (this._options.debug) {
            this._debugLog(this._dom);
        }
    }
    /**
     * Парсить по нативному tabindex
     * @private
     */
    A11yDom.prototype._tabIndexParser = function (container, a11yDomNodes) {
        var _this = this;
        var _a, _b, _c;
        var children = container.children;
        var _loop_1 = function (i) {
            if (children[i].getAttribute('tabindex')) {
                var node_1 = {
                    parent: a11yDomNodes,
                    element: children[i],
                    children: [],
                };
                children[i].addEventListener('focus', function () { return _this._currentNode = node_1.parent; });
                this_1._currentNodeIndex = (_c = (_b = (_a = this_1._currentNode) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.children.indexOf(node_1)) !== null && _c !== void 0 ? _c : 0;
                children[i].setAttribute('tabindex', '-1');
                a11yDomNodes.children.push(node_1);
                this_1._tabIndexParser(children[i], node_1);
            }
            else {
                this_1._tabIndexParser(children[i], a11yDomNodes);
            }
        };
        var this_1 = this;
        for (var i = 0; i < children.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * Парсить по своим аттрибутам
     * @private
     */
    A11yDom.prototype._a11yParser = function (container, saveTo) {
    };
    /**
     * Переключение по текущему _currentNode
     * @private
     */
    A11yDom.prototype._addSwitchBinds = function (event) {
        var _a;
        if (~this._options.switchBinds.indexOf(event.code)) {
            event.preventDefault();
            if (this._currentNode) {
                if (this._currentNodeIndex === ((_a = this._currentNode) === null || _a === void 0 ? void 0 : _a.children.length) - 1) {
                    this._currentNodeIndex = 0;
                }
                else {
                    this._currentNodeIndex += 1;
                }
            }
        }
        this._focus();
    };
    /**
     * Переход к _currentNode[_currentNodeIndex]
     * @private
     */
    A11yDom.prototype._addGoInBinds = function (event) {
        if (~this._options.goInBinds.indexOf(event.code)) {
            if (this._currentNode) {
                var children = this._currentNode.children[this._currentNodeIndex].children;
                if (children.length) {
                    event.preventDefault();
                    this._currentNode = this._currentNode.children[this._currentNodeIndex];
                    this._currentNodeIndex = 0;
                    this._focus();
                }
            }
        }
    };
    /**
     * Переход к _parentNode
     * @private
     */
    A11yDom.prototype._addBackOutBinds = function (event) {
        var _a, _b, _c;
        if (~this._options.backOutBinds.indexOf(event.code)) {
            if ((_a = this._currentNode) === null || _a === void 0 ? void 0 : _a.parent) {
                event.preventDefault();
                this._currentNodeIndex = (_c = (_b = this._currentNode) === null || _b === void 0 ? void 0 : _b.parent.children.indexOf(this._currentNode)) !== null && _c !== void 0 ? _c : 0;
                this._currentNode = this._currentNode.parent;
                this._focus();
            }
        }
    };
    A11yDom.prototype._focus = function () {
        if (this._currentNode) {
            this._currentNode.children[this._currentNodeIndex].element.focus();
        }
    };
    A11yDom.prototype._debugLog = function (message) {
        if (this._options.debug) {
            console.log('%c*******************************', 'font-size: 20px; color: gray;');
            console.log('%cA11yDom', 'font-size: 40px; color: green;');
            console.log(message);
            console.log('%c*******************************', 'font-size: 20px; color: gray;');
        }
    };
    return A11yDom;
}());
exports.A11yDom = A11yDom;
