"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1;
"use strict";
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const JSX = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
const stylesheet_1 = require("./stylesheet");
/**
 * Select element.
 */
let Element = Element_1 = class Element extends Control.Element {
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
         * Map of options.
         */
        this.optionsMap = {};
        /**
         * List of active options.
         */
        this.activatedList = [];
        /**
         * Map of entity group by name.
         */
        this.groupsMap = {};
        /**
         * Map of element group by entity group.
         */
        this.groupElementMap = new WeakMap();
        /**
         * Map of element option by entity option.
         */
        this.optionElementMap = new WeakMap();
        /**
         * Determines whether the result or empty element slot can be closed or not.
         */
        this.canClose = true;
        /**
         * Element styles.
         */
        this.styles = new stylesheet_1.Stylesheet();
        /**
         * Input slot element.
         */
        this.inputSlot = (JSX.create("slot", { name: "input", class: "input", onClick: this.toggleListHandler.bind(this), onSlotChange: this.slotChangeHandler.bind(this) }));
        /**
         * Arrow slot element.
         */
        this.arrowSlot = JSX.create("slot", { name: "arrow", class: "arrow", onClick: this.toggleListHandler.bind(this) });
        /**
         * Unselect slot element.
         */
        this.unselectSlot = JSX.create("slot", { name: "unselect", class: "unselect", onClick: this.unselectHandler.bind(this) });
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
                this.unselectSlot,
                this.arrowSlot),
            this.resultSlot,
            this.emptySlot));
        /**
         * Select styles element.
         */
        this.selectStyles = JSX.create("style", { type: "text/css" }, this.styles.toString());
        const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.selectStyles, this.selectLayout);
        shadow.addEventListener('keydown', this.optionKeydownHandler.bind(this));
        this.inputSlot.addEventListener('focus', this.focusListHandler.bind(this), true);
        this.inputSlot.addEventListener('blur', this.blurListHandler.bind(this), true);
        this.searchSlot.addEventListener('blur', this.blurListHandler.bind(this), true);
    }
    /**
     * Update all validation attributes.
     */
    updateValidation() {
        this.updatePropertyState('empty', this.empty);
        this.updatePropertyState('invalid', !this.empty && !this.checkValidity());
    }
    /**
     * Updates the input element with the specified option entity.
     * @param option Option entity.
     */
    updateInputSelection(option) {
        const selection = this.renderSelectionElement(option);
        const input = this.getRequiredChildElement(this.inputSlot);
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
        const result = JSX.clear(this.getRequiredChildElement(this.resultSlot));
        const search = this.search;
        this.activatedList = [];
        for (const value in this.optionsMap) {
            const options = this.optionsMap[value];
            for (const option of options) {
                let element = this.optionElementMap.get(option);
                if (search.length === 0 || option.tags.find(tag => tag.includes(search))) {
                    this.activatedList.push(option);
                    if (option.group) {
                        const group = this.groupsMap[option.group];
                        if (group) {
                            element = JSX.append(this.groupElementMap.get(group), element);
                        }
                        else {
                            console.warn(`Option group '${option.group}' wasn't found.`);
                        }
                    }
                    JSX.append(result, element);
                }
                else if (option.group) {
                    element.remove();
                }
            }
        }
        if (this.selectedElement) {
            this.selectedElement.scrollIntoView({ block: 'center' });
        }
        this.updatePropertyState('found', this.activatedList.length !== 0);
    }
    /**
     * Renders a new option element for the specified option entity.
     * @param option Option entity.
     * @returns Returns the rendered option element.
     */
    renderOptionElement(option) {
        const detail = { option: option, element: void 0 };
        const event = new CustomEvent('renderoption', { bubbles: true, cancelable: true, detail: detail });
        if (this.dispatchEvent(event)) {
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
        const event = new CustomEvent('renderselection', { bubbles: true, cancelable: true, detail: detail });
        if (this.dispatchEvent(event)) {
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
        const event = new CustomEvent('rendergroup', { bubbles: true, cancelable: true, detail: detail });
        if (this.dispatchEvent(event)) {
            return JSX.create("div", { class: "group" }, detail.element || group.label);
        }
        return void 0;
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
        const options = this.optionsMap[value];
        if (options) {
            const option = options[0];
            if (option !== void 0) {
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
     * @returns Returns true when some option was selected, false otherwise.
     */
    selectOptionAndNotify(option) {
        if (option !== this.selectedOption) {
            const event = new Event('change', { bubbles: true, cancelable: true });
            const saved = this.selectedOption;
            this.selectOption(option);
            if (!this.dispatchEvent(event)) {
                if (saved) {
                    this.selectOption(saved);
                }
                else {
                    this.unselectOption();
                }
                return false;
            }
        }
        return true;
    }
    /**
     * Selects the previous option.
     * @returns Returns true when some option was selected, false otherwise.
     */
    selectPreviousOptionAndNotify() {
        const index = this.activatedList.indexOf(this.selectedOption);
        const option = this.activatedList[(index - 1 > -1 ? index : this.activatedList.length) - 1];
        return this.selectOptionAndNotify(option);
    }
    /**
     * Selects the next option.
     * @returns Returns true when some option was selected, false otherwise.
     */
    selectNextOptionAndNotify() {
        const index = this.activatedList.indexOf(this.selectedOption);
        const option = this.activatedList[index + 1 < this.activatedList.length ? index + 1 : 0];
        return this.selectOptionAndNotify(option);
    }
    /**
     * Selects the next first option that corresponds to the specified search.
     * @param search Search value.
     * @returns Returns true when some option was selected, false otherwise.
     */
    selectNextOptionBySearchAndNotify(search) {
        let index = this.activatedList.indexOf(this.selectedOption);
        for (let l = 0; l < this.activatedList.length; ++l) {
            const option = this.activatedList[++index % this.activatedList.length];
            if (option.tags.find(tag => tag.includes(search))) {
                return this.selectOptionAndNotify(option);
            }
        }
        return false;
    }
    /**
     * Unselects the current option, element and notifies the change.
     * @returns Returns true when the current option was unselected, false otherwise.
     */
    unselectOptionAndNotify() {
        if (this.selectedOption !== void 0) {
            const event = new Event('change', { bubbles: true, cancelable: true });
            const saved = this.selectedOption;
            this.unselectOption();
            if (!this.dispatchEvent(event)) {
                if (saved) {
                    this.selectOption(saved);
                }
                return false;
            }
        }
        return true;
    }
    /**
     * Unselects the current selected option.
     */
    unselectOption() {
        const input = this.getRequiredChildElement(this.inputSlot);
        if (input instanceof HTMLButtonElement) {
            JSX.append(JSX.clear(input), ...this.defaultNodes);
        }
        else if (input instanceof HTMLInputElement) {
            input.value = this.defaultText;
        }
        delete this.selectedElement.dataset.selected;
        this.selectedOption = void 0;
        this.selectedElement = void 0;
    }
    /**
     * Opens the option list result.
     */
    openList() {
        if (this.searchable) {
            const search = this.getRequiredChildElement(this.searchSlot);
            if (search.reset instanceof Function) {
                search.reset();
            }
            else if ('value' in search) {
                search.value = search.defaultValue;
            }
            if (search.focus instanceof Function) {
                search.focus();
            }
            this.canClose = false;
        }
        this.updateResultList();
        this.updatePropertyState('opened', true);
    }
    /**
     * Closes the option list result.
     */
    closeList() {
        this.updatePropertyState('found', false);
        this.updatePropertyState('opened', false);
    }
    /**
     * Gets the normalized tag list based on the specified input tags.
     * @param inputs Input tags.
     * @returns Returns the generated tag list.
     */
    getTagList(inputs) {
        const tags = [];
        for (const input of inputs) {
            if (input instanceof Element_1) {
                tags.push(input.innerText.toLocaleLowerCase());
            }
            else if (input !== void 0) {
                tags.push(input.toLocaleLowerCase());
            }
        }
        return tags;
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
            if (this.open()) {
                event.preventDefault();
                this.focus();
            }
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
        else if (!this.searchable && this.selectNextOptionBySearchAndNotify(event.key)) {
            event.preventDefault();
        }
    }
    /**
     * Updates the current selection into the new input slot element.
     */
    slotChangeHandler() {
        const input = this.getRequiredChildElement(this.inputSlot);
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
            const event = new Event('focus', { bubbles: true, cancelable: true });
            this.dispatchEvent(event);
        }
    }
    /**
     * Blur list, event handler.
     */
    blurListHandler() {
        if (this.canClose) {
            const event = new Event('blur', { bubbles: true, cancelable: true });
            if (this.dispatchEvent(event)) {
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
     * Unselect current option, event handler.
     */
    unselectHandler() {
        if (this.unselectOptionAndNotify()) {
            this.updateValidation();
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
        return this.searchable ? this.getRequiredChildElement(this.searchSlot).value : '';
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
     * Gets the number of active options.
     */
    get count() {
        return this.activatedList.length;
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
        this.setRequiredChildProperty(this.inputSlot, 'name', name);
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
            if (this.selectedOption) {
                this.unselectOption();
                this.updateValidation();
            }
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
        this.updatePropertyState('searchable', state);
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
        this.setRequiredChildProperty(this.inputSlot, 'required', state);
        this.updatePropertyState('required', state);
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
        this.updatePropertyState('readonly', state);
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
        this.updatePropertyState('disabled', this.setRequiredChildProperty(this.inputSlot, 'disabled', state) && state);
    }
    /**
     * Move the focus to this element.
     */
    focus() {
        this.callRequiredChildMethod(this.searchable && this.opened ? this.searchSlot : this.inputSlot, 'focus', []);
    }
    /**
     * Reset the element value to its initial value.
     */
    reset() {
        this.value = this.defaultValue;
    }
    /**
     * Checks the element validity.
     * @returns Returns true when the element is valid, false otherwise.
     */
    checkValidity() {
        return ((!this.required || (this.value !== void 0 && this.value.length !== 0)) &&
            this.callRequiredChildMethod(this.inputSlot, 'checkValidity', []) !== false);
    }
    /**
     * Sets the element custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error) {
        this.callRequiredChildMethod(this.inputSlot, 'setCustomValidity', [error]);
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
            this.groupsMap[name] = group;
            this.groupElementMap.set(group, element);
            this.updateResultList();
        }
    }
    /**
     * Adds the specified option into the options list.
     * @param value Option value.
     * @param label Option label.
     * @param data Option metadata.
     * @returns Returns true when the option has been added, false otherwise.
     */
    addOption(value, label, data = {}) {
        const option = {
            value: value,
            label: label,
            group: data.group,
            tags: this.getTagList(data.tags || [label]),
            custom: data.custom || {}
        };
        const element = this.renderOptionElement(option);
        if (element) {
            if (!(this.optionsMap[value] instanceof Array)) {
                this.optionsMap[value] = [];
            }
            this.optionsMap[value].push(option);
            this.optionElementMap.set(option, element);
            this.updateResultList();
            return true;
        }
        return false;
    }
    /**
     * Remove all options that corresponds to the specified option value.
     * @param value Option value.
     * @returns Returns true when some option was removed or false otherwise.
     */
    removeOption(value) {
        const options = this.optionsMap[value];
        if (options) {
            for (const option of options) {
                this.optionElementMap.get(option).remove();
            }
            delete this.optionsMap[value];
            this.updateResultList();
            return true;
        }
        return false;
    }
    /**
     * Clear all options.
     */
    clear() {
        if (this.selectedOption) {
            this.unselectOption();
            this.updateValidation();
        }
        for (const value in this.optionsMap) {
            const options = this.optionsMap[value];
            for (const option of options) {
                this.optionElementMap.get(option).remove();
            }
        }
        this.optionsMap = {};
        this.updatePropertyState('found', false);
        JSX.clear(this.getRequiredChildElement(this.resultSlot));
    }
    /**
     * Opens the options list.
     * @returns Returns true when the options list was closed, false otherwise.
     */
    open() {
        if (!this.readOnly && !this.disabled && !this.opened) {
            return this.openList(), true;
        }
        return false;
    }
    /**
     * Closes the options list.
     * @returns Returns true when the options list was closed, false otherwise.
     */
    close() {
        if (this.opened) {
            return this.closeList(), true;
        }
        return false;
    }
    /**
     * Toggles the options list.
     */
    toggle() {
        if (this.opened) {
            this.closeList();
        }
        else {
            this.openList();
        }
    }
};
__decorate([
    Class.Private()
], Element.prototype, "defaultText", void 0);
__decorate([
    Class.Private()
], Element.prototype, "defaultNodes", void 0);
__decorate([
    Class.Private()
], Element.prototype, "optionsMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "activatedList", void 0);
__decorate([
    Class.Private()
], Element.prototype, "groupsMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "groupElementMap", void 0);
__decorate([
    Class.Private()
], Element.prototype, "optionElementMap", void 0);
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
], Element.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Element.prototype, "inputSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "arrowSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "unselectSlot", void 0);
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
], Element.prototype, "unselectOptionAndNotify", null);
__decorate([
    Class.Private()
], Element.prototype, "unselectOption", null);
__decorate([
    Class.Private()
], Element.prototype, "openList", null);
__decorate([
    Class.Private()
], Element.prototype, "closeList", null);
__decorate([
    Class.Private()
], Element.prototype, "getTagList", null);
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
    Class.Private()
], Element.prototype, "unselectHandler", null);
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
], Element.prototype, "defaultValue", void 0);
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
], Element.prototype, "removeOption", null);
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
Element = Element_1 = __decorate([
    JSX.Describe('swe-select'),
    Class.Describe()
], Element);
exports.Element = Element;
