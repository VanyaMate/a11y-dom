export type A11yDomOptions = {
    parse: 'tabindex' | 'a11y-dom';
    debug: boolean;
    switchBinds: string[];
    goInBinds: string[];
    backOutBinds: string[];
}

export type A11yDomNode = {
    element: Element | null;
    parent: A11yDomNode | null;
    children: A11yDomNode[];
}

export class A11yDom {
    private _dom: A11yDomNode                = {
        element : null,
        parent  : null,
        children: [],
    };
    private _currentNode: A11yDomNode | null = null;
    private _currentNodeIndex                = 0;

    constructor (
        private readonly _document: Document,
        private readonly _options: A11yDomOptions,
    ) {
        if (this._options.parse === 'tabindex') {
            this._tabIndexParser(this._document, this._dom);
        } else {
            this._a11yParser(this._document, this._dom);
        }

        if (this._dom.children.length) {
            this._currentNodeIndex = 0;
            this._currentNode      = this._dom;
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
    private _tabIndexParser (container: ParentNode, a11yDomNodes: A11yDomNode) {
        const children: HTMLCollection = container.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].getAttribute('tabindex')) {
                const node: A11yDomNode = {
                    parent  : a11yDomNodes,
                    element : children[i],
                    children: [],
                };
                children[i].addEventListener('focus', () => this._currentNode = node.parent);
                this._currentNodeIndex = this._currentNode?.parent?.children.indexOf(node) ?? 0;
                children[i].setAttribute('tabindex', '-1');
                a11yDomNodes.children.push(node);
                this._tabIndexParser(children[i], node);
            } else {
                this._tabIndexParser(children[i], a11yDomNodes);
            }
        }
    }

    /**
     * Парсить по своим аттрибутам
     * @private
     */
    private _a11yParser (container: ParentNode, saveTo: A11yDomNode) {

    }

    /**
     * Переключение по текущему _currentNode
     * @private
     */
    private _addSwitchBinds (event: KeyboardEvent) {
        if (~this._options.switchBinds.indexOf(event.code)) {
            event.preventDefault();

            if (this._currentNode) {
                if (this._currentNodeIndex === this._currentNode?.children.length - 1) {
                    this._currentNodeIndex = 0;
                } else {
                    this._currentNodeIndex += 1;
                }
            }
        }

        this._focus();
    }

    /**
     * Переход к _currentNode[_currentNodeIndex]
     * @private
     */
    private _addGoInBinds (event: KeyboardEvent) {
        if (~this._options.goInBinds.indexOf(event.code)) {
            if (this._currentNode) {
                const children = this._currentNode.children[this._currentNodeIndex].children;
                if (children.length) {
                    event.preventDefault();

                    this._currentNode      = this._currentNode.children[this._currentNodeIndex];
                    this._currentNodeIndex = 0;

                    this._focus();
                }
            }
        }
    }

    /**
     * Переход к _parentNode
     * @private
     */
    private _addBackOutBinds (event: KeyboardEvent) {
        if (~this._options.backOutBinds.indexOf(event.code)) {
            if (this._currentNode?.parent) {
                event.preventDefault();

                this._currentNodeIndex = this._currentNode?.parent.children.indexOf(this._currentNode) ?? 0;
                this._currentNode      = this._currentNode.parent;

                this._focus();
            }
        }
    }

    private _focus () {
        if (this._currentNode) {
            (this._currentNode.children[this._currentNodeIndex].element as HTMLElement).focus();
        }
    }

    private _debugLog (message: any) {
        if (this._options.debug) {
            console.log('%c*******************************', 'font-size: 20px; color: gray;');
            console.log('%cA11yDom', 'font-size: 40px; color: green;');
            console.log(message);
            console.log('%c*******************************', 'font-size: 20px; color: gray;');
        }
    }
}