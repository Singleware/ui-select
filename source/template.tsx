/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Selection } from './selection';
import { Element } from './element';
import { States } from './states';
import { Option } from './option';

/**
 * Select template class.
 */
@Class.Describe()
export class Template extends Control.Component<Properties> {
  /**
   * Select states.
   */
  @Class.Private()
  private states = {
    name: '',
    selection: void 0,
    options: [],
    readOnly: false,
    required: false
  } as States;

  /**
   * Input slot.
   */
  @Class.Private()
  private inputSlot = <slot name="input" class="input" /> as HTMLSlotElement;

  /**
   * Arrow slot.
   */
  @Class.Private()
  private arrowSlot = <slot name="arrow" class="arrow" /> as HTMLSlotElement;

  /**
   * List slot.
   */
  @Class.Private()
  private listSlot = <slot name="list" class="list" /> as HTMLSlotElement;

  /**
   * List of default nodes.
   */
  @Class.Private()
  private defaultNodes = [] as Node[];

  /**
   * Select element.
   */
  @Class.Private()
  private select = (
    <label class="select">
      <div class="field">
        {this.inputSlot}
        {this.arrowSlot}
      </div>
    </label>
  ) as HTMLLabelElement;

  /**
   * Select styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host > .select {
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
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Select skeleton.
   */
  @Class.Private()
  private skeleton = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

  /**
   * Changes the input content with the specified option information.
   * @param option Option information.
   */
  @Class.Private()
  private changeInput(option: Option): void {
    const field = Control.getChildByProperty(this.inputSlot, 'value') as any;
    if (field) {
      if (field instanceof HTMLButtonElement) {
        DOM.append(DOM.clear(field), option.label instanceof HTMLElement ? option.label.cloneNode(true) : option.label);
      } else if (field instanceof HTMLInputElement) {
        field.value = option.label instanceof HTMLElement ? option.label.innerText : (option.label as string);
      }
      if (option.value.length) {
        field.setCustomValidity('');
        field.dataset.valid = 'on';
        delete field.dataset.invalid;
      } else if (this.required) {
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
  @Class.Private()
  private selectOption(option: Option): void {
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
  @Class.Private()
  private buildOptionList(): void {
    const children = this.listSlot.assignedNodes() as HTMLElement[];
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
  @Class.Private()
  private toggleHandler(event: Event): void {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    document.addEventListener('click', this.close.bind(this));
    this.inputSlot.addEventListener('click', this.toggleHandler.bind(this));
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
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
  @Class.Private()
  private assignProperties(): void {
    this.assignComponentProperties(this.properties, ['name', 'value', 'required', 'readOnly', 'disabled']);
  }

  /**
   * Initializes the component.
   */
  @Class.Private()
  private initialize(): void {
    const field = Control.getChildByProperty(this.inputSlot, 'value') as HTMLElement;
    if (field instanceof HTMLButtonElement) {
      for (const child of field.childNodes) {
        this.defaultNodes.push(child);
      }
    } else if (field instanceof HTMLInputElement) {
      field.readOnly = true;
    }
  }

  /**
   * Default constructor.
   * @param properties Select properties.
   * @param children Select children.
   */
  constructor(properties?: Properties, children?: any[]) {
    super(properties, children);
    DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.select);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
    this.initialize();
  }

  /**
   * Get select name.
   */
  @Class.Public()
  public get name(): string {
    return Control.getChildProperty(this.inputSlot, 'name');
  }

  /**
   * Set select name.
   */
  public set name(name: string) {
    Control.setChildProperty(this.inputSlot, 'name', name);
  }

  /**
   * Get select value.
   */
  @Class.Public()
  public get value(): string | undefined {
    return this.states.selection ? this.states.selection.value : void 0;
  }

  /**
   * Set select value.
   */
  public set value(value: string | undefined) {
    const field = Control.getChildByProperty(this.inputSlot, 'value') as HTMLElement;
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
      } else if (field instanceof HTMLInputElement) {
        field.value = '';
      }
    }
  }

  /**
   * Get default value.
   */
  @Class.Public()
  public get defaultValue(): string | undefined {
    return this.properties.value;
  }

  /**
   * Get selected option.
   */
  @Class.Public()
  public get selection(): Selection | undefined {
    const selection = this.states.selection;
    if (selection) {
      return { label: selection.label, value: selection.value, group: selection.group };
    }
    return void 0;
  }

  /**
   * Get empty state.
   */
  @Class.Public()
  public get empty(): any {
    return this.selection === void 0;
  }

  /**
   * Get opened state.
   */
  @Class.Public()
  public get opened(): any {
    return this.listSlot.isConnected;
  }

  /**
   * Get required state.
   */
  @Class.Public()
  public get required(): boolean {
    return this.states.required;
  }

  /**
   * Set required state.
   */
  public set required(state: boolean) {
    Control.setChildProperty(this.inputSlot, 'required', (this.states.required = state));
  }

  /**
   * Get read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.states.readOnly;
  }

  /**
   * Set read-only state.
   */
  public set readOnly(state: boolean) {
    if ((this.states.readOnly = state)) {
      this.close();
    }
  }

  /**
   * Get disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return Control.getChildProperty(this.inputSlot, 'disabled');
  }

  /**
   * Set disabled state.
   */
  public set disabled(state: boolean) {
    Control.setChildProperty(this.inputSlot, 'disabled', state);
    if (state) {
      this.close();
    }
  }

  /**
   * Select element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Reset the select to its initial option and state.
   */
  @Class.Public()
  public reset(): void {
    this.value = this.defaultValue;
  }

  /**
   * Adds the specified option into the options list.
   * @param label Option text label.
   * @param value Option value.
   * @param group Option group.
   * @returns Returns the generated option element.
   */
  @Class.Public()
  public add(label: JSX.Element, value: string, group?: string): HTMLDivElement {
    const element = <div class="option">{label || value}</div> as HTMLDivElement;
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
  @Class.Public()
  public clear(): void {
    this.states.options = [];
    this.close();
  }

  /**
   * Opens the options list.
   */
  @Class.Public()
  public open(): void {
    if (!this.readOnly && !this.disabled) {
      DOM.append(this.select, this.listSlot);
      this.buildOptionList();
      this.skeleton.dataset.open = 'on';
    }
  }

  /**
   * Closes the options list.
   */
  @Class.Public()
  public close(): void {
    this.listSlot.remove();
    delete this.skeleton.dataset.open;
  }

  /**
   * Toggles the options list.
   */
  @Class.Public()
  public toggle(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Checks the select validity.
   * @returns Returns true when the select is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    return !this.required || !this.empty;
  }

  /**
   * Reports the select validity.
   * @returns Returns true when the select is valid, false otherwise.
   */
  @Class.Public()
  public reportValidity(): boolean {
    return this.checkValidity();
  }

  /**
   * Set the custom validity error message.
   * @param error Custom error message.
   */
  @Class.Public()
  public setCustomValidity(error?: string): void {
    const field = Control.getChildByProperty(this.inputSlot, 'setCustomValidity') as any;
    if (field) {
      field.setCustomValidity(error);
    }
  }
}
