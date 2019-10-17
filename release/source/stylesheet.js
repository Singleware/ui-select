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
const OSS = require("@singleware/oss");
/**
 * Select stylesheet class.
 */
let Stylesheet = class Stylesheet extends OSS.Stylesheet {
    /**
     * Default constructor.
     */
    constructor() {
        super();
        /**
         * Select styles.
         */
        this.element = this.select(':host>.select');
        /**
         * Field styles.
         */
        this.field = this.select(':host(:not([opened]))>.select>.field');
        /**
         * Arrow styles.
         */
        this.arrow = this.select(':host>.select>.field>.arrow');
        /**
         * Unselect styles.
         */
        this.unselect = this.select(':host>.select>.field>.unselect');
        /**
         * Unselect active styles.
         */
        this.unselectActive = this.select(':host(:not([empty]))>.select>.field:hover>.unselect');
        /**
         * Slotted selection styles.
         */
        this.slottedSelection = this.select(':host>.select>.field>.input::slotted(*)');
        /**
         * Slotted input styles.
         */
        this.slottedInput = this.select(':host>.select>.field>.search::slotted(*)', ':host>.select>.field>.input::slotted(*)');
        /**
         * Slotted arrow styles.
         */
        this.slottedArrow = this.select(':host>.select>.field>.arrow::slotted(*)');
        /**
         * Slotted unselect styles.
         */
        this.slottedUnselect = this.select(':host>.select>.field>.unselect::slotted(*)');
        /**
         * Slotted unselect styles.
         */
        this.slottedUnselectBeforeAfter = this.select(':host>.select>.field>.unselect::slotted(*)::after', ':host>.select>.field>.unselect::slotted(*)::before');
        /**
         * Slotted unselect styles.
         */
        this.slottedUnselectBefore = this.select(':host>.select>.field>.unselect::slotted(*)::before');
        /**
         * Slotted unselect styles.
         */
        this.slottedUnselectAfter = this.select(':host>.select>.field>.unselect::slotted(*)::after');
        /**
         * Slotted arrow styles.
         */
        this.slottedResults = this.select(':host>.select>.result::slotted(*)', ':host>.select>.empty::slotted(*)');
        /**
         * Slotted hidden styles.
         */
        this.slottedHidden = this.select(':host([searchable][opened])>.select>.field>.input::slotted(*)', ':host([searchable]:not([opened]))>.select>.field>.search::slotted(*)', ':host(:not([searchable]))>.select>.field>.search::slotted(*)', ':host(:not([searchable]))>.select>.empty::slotted(*)', ':host(:not([opened]))>.select>.result::slotted(*)', ':host(:not([found]))>.select>.result::slotted(*)', ':host(:not([opened]))>.select>.empty::slotted(*)', ':host([opened][found])>.select>.empty::slotted(*)');
        this.element.display = 'flex';
        this.element.position = 'relative';
        this.element.flexDirection = 'column';
        this.element.position = 'relative';
        this.element.height = 'inherit';
        this.element.width = 'inherit';
        this.element.userSelect = 'none';
        this.field.display = 'flex';
        this.unselect.position = 'absolute';
        this.unselect.visibility = 'hidden';
        this.unselect.cursor = 'pointer';
        this.unselect.top = '0';
        this.unselect.bottom = '0';
        this.unselect.right = '0';
        this.unselectActive.visibility = 'visible';
        this.arrow.position = 'absolute';
        this.arrow.top = '0';
        this.arrow.bottom = '0';
        this.arrow.right = '0';
        this.slottedSelection.cursor = 'default';
        this.slottedInput.width = '100%';
        this.slottedInput.whiteSpace = 'nowrap';
        this.slottedInput.textAlign = 'left';
        this.slottedInput.paddingRight = '2.5rem';
        this.slottedUnselect.position = 'absolute';
        this.slottedUnselect.top = '50%';
        this.slottedUnselect.right = '1.5rem';
        this.slottedUnselect.width = '0.5rem';
        this.slottedUnselect.height = '0.5rem';
        this.slottedUnselect.transform = 'translate(-50%,-50%)';
        this.slottedUnselectBeforeAfter.content = '""';
        this.slottedUnselectBeforeAfter.position = 'absolute';
        this.slottedUnselectBeforeAfter.height = 'inherit';
        this.slottedUnselectBeforeAfter.width = '0.0625rem';
        this.slottedUnselectBeforeAfter.left = '0.25rem';
        this.slottedUnselectBeforeAfter.backgroundColor = 'black';
        this.slottedUnselectBefore.transform = 'rotate(45deg)';
        this.slottedUnselectAfter.transform = 'rotate(-45deg)';
        this.slottedArrow.position = 'absolute';
        this.slottedArrow.top = '50%';
        this.slottedArrow.right = '0.75rem';
        this.slottedArrow.width = '0';
        this.slottedArrow.height = '0';
        this.slottedArrow.transform = 'translate(-50%,-50%)';
        this.slottedArrow.borderLeft = '0.1875rem solid transparent';
        this.slottedArrow.borderRight = this.slottedArrow.borderLeft;
        this.slottedArrow.borderTop = '0.25rem solid black';
        this.slottedResults.display = 'block';
        this.slottedResults.position = 'absolute';
        this.slottedResults.border = '0.0625rem solid black';
        this.slottedResults.overflow = 'auto';
        this.slottedResults.top = '100%';
        this.slottedResults.width = '100%';
        this.slottedResults.zIndex = 1;
        this.slottedHidden.display = 'none';
    }
};
__decorate([
    Class.Private()
], Stylesheet.prototype, "element", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "field", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "arrow", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "unselect", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "unselectActive", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedSelection", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedInput", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedArrow", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedUnselect", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedUnselectBeforeAfter", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedUnselectBefore", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedUnselectAfter", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedResults", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "slottedHidden", void 0);
Stylesheet = __decorate([
    Class.Describe()
], Stylesheet);
exports.Stylesheet = Stylesheet;
