/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic select input element.
 */
import * as Select from '../source';
import * as JSX from '@singleware/jsx';

const field = (
  <Select.Component>
    <input slot="input" type="text" />
    <input slot="search" type="text" />
    <div slot="arrow" />
    <div slot="result" />
    <div slot="empty">No results found.</div>
  </Select.Component>
) as Select.Element;

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
field.addOption('value', 'Value');
field.addOption('new-value', 'New value');
