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
const Control = require("@singleware/ui-control");
/**
 * Select component class.
 */
let Component = class Component extends Control.Component {
    /**
     * Default constructor.
     * @param properties Initial properties.
     * @param children Initial children.
     */
    constructor(properties, children) {
        super(properties, children);
        /**
         * Element instance.
         */
        this.skeleton = (JSX.create("swe-select", { class: this.properties.class, slot: this.properties.slot, name: this.properties.name, searchable: this.properties.searchable, required: this.properties.required, readOnly: this.properties.readOnly, disabled: this.properties.disabled, onFocus: this.properties.onFocus, onBlur: this.properties.onBlur, onChange: this.properties.onChange }, this.children));
        this.skeleton.addEventListener('renderoption', this.renderOptionHandler.bind(this));
        this.skeleton.addEventListener('renderselection', this.renderSelectionHandler.bind(this));
        this.skeleton.addEventListener('rendergroup', this.renderGroupHandler.bind(this));
        this.initialize();
    }
    /**
     * Render option, event handler.
     * @param event Event information.
     */
    renderOptionHandler(event) {
        if (this.properties.onRenderOption) {
            event.detail.element = this.properties.onRenderOption(event.detail.option);
        }
    }
    /**
     * Render selection, event handler.
     * @param event Event information.
     */
    renderSelectionHandler(event) {
        if (this.properties.onRenderSelection) {
            event.detail.element = this.properties.onRenderSelection(event.detail.option);
        }
    }
    /**
     * Render group, event handler.
     * @param event Event information.
     */
    renderGroupHandler(event) {
        if (this.properties.onRenderGroup) {
            event.detail.element = this.properties.onRenderGroup(event.detail.group);
        }
    }
    /**
     * Add the specified list of options.
     * @param options List of options.
     */
    addOptions(options) {
        for (const option of options) {
            if (typeof option !== 'string') {
                this.skeleton.addOption(option.value, option.label, { group: option.group, tags: option.tags, custom: option.custom });
            }
            else {
                this.skeleton.addOption(option, option);
            }
        }
    }
    /**
     * Initializes the select element adding options and selecting the specified value.
     */
    initialize() {
        if (this.properties.options) {
            this.addOptions(this.properties.options);
            if (this.properties.value) {
                this.skeleton.value = this.properties.value;
            }
        }
    }
    /**
     * Gets the element.
     */
    get element() {
        return this.skeleton;
    }
    /**
     * Gets the selected option.
     */
    get selection() {
        return this.skeleton.selection;
    }
    /**
     * Gets the current search.
     */
    get search() {
        return this.skeleton.search;
    }
    /**
     * Gets the opened state.
     */
    get opened() {
        return this.skeleton.opened;
    }
    /**
     * Gets the options found state.
     */
    get found() {
        return this.skeleton.found;
    }
    /**
     * Gets the total number of options.
     */
    get count() {
        return this.skeleton.count;
    }
    /**
     * Gets the empty state of the element.
     */
    get empty() {
        return this.skeleton.empty;
    }
    /**
     * Gets the element name.
     */
    get name() {
        return this.skeleton.name;
    }
    /**
     * Sets the element name.
     */
    set name(name) {
        this.skeleton.name = name;
    }
    /**
     * Gets the element value.
     */
    get value() {
        return this.skeleton.value;
    }
    /**
     * Sets the element value.
     */
    set value(value) {
        this.skeleton.value = value;
    }
    /**
     * Gets the default value of the element.
     */
    get defaultValue() {
        return this.skeleton.defaultValue;
    }
    /**
     * Sets the default value of the element.
     */
    set defaultValue(value) {
        this.skeleton.defaultValue = value;
    }
    /**
     * Gets the searchable state of the element.
     */
    get searchable() {
        return this.skeleton.searchable;
    }
    /**
     * Sets the searchable state of the element.
     */
    set searchable(state) {
        this.skeleton.searchable = state;
    }
    /**
     * Gets the required state of the element.
     */
    get required() {
        return this.skeleton.required;
    }
    /**
     * Sets the required state of the element.
     */
    set required(state) {
        this.skeleton.required = state;
    }
    /**
     * Gets the read-only state of the element.
     */
    get readOnly() {
        return this.skeleton.readOnly;
    }
    /**
     * Sets the read-only state of the element.
     */
    set readOnly(state) {
        this.skeleton.readOnly = state;
    }
    /**
     * Gets the disabled state of the element.
     */
    get disabled() {
        return this.skeleton.disabled;
    }
    /**
     * Sets the disabled state of the element.
     */
    set disabled(state) {
        this.skeleton.disabled = state;
    }
    /**
     * Move the focus to this element.
     */
    focus() {
        this.skeleton.focus();
    }
    /**
     * Reset the element value to its initial value.
     */
    reset() {
        this.skeleton.reset();
    }
    /**
     * Checks the element validity.
     * @returns Returns true when the element is valid, false otherwise.
     */
    checkValidity() {
        return this.skeleton.checkValidity();
    }
    /**
     * Set the element custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error) {
        this.skeleton.setCustomValidity(error);
    }
    /**
     * Adds the specified group into the groups list.
     * @param name Group name.
     * @param label Group label.
     */
    addGroup(name, label) {
        this.skeleton.addGroup(name, label);
    }
    /**
     * Adds the specified option into the options list.
     * @param value Option value.
     * @param label Option label.
     * @param data Option metadata.
     * @returns Returns true when the option has been added, false otherwise.
     */
    addOption(value, label, data = {}) {
        return this.skeleton.addOption(value, label, data);
    }
    /**
     * Removes all the options that corresponds to the specified option value.
     * @param value Option value.
     * @returns Returns true when some option was removed or false otherwise.
     */
    removeOption(value) {
        return this.skeleton.removeOption(value);
    }
    /**
     * Clear all options.
     */
    clear() {
        this.skeleton.clear();
    }
    /**
     * Opens the options list.
     */
    open() {
        this.skeleton.open();
    }
    /**
     * Closes the options list.
     */
    close() {
        this.skeleton.close();
    }
    /**
     * Toggles the options list.
     */
    toggle() {
        this.skeleton.toggle();
    }
};
__decorate([
    Class.Private()
], Component.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Component.prototype, "renderOptionHandler", null);
__decorate([
    Class.Private()
], Component.prototype, "renderSelectionHandler", null);
__decorate([
    Class.Private()
], Component.prototype, "renderGroupHandler", null);
__decorate([
    Class.Private()
], Component.prototype, "addOptions", null);
__decorate([
    Class.Private()
], Component.prototype, "initialize", null);
__decorate([
    Class.Public()
], Component.prototype, "element", null);
__decorate([
    Class.Public()
], Component.prototype, "selection", null);
__decorate([
    Class.Public()
], Component.prototype, "search", null);
__decorate([
    Class.Public()
], Component.prototype, "opened", null);
__decorate([
    Class.Public()
], Component.prototype, "found", null);
__decorate([
    Class.Public()
], Component.prototype, "count", null);
__decorate([
    Class.Public()
], Component.prototype, "empty", null);
__decorate([
    Class.Public()
], Component.prototype, "name", null);
__decorate([
    Class.Public()
], Component.prototype, "value", null);
__decorate([
    Class.Public()
], Component.prototype, "defaultValue", null);
__decorate([
    Class.Public()
], Component.prototype, "searchable", null);
__decorate([
    Class.Public()
], Component.prototype, "required", null);
__decorate([
    Class.Public()
], Component.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Component.prototype, "disabled", null);
__decorate([
    Class.Public()
], Component.prototype, "focus", null);
__decorate([
    Class.Public()
], Component.prototype, "reset", null);
__decorate([
    Class.Public()
], Component.prototype, "checkValidity", null);
__decorate([
    Class.Public()
], Component.prototype, "setCustomValidity", null);
__decorate([
    Class.Public()
], Component.prototype, "addGroup", null);
__decorate([
    Class.Public()
], Component.prototype, "addOption", null);
__decorate([
    Class.Public()
], Component.prototype, "removeOption", null);
__decorate([
    Class.Public()
], Component.prototype, "clear", null);
__decorate([
    Class.Public()
], Component.prototype, "open", null);
__decorate([
    Class.Public()
], Component.prototype, "close", null);
__decorate([
    Class.Public()
], Component.prototype, "toggle", null);
Component = __decorate([
    Class.Describe()
], Component);
exports.Component = Component;
