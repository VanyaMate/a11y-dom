import { A11yDom } from './a11y-dom';


new A11yDom(document, {
    debug       : true,
    parse       : 'tabindex',
    goInBinds   : [ 'ShiftLeft' ],
    backOutBinds: [ 'ShiftRight' ],
    switchBinds : [ 'Tab' ],
});