export type A11yDomOptions = {
    parse: 'tabindex' | 'a11y-dom';
    debug: boolean;
    switchBinds: string[];
    goInBinds: string[];
    backOutBinds: string[];
};
export type A11yDomNode = {
    element: Element | null;
    parent: A11yDomNode | null;
    children: A11yDomNode[];
};
export declare class A11yDom {
    private readonly _document;
    private readonly _options;
    private _dom;
    private _currentNode;
    private _currentNodeIndex;
    constructor(_document: Document, _options: A11yDomOptions);
    /**
     * Парсить по нативному tabindex
     * @private
     */
    private _tabIndexParser;
    /**
     * Парсить по своим аттрибутам
     * @private
     */
    private _a11yParser;
    /**
     * Переключение по текущему _currentNode
     * @private
     */
    private _addSwitchBinds;
    /**
     * Переход к _currentNode[_currentNodeIndex]
     * @private
     */
    private _addGoInBinds;
    /**
     * Переход к _parentNode
     * @private
     */
    private _addBackOutBinds;
    private _focus;
    private _debugLog;
}
