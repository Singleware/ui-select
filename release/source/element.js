"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const JSX = require("@singleware/jsx");
/**
 * Select element.
 */
let Element = class Element extends HTMLElement {
    /**
     * Default constructor.
     */
    constructor() {
        super();
        /**
         * Default text for no selections in the text input.
         */
        this.defaultText = '';
        /**
         * Default nodes for no selections in the button input.
         */
        this.defaultNodes = [];
        /**
         * List of options.
         */
        this.optionsList = [];
        /**
         * List of active options.
         */
        this.activatedList = [];
        /**
         * Map of option entity by option element.
         */
        this.optionsMap = new WeakMap();
        /**
         * Map of option element by option entity.
         */
        this.optionElementMap = new WeakMap();
        /**
         * Map of group entity by name.
         */
        this.groupsMap = new Map();
        /**
         * Map of group element by group entity.
         */
        this.groupElementMap = new WeakMap();
        /**
         * Determines whether the result or empty element slot can be closed or not.
         */
        this.canClose = true;
        /**
         * Input slot element.
         */
        this.inputSlot = JSX.create("slot", { name: "input", class: "input", onClick: this.toggleListHandler.bind(this) });
        /**
         * Arrow slot element.
         */
        this.arrowSlot = JSX.create("slot", { name: "arrow", class: "arrow", onClick: this.toggleListHandler.bind(this) });
        /**
         * Search slot element.
         */
        this.searchSlot = JSX.create("slot", { name: "search", class: "search", onKeyUp: this.updateResultList.bind(this) });
        /**
         * Result slot element.
         */
        this.resultSlot = JSX.create("slot", { name: "result", class: "result", onMouseDown: this.preventCloseHandler.bind(this) });
        /**
         * Empty slot element.
         */
        this.emptySlot = (JSX.create("slot", { name: "empty", class: "empty", onMouseDown: this.preventCloseHandler.bind(this), onClick: this.closeListHandler.bind(this) }));
        /**
         * Select layout element.
         */
        this.selectLayout = (JSX.create("label", { class: "select" },
            JSX.create("div", { class: "field" },
                this.searchSlot,
                this.inputSlot,
                this.arrowSlot),
            this.resultSlot,
            this.emptySlot));
        /**
         * Select styles element.
         */
        this.selectStyles = (JSX.create("style", null, `:host > .select {
  display: flex;
  flex-direction: column;
  position: relative;
  height: inherit;
  width: inherit;
  user-select: none;
}
:host(:not([opened])) > .select > .field {
  display: flex;
}
:host([searchable][opened]) > .select > .field > .input::slotted(*),
:host([searchable]:not([opened])) > .select > .field > .search::slotted(*),
:host(:not([searchable])) > .select > .field > .search::slotted(*),
:host(:not([opened])) > .select > .result::slotted(*),
:host(:not([found])) > .select > .result::slotted(*) {
  display: none;
}
:host(:not([opened])) > .select > .empty::slotted(*),
:host([opened][found]) > .select > .empty::slotted(*) {
  display: none;
}
:host > .select > .field > .input::slotted(*) {
  cursor: default;
}
:host > .select > .field > .search::slotted(*),
:host > .select > .field > .input::slotted(*) {
  text-align: left;
  width: 100%;
}
:host > .select > .field > .arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
}
:host > .select > .field > .arrow::slotted(*) {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  width: 0;
  height: 0;
  transform: translate(-50%,-50%);
  border-left: 0.1875rem solid transparent;
  border-right: 0.1875rem solid transparent;
  border-top: 0.25rem solid black;
}
:host > .select > .result::slotted(*),
:host > .select > .empty::slotted(*) {
  display: block;
  position: absolute;
  border: 0.0625rem solid black;
  overflow: auto;
  top: 100%;
  width: 100%;
  z-index: 1;
}`));
        const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.selectStyles, this.selectLayout);
        shadow.addEventListener('keydown', this.optionKeydownHandler.bind(this));
        this.inputSlot.addEventListener('slotchange', this.slotChangeHandler.bind(this));
        this.inputSlot.addEventListener('focus', this.focusListHandler.bind(this), true);
        this.inputSlot.addEventListener('blur', this.blurListHandler.bind(this), true);
        this.searchSlot.addEventListener('blur', this.blurListHandler.bind(this), true);
    }
    /**
     * Gets the first child element from the specified slot element.
     * @param slot Slot element.
     * @throws Throws an error when there are no children in the specified slot.
     * @returns Returns the first child element.
     */
    getChildElement(slot) {
        const child = slot.assignedNodes()[0];
        if (!child) {
            throw new Error(`There are no children in the '${slot.name}' slot.`);
        }
        return child;
    }
    /**
     * Sets the property into the first child from specified slot element.
     * @param slot Slot element.
     * @param property Property name.
     * @param value Property value.
     * @throws Throws an error when there are no children in the specified slot.
     * @returns Returns true when the specified property has been assigned, false otherwise.
     */
    setChildProperty(slot, property, value) {
        const child = this.getChildElement(slot);
        if (property in child) {
            child[property] = value;
            return true;
        }
        return false;
    }
    /**
     * Updates the specified state in the element.
     * @param name State name.
     * @param state State value.
     */
    updateState(name, state) {
        if (state) {
            this.setAttribute(name, '');
        }
        else {
            this.removeAttribute(name);
        }
    }
    /**
     * Update all validation attributes.
     */
    updateValidation() {
        this.updateState('empty', this.empty);
        this.updateState('invalid', !this.empty && !this.checkValidity());
    }
    /**
     * Updates the input element with the specified option entity.
     * @param option Option entity.
     */
    updateInputSelection(option) {
        const selection = this.renderSelectionElement(option);
        const input = this.getChildElement(this.inputSlot);
        if (input instanceof HTMLButtonElement) {
            JSX.append(JSX.clear(input), selection);
        }
        else if (input instanceof HTMLInputElement) {
            input.value = selection ? selection.innerText : '';
        }
    }
    /**
     * Updates the result element with any option found.
     */
    updateResultList() {
        const result = JSX.clear(this.getChildElement(this.resultSlot));
        const search = this.search;
        this.activatedList = [];
        for (const option of this.optionsList) {
            let element = this.optionElementMap.get(option);
            if (search === void 0 || option.tags.find(tag => tag.includes(search))) {
                this.activatedList.push(option);
                if (option.group) {
                    const group = this.groupsMap.get(option.group);
                    if (group) {
                        element = JSX.append(this.groupElementMap.get(group), element);
                    }
                    else {
                        console.warn(`Option group '${option.group}' does not exists.`);
                    }
                }
                JSX.append(result, element);
            }
            else if (option.group) {
                element.remove();
            }
        }
        if (this.selectedElement) {
            this.selectedElement.scrollIntoView({ block: 'center' });
        }
        this.updateState('found', this.activatedList.length !== 0);
    }
    /**
     * Renders a new option element for the specified option entity.
     * @param option Option entity.
     * @returns Returns the rendered option element.
     */
    renderOptionElement(option) {
        const detail = { option: option, element: void 0 };
        if (this.dispatchEvent(new CustomEvent('renderoption', { bubbles: true, cancelable: true, detail: detail }))) {
            return (JSX.create("div", { class: "option", onClick: this.optionClickHandler.bind(this, option) }, detail.element || option.label || option.value));
        }
        return void 0;
    }
    /**
     * Renders a new selection result for the specified option entity.
     * @param option Option entity.
     * @returns Returns the rendered selection result.
     */
    renderSelectionElement(option) {
        const detail = { option: option, element: void 0 };
        if (this.dispatchEvent(new CustomEvent('renderselection', { bubbles: true, cancelable: true, detail: detail }))) {
            return JSX.create("div", { class: "selection" }, detail.element || option.label || option.value);
        }
        return void 0;
    }
    /**
     * Renders a new group element for the specified group entity.
     * @param group Group entity.
     * @returns Returns the rendered group element.
     */
    renderGroupElement(group) {
        const detail = { group: group, element: void 0 };
        if (this.dispatchEvent(new CustomEvent('rendergroup', { bubbles: true, cancelable: true, detail: detail }))) {
            return JSX.create("div", { class: "group" }, detail.element || group.label);
        }
        return void 0;
    }
    /**
     * Reset the search element to find options.
     */
    resetSearch() {
        const search = this.getChildElement(this.searchSlot);
        if (search.reset instanceof Function) {
            search.reset();
        }
        else if ('value' in search) {
            search.value = search.defaultValue;
        }
        if (search.focus instanceof Function) {
            search.focus();
        }
    }
    /**
     * Selects the element that corresponds to the specified option entity.
     * @param option Option entity.
     */
    selectOption(option) {
        if (this.selectedElement) {
            delete this.selectedElement.dataset.selected;
        }
        this.selectedOption = option;
        this.selectedElement = this.optionElementMap.get(option);
        this.selectedElement.dataset.selected = '';
        this.selectedElement.scrollIntoView();
        this.setCustomValidity(!this.required || option.value.length ? '' : 'Please select a valid option.');
        this.updateInputSelection(option);
        this.updateValidation();
    }
    /**
     * Selects the option that corresponds to the specified value.
     * @param value Option value.
     * @returns Returns true when an option was selected, false otherwise.
     */
    selectOptionByValue(value) {
        for (const option of this.optionsList) {
            if (option.value === value) {
                if (option !== this.selectedOption) {
                    this.selectOption(option);
                }
                return true;
            }
        }
        return false;
    }
    /**
     * Selects the element that corresponds to the specified option and notifies the change.
     * @param option Option entity.
     */
    selectOptionAndNotify(option) {
        if (option !== this.selectedOption) {
            const savedOption = this.selectedOption;
            this.selectOption(option);
            if (!this.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))) {
                if (savedOption) {
                    this.selectOption(savedOption);
                }
                else {
                    this.unselectOption();
                }
            }
        }
    }
    /**
     * Selects the previous option.
     */
    selectPreviousOptionAndNotify() {
        const index = this.activatedList.indexOf(this.selectedOption);
        const option = this.activatedList[(index - 1 > -1 ? index : this.activatedList.length) - 1];
        this.selectOptionAndNotify(option);
    }
    /**
     * Selects the next option.
     */
    selectNextOptionAndNotify() {
        const index = this.activatedList.indexOf(this.selectedOption);
        const option = this.activatedList[index + 1 < this.activatedList.length ? index + 1 : 0];
        this.selectOptionAndNotify(option);
    }
    /**
     * Selects the next first option that corresponds to the specified search.
     * @param search Search value.
     */
    selectNextOptionBySearchAndNotify(search) {
        let index = this.activatedList.indexOf(this.selectedOption);
        for (let l = 0; l < this.activatedList.length; ++l) {
            const option = this.activatedList[++index % this.activatedList.length];
            if (option.tags.find(tag => tag.indexOf(search) === 0)) {
                this.selectOptionAndNotify(option);
                break;
            }
        }
    }
    /**
     * Unselects the current selected option.
     */
    unselectOption() {
        const input = this.getChildElement(this.inputSlot);
        if (input instanceof HTMLButtonElement) {
            JSX.append(JSX.clear(input), ...this.defaultNodes);
        }
        else if (input instanceof HTMLInputElement) {
            input.value = this.defaultText;
        }
        if (this.selectedElement) {
            delete this.selectedElement.dataset.selected;
        }
        this.selectedOption = void 0;
        this.selectedElement = void 0;
    }
    /**
     * Option click, event handler.
     * @param option Option entity.
     */
    optionClickHandler(option) {
        this.closeListHandler();
        this.selectOptionAndNotify(option);
    }
    /**
     * Option keydown, event handler.
     * @param event Event instance.
     */
    optionKeydownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            this.open();
            this.focus();
        }
        else if (event.code === 'Enter') {
            event.preventDefault();
            this.toggleListHandler();
        }
        else if (event.code === 'Escape') {
            event.preventDefault();
            this.closeListHandler();
        }
        else if (event.code === 'ArrowUp') {
            event.preventDefault();
            this.selectPreviousOptionAndNotify();
        }
        else if (event.code === 'ArrowDown') {
            event.preventDefault();
            this.selectNextOptionAndNotify();
        }
        else if (!this.searchable) {
            event.preventDefault();
            this.selectNextOptionBySearchAndNotify(event.key);
        }
    }
    /**
     * Updates the current selection into the new input slot element.
     */
    slotChangeHandler() {
        const input = this.getChildElement(this.inputSlot);
        if (input instanceof HTMLButtonElement) {
            this.defaultNodes = [];
            for (const node of input.childNodes) {
                this.defaultNodes.push(node);
            }
        }
        else if (input instanceof HTMLInputElement) {
            this.defaultText = input.value;
            input.readOnly = true;
        }
        if (this.selectedOption) {
            this.updateInputSelection(this.selectedOption);
        }
        this.updateValidation();
    }
    /**
     * Prevent close, event handler.
     */
    preventCloseHandler() {
        this.canClose = false;
        this.focus();
    }
    /**
     * Focus list, event handler.
     */
    focusListHandler() {
        if (!this.opened) {
            this.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
        }
    }
    /**
     * Blur list, event handler.
     */
    blurListHandler() {
        if (this.canClose) {
            if (this.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }))) {
                this.close();
            }
        }
        this.canClose = true;
    }
    /**
     * Opens the list, event handler.
     */
    openListHandler() {
        this.open();
        this.focus();
    }
    /**
     * Closes the list, event handler.
     */
    closeListHandler() {
        this.focus();
        this.close();
    }
    /**
     * Toggles the list, event handler.
     */
    toggleListHandler() {
        if (this.opened) {
            this.closeListHandler();
        }
        else {
            this.openListHandler();
        }
    }
    /**
     * Gets the selected option.
     */
    get selection() {
        return this.selectedOption ? { ...this.selectedOption } : void 0;
    }
    /**
     * Gets the current search text.
     */
    get search() {
        return this.searchable ? this.getChildElement(this.searchSlot).value : void 0;
    }
    /**
     * Gets the opened state.
     */
    get opened() {
        return this.hasAttribute('opened');
    }
    /**
     * Gets the options found state.
     */
    get found() {
        return this.hasAttribute('found');
    }
    /**
     * Gets the total number of options.
     */
    get count() {
        return this.optionsList.length;
    }
    /**
     * Determines whether the element is empty or not.
     */
    get empty() {
        return this.selectedOption === void 0;
    }
    /**
     * Gets the element name.
     */
    get name() {
        return this.getAttribute('name') || '';
    }
    /**
     * Sets the element name.
     */
    set name(name) {
        this.setAttribute('name', name);
        this.setChildProperty(this.inputSlot, 'name', name);
    }
    /**
     * Gets the element value.
     */
    get value() {
        return this.selectedOption ? this.selectedOption.value : void 0;
    }
    /**
     * Sets the element value.
     */
    set value(value) {
        if (value === void 0 || !this.selectOptionByValue(value)) {
            this.unselectOption();
            this.updateValidation();
        }
    }
    /**
     * Gets the searchable state of the element.
     */
    get searchable() {
        return this.hasAttribute('searchable') && this.searchSlot.assignedNodes().length !== 0;
    }
    /**
     * Sets the searchable state of the element.
     */
    set searchable(state) {
        this.updateState('searchable', state);
    }
    /**
     * Gets the required state of the element.
     */
    get required() {
        return this.hasAttribute('required');
    }
    /**
     * Sets the required state of the element.
     */
    set required(state) {
        this.setChildProperty(this.inputSlot, 'required', state);
        this.updateState('required', state);
        this.updateValidation();
    }
    /**
     * Gets the read-only state of the element.
     */
    get readOnly() {
        return this.hasAttribute('readonly');
    }
    /**
     * Sets the read-only state of the element.
     */
    set readOnly(state) {
        this.updateState('readonly', state);
    }
    /**
     * Gets the disabled state of the element.
     */
    get disabled() {
        return this.hasAttribute('disabled');
    }
    /**
     * Sets the disabled state of the element.
     */
    set disabled(state) {
        this.updateState('disabled', this.setChildProperty(this.inputSlot, 'disabled', state) && state);
    }
    /**
     * Move the focus to this element.
     */
    focus() {
        const target = this.getChildElement(this.searchable && this.opened ? this.searchSlot : this.inputSlot);
        if (target.focus instanceof Function) {
            target.focus();
        }
    }
    /**
     * Reset the element value to its initial value.
     */
    reset() {
        const input = this.getChildElement(this.inputSlot);
        if (input.reset instanceof Function) {
            input.reset();
        }
        else if ('value' in input) {
            input.value = input.defaultValue;
        }
        this.updateValidation();
    }
    /**
     * Checks the element validity.
     * @returns Returns true when the element is valid, false otherwise.
     */
    checkValidity() {
        const input = this.getChildElement(this.inputSlot);
        return ((!this.required || (this.value !== void 0 && this.value.length)) &&
            (!(input.checkValidity instanceof Function) || input.checkValidity()));
    }
    /**
     * Set the element's custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error) {
        const input = this.getChildElement(this.inputSlot);
        if (input.setCustomValidity instanceof Function) {
            input.setCustomValidity(error);
        }
    }
    /**
     * Adds the specified group into the groups list.
     * @param name Group name.
     * @param label Group label.
     */
    addGroup(name, label) {
        const group = { name: name, label: label };
        const element = this.renderGroupElement(group);
        if (element) {
            this.groupsMap.set(name, group);
            this.groupElementMap.set(group, element);
            this.updateResultList();
        }
    }
    /**
     * Adds the specified option into the options list.
     * @param value Option value.
     * @param label Option label.
     * @param metadata Option metadata.
     */
    addOption(value, label, data = {}) {
        const option = {
            value: value,
            label: label,
            group: data.group,
            tags: (data.tags || [label || value]).map((tag) => tag.toLocaleLowerCase()),
            custom: data.custom || {}
        };
        const element = this.renderOptionElement(option);
        if (element) {
            this.optionsMap.set(element, option);
            this.optionElementMap.set(option, element);
            this.optionsList.push(option);
            this.updateResultList();
        }
    }
    /**
     * Clear all options.
     */
    clear() {
        this.optionsList = [];
        this.unselectOption();
        this.updateValidation();
        this.updateState('found', false);
        JSX.clear(this.getChildElement(this.resultSlot));
    }
    /**
     * Opens the options list.
     */
    open() {
        if (!this.readOnly && !this.disabled) {
            if (this.searchable) {
                this.canClose = false;
                this.resetSearch();
            }
            this.updateResultList();
            this.updateState('opened', true);
        }
    }
    /**
     * Closes the options list.
     */
    close() {
        this.updateState('found', false);
        this.updateState('opened', false);
    }
    /**
     * Toggles the options list.
     */
    toggle() {
        if (this.opened) {
            this.close();
        }
        else {
            this.open();
        }
    }
};
__decorate([
    Class.Public()
], Element.prototype, "defaultValue", void 0);
__decorate([
    Class.Private()
], Element.prototype, "defaultText", void 0);
__decorate([
    Class.Private()
], Element.prototype, "defaultNodes", void 0);
__decorate([
    Class.Private()
], Element.prototype, "optionsList", void 0);
__decorate([
    Class.Private()
], Element.prototype, "activatedList", void 0);
__decorate([
    Class.Private()
], Element.prototype, "optionsMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "optionElementMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "groupsMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "groupElementMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "selectedOption", void 0);
__decorate([
    Class.Private()
], Element.prototype, "selectedElement", void 0);
__decorate([
    Class.Private()
], Element.prototype, "canClose", void 0);
__decorate([
    Class.Private()
], Element.prototype, "inputSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "arrowSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "searchSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "resultSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "emptySlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "selectLayout", void 0);
__decorate([
    Class.Private()
], Element.prototype, "selectStyles", void 0);
__decorate([
    Class.Private()
], Element.prototype, "getChildElement", null);
__decorate([
    Class.Private()
], Element.prototype, "setChildProperty", null);
__decorate([
    Class.Private()
], Element.prototype, "updateState", null);
__decorate([
    Class.Private()
], Element.prototype, "updateValidation", null);
__decorate([
    Class.Private()
], Element.prototype, "updateInputSelection", null);
__decorate([
    Class.Private()
], Element.prototype, "updateResultList", null);
__decorate([
    Class.Private()
], Element.prototype, "renderOptionElement", null);
__decorate([
    Class.Private()
], Element.prototype, "renderSelectionElement", null);
__decorate([
    Class.Private()
], Element.prototype, "renderGroupElement", null);
__decorate([
    Class.Private()
], Element.prototype, "resetSearch", null);
__decorate([
    Class.Private()
], Element.prototype, "selectOption", null);
__decorate([
    Class.Private()
], Element.prototype, "selectOptionByValue", null);
__decorate([
    Class.Private()
], Element.prototype, "selectOptionAndNotify", null);
__decorate([
    Class.Private()
], Element.prototype, "selectPreviousOptionAndNotify", null);
__decorate([
    Class.Private()
], Element.prototype, "selectNextOptionAndNotify", null);
__decorate([
    Class.Private()
], Element.prototype, "selectNextOptionBySearchAndNotify", null);
__decorate([
    Class.Private()
], Element.prototype, "unselectOption", null);
__decorate([
    Class.Private()
], Element.prototype, "optionClickHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "optionKeydownHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "slotChangeHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "preventCloseHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "focusListHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "blurListHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "openListHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "closeListHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "toggleListHandler", null);
__decorate([
    Class.Public()
], Element.prototype, "selection", null);
__decorate([
    Class.Public()
], Element.prototype, "search", null);
__decorate([
    Class.Public()
], Element.prototype, "opened", null);
__decorate([
    Class.Public()
], Element.prototype, "found", null);
__decorate([
    Class.Public()
], Element.prototype, "count", null);
__decorate([
    Class.Public()
], Element.prototype, "empty", null);
__decorate([
    Class.Public()
], Element.prototype, "name", null);
__decorate([
    Class.Public()
], Element.prototype, "value", null);
__decorate([
    Class.Public()
], Element.prototype, "searchable", null);
__decorate([
    Class.Public()
], Element.prototype, "required", null);
__decorate([
    Class.Public()
], Element.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Element.prototype, "disabled", null);
__decorate([
    Class.Public()
], Element.prototype, "focus", null);
__decorate([
    Class.Public()
], Element.prototype, "reset", null);
__decorate([
    Class.Public()
], Element.prototype, "checkValidity", null);
__decorate([
    Class.Public()
], Element.prototype, "setCustomValidity", null);
__decorate([
    Class.Public()
], Element.prototype, "addGroup", null);
__decorate([
    Class.Public()
], Element.prototype, "addOption", null);
__decorate([
    Class.Public()
], Element.prototype, "clear", null);
__decorate([
    Class.Public()
], Element.prototype, "open", null);
__decorate([
    Class.Public()
], Element.prototype, "close", null);
__decorate([
    Class.Public()
], Element.prototype, "toggle", null);
Element = __decorate([
    JSX.Describe('swe-select'),
    Class.Describe()
], Element);
exports.Element = Element;
