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
const DOM = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
/**
 * Select template class.
 */
let Template = class Template extends Control.Component {
    /**
     * Default constructor.
     * @param properties Select properties.
     * @param children Select children.
     */
    constructor(properties, children) {
        super(properties, children);
        /**
         * Select states.
         */
        this.states = {
            name: '',
            selection: void 0,
            options: [],
            readOnly: false,
            required: false
        };
        /**
         * Input slot.
         */
        this.inputSlot = DOM.create("slot", { name: "input", class: "input" });
        /**
         * Arrow slot.
         */
        this.arrowSlot = DOM.create("slot", { name: "arrow", class: "arrow" });
        /**
         * List slot.
         */
        this.listSlot = DOM.create("slot", { name: "list", class: "list" });
        /**
         * List of default nodes.
         */
        this.defaultNodes = [];
        /**
         * Select element.
         */
        this.select = (DOM.create("label", { class: "select" },
            DOM.create("div", { class: "field" },
                this.inputSlot,
                this.arrowSlot)));
        /**
         * Select styles.
         */
        this.styles = (DOM.create("style", null, `:host > .select {
  display: flex;
  flex-direction: column;
  position: relative;
  height: inherit;
  width: inherit;
  user-select: none;
}
:host > .select > .field > .input::slotted(*) {
  cursor: default;
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
  right: 0.75rem;
  width: 0;
  height: 0;
  transform: translate(-50%,-50%);
  border-left: 0.1875rem solid transparent;
  border-right: 0.1875rem solid transparent;
  border-top: 0.25rem solid black;
}
:host > .select > .list::slotted(*) {
  display: block;
  position: absolute;
  border: 0.0625rem solid black;
  top: 100%;
  width: 100%;
  z-index: 1;
}`));
        /**
         * Select skeleton.
         */
        this.skeleton = (DOM.create("div", { slot: this.properties.slot, class: this.properties.class }, this.children));
        DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.select);
        this.bindHandlers();
        this.bindProperties();
        this.assignProperties();
        this.initialize();
    }
    /**
     * Changes the input content with the specified option information.
     * @param option Option information.
     */
    changeInput(option) {
        const field = Control.getChildByProperty(this.inputSlot, 'value');
        if (field) {
            if (field instanceof HTMLButtonElement) {
                DOM.append(DOM.clear(field), option.label instanceof HTMLElement ? option.label.cloneNode(true) : option.label);
            }
            else if (field instanceof HTMLInputElement) {
                field.value = option.label instanceof HTMLElement ? option.label.innerText : option.label;
            }
            if (option.value.length) {
                field.setCustomValidity('');
                field.dataset.valid = 'on';
                delete field.dataset.invalid;
            }
            else if (this.required) {
                field.setCustomValidity('Please select a valid option.');
                field.dataset.invalid = 'on';
                delete field.dataset.valid;
            }
            delete field.dataset.empty;
        }
    }
    /**
     * Selects the specified option.
     * @param option Option information.
     */
    selectOption(option) {
        this.changeInput(option);
        if (this.states.selection) {
            delete this.states.selection.element.dataset.active;
        }
        option.element.dataset.active = 'on';
        this.states.selection = option;
        this.close();
    }
    /**
     * Build the result options list.
     */
    buildOptionList() {
        const children = this.listSlot.assignedNodes();
        for (const child of children) {
            DOM.clear(child);
            for (const option of this.states.options) {
                DOM.append(child, option.element);
            }
        }
    }
    /**
     * Toggle event handler.
     * @param event Event information.
     */
    toggleHandler(event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (this.opened) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Bind event handlers to update the custom element.
     */
    bindHandlers() {
        document.addEventListener('click', this.close.bind(this));
        this.inputSlot.addEventListener('click', this.toggleHandler.bind(this));
    }
    /**
     * Bind exposed properties to the custom element.
     */
    bindProperties() {
        this.bindComponentProperties(this.skeleton, [
            'name',
            'value',
            'defaultValue',
            'selection',
            'empty',
            'opened',
            'required',
            'readOnly',
            'disabled',
            'checkValidity',
            'reportValidity',
            'setCustomValidity',
            'reset',
            'add',
            'clear',
            'open',
            'close',
            'toggle'
        ]);
    }
    /**
     * Assign all element properties.
     */
    assignProperties() {
        this.assignComponentProperties(this.properties, ['name', 'value', 'required', 'readOnly', 'disabled']);
    }
    /**
     * Initializes the component.
     */
    initialize() {
        const field = Control.getChildByProperty(this.inputSlot, 'value');
        if (field instanceof HTMLButtonElement) {
            for (const child of field.childNodes) {
                this.defaultNodes.push(child);
            }
        }
        else if (field instanceof HTMLInputElement) {
            field.readOnly = true;
        }
    }
    /**
     * Get select name.
     */
    get name() {
        return Control.getChildProperty(this.inputSlot, 'name');
    }
    /**
     * Set select name.
     */
    set name(name) {
        Control.setChildProperty(this.inputSlot, 'name', name);
    }
    /**
     * Get select value.
     */
    get value() {
        return this.states.selection ? this.states.selection.value : void 0;
    }
    /**
     * Set select value.
     */
    set value(value) {
        const field = Control.getChildByProperty(this.inputSlot, 'value');
        this.states.selection = void 0;
        for (const current of this.states.options) {
            if (current.value === value) {
                this.selectOption(current);
                return;
            }
        }
        if (!this.states.selection) {
            field.dataset.empty = 'on';
            if (field instanceof HTMLButtonElement) {
                DOM.append(DOM.clear(field), ...this.defaultNodes);
            }
            else if (field instanceof HTMLInputElement) {
                field.value = '';
            }
        }
    }
    /**
     * Get default value.
     */
    get defaultValue() {
        return this.properties.value;
    }
    /**
     * Get selected option.
     */
    get selection() {
        const selection = this.states.selection;
        if (selection) {
            return { label: selection.label, value: selection.value, group: selection.group };
        }
        return void 0;
    }
    /**
     * Get empty state.
     */
    get empty() {
        return this.selection === void 0;
    }
    /**
     * Get opened state.
     */
    get opened() {
        return this.listSlot.isConnected;
    }
    /**
     * Get required state.
     */
    get required() {
        return this.states.required;
    }
    /**
     * Set required state.
     */
    set required(state) {
        Control.setChildProperty(this.inputSlot, 'required', (this.states.required = state));
    }
    /**
     * Get read-only state.
     */
    get readOnly() {
        return this.states.readOnly;
    }
    /**
     * Set read-only state.
     */
    set readOnly(state) {
        if ((this.states.readOnly = state)) {
            this.close();
        }
    }
    /**
     * Get disabled state.
     */
    get disabled() {
        return Control.getChildProperty(this.inputSlot, 'disabled');
    }
    /**
     * Set disabled state.
     */
    set disabled(state) {
        Control.setChildProperty(this.inputSlot, 'disabled', state);
        if (state) {
            this.close();
        }
    }
    /**
     * Select element.
     */
    get element() {
        return this.skeleton;
    }
    /**
     * Reset the select to its initial option and state.
     */
    reset() {
        this.value = this.defaultValue;
    }
    /**
     * Adds the specified option into the options list.
     * @param label Option text label.
     * @param value Option value.
     * @param group Option group.
     * @returns Returns the generated option element.
     */
    add(label, value, group) {
        const element = DOM.create("div", { class: "option" }, label || value);
        const option = { element: element, value: value, label: label, group: group };
        element.addEventListener('click', () => {
            this.close();
            this.selectOption(option);
            this.skeleton.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
        });
        this.states.options.push(option);
        if (this.value === value) {
            this.selectOption(option);
        }
        return element;
    }
    /**
     * Clear all options.
     */
    clear() {
        this.states.options = [];
        this.close();
    }
    /**
     * Opens the options list.
     */
    open() {
        if (!this.readOnly && !this.disabled) {
            DOM.append(this.select, this.listSlot);
            this.buildOptionList();
            this.skeleton.dataset.open = 'on';
        }
    }
    /**
     * Closes the options list.
     */
    close() {
        this.listSlot.remove();
        delete this.skeleton.dataset.open;
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
    /**
     * Checks the select validity.
     * @returns Returns true when the select is valid, false otherwise.
     */
    checkValidity() {
        return !this.required || !this.empty;
    }
    /**
     * Reports the select validity.
     * @returns Returns true when the select is valid, false otherwise.
     */
    reportValidity() {
        return this.checkValidity();
    }
    /**
     * Set the custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error) {
        const field = Control.getChildByProperty(this.inputSlot, 'setCustomValidity');
        if (field) {
            field.setCustomValidity(error);
        }
    }
};
__decorate([
    Class.Private()
], Template.prototype, "states", void 0);
__decorate([
    Class.Private()
], Template.prototype, "inputSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "arrowSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "listSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "defaultNodes", void 0);
__decorate([
    Class.Private()
], Template.prototype, "select", void 0);
__decorate([
    Class.Private()
], Template.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Template.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Template.prototype, "changeInput", null);
__decorate([
    Class.Private()
], Template.prototype, "selectOption", null);
__decorate([
    Class.Private()
], Template.prototype, "buildOptionList", null);
__decorate([
    Class.Private()
], Template.prototype, "toggleHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "bindHandlers", null);
__decorate([
    Class.Private()
], Template.prototype, "bindProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "assignProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "initialize", null);
__decorate([
    Class.Public()
], Template.prototype, "name", null);
__decorate([
    Class.Public()
], Template.prototype, "value", null);
__decorate([
    Class.Public()
], Template.prototype, "defaultValue", null);
__decorate([
    Class.Public()
], Template.prototype, "selection", null);
__decorate([
    Class.Public()
], Template.prototype, "empty", null);
__decorate([
    Class.Public()
], Template.prototype, "opened", null);
__decorate([
    Class.Public()
], Template.prototype, "required", null);
__decorate([
    Class.Public()
], Template.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Template.prototype, "disabled", null);
__decorate([
    Class.Public()
], Template.prototype, "element", null);
__decorate([
    Class.Public()
], Template.prototype, "reset", null);
__decorate([
    Class.Public()
], Template.prototype, "add", null);
__decorate([
    Class.Public()
], Template.prototype, "clear", null);
__decorate([
    Class.Public()
], Template.prototype, "open", null);
__decorate([
    Class.Public()
], Template.prototype, "close", null);
__decorate([
    Class.Public()
], Template.prototype, "toggle", null);
__decorate([
    Class.Public()
], Template.prototype, "checkValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reportValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "setCustomValidity", null);
Template = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
