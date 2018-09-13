"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic select input element.
 */
const Select = require("../source");
const DOM = require("@singleware/jsx");
const field = (DOM.create(Select.Template, null,
    DOM.create("input", { slot: "input", type: "text" }),
    DOM.create("div", { slot: "list" }),
    DOM.create("div", { slot: "arrow" })));
// Change disabled property of the element.
field.disabled = true;
// Change read-only property of the element.
field.readOnly = true;
// Change required property of the element.
field.required = true;
// Change name property of the element.
field.name = 'new-name';
// Change value property of the element.
field.value = 'new-value';
// Add field values.
field.add(DOM.create("b", null, "Value"), 'value');
field.add(DOM.create("b", null, "New value"), 'new-value');
