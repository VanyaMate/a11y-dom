"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var a11y_dom_1 = require("./a11y-dom");
new a11y_dom_1.A11yDom(document, {
    debug: true,
    parse: 'tabindex',
    goInBinds: ['ShiftLeft'],
    backOutBinds: ['ShiftRight'],
    switchBinds: ['Tab'],
});
