/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as JSX from '@singleware/jsx';

import * as Render from './render';
import * as Internals from './internals';

/**
 * Select element.
 */
@JSX.Describe('swe-select')
@Class.Describe()
export class Element extends HTMLElement {
  /**
   * Default value for resets.
   */
  @Class.Public()
  public defaultValue: any;

  /**
   * Default text for no selections in the text input.
   */
  @Class.Private()
  private defaultText = '';

  /**
   * Default nodes for no selections in the button input.
   */
  @Class.Private()
  private defaultNodes = [] as Node[];

  /**
   * List of options.
   */
  @Class.Private()
  private optionsList = [] as Internals.Option[];

  /**
   * List of active options.
   */
  @Class.Private()
  private activatedList = [] as Internals.Option[];

  /**
   * Map of option entity by option element.
   */
  @Class.Private()
  private optionsMap = new WeakMap<HTMLElement, Internals.Option>();

  /**
   * Map of option element by option entity.
   */
  @Class.Private()
  private optionElementMap = new WeakMap<Internals.Option, HTMLElement>();

  /**
   * Map of group entity by name.
   */
  @Class.Private()
  private groupsMap = new Map<string, Internals.Group>();

  /**
   * Map of group element by group entity.
   */
  @Class.Private()
  private groupElementMap = new WeakMap<Internals.Group, HTMLElement>();

  /**
   * Current option selected.
   */
  @Class.Private()
  private selectedOption?: Internals.Option;

  /**
   * Current element selected.
   */
  @Class.Private()
  private selectedElement?: HTMLElement;

  /**
   * Determines whether the result or empty element slot can be closed or not.
   */
  @Class.Private()
  private canClose = true;

  /**
   * Input slot element.
   */
  @Class.Private()
  private inputSlot = <slot name="input" class="input" onClick={this.toggleListHandler.bind(this)} /> as HTMLSlotElement;

  /**
   * Arrow slot element.
   */
  @Class.Private()
  private arrowSlot = <slot name="arrow" class="arrow" onClick={this.toggleListHandler.bind(this)} /> as HTMLSlotElement;

  /**
   * Search slot element.
   */
  @Class.Private()
  private searchSlot = <slot name="search" class="search" onKeyUp={this.updateResultList.bind(this)} /> as HTMLSlotElement;

  /**
   * Result slot element.
   */
  @Class.Private()
  private resultSlot = <slot name="result" class="result" onMouseDown={this.preventCloseHandler.bind(this)} /> as HTMLSlotElement;

  /**
   * Empty slot element.
   */
  @Class.Private()
  private emptySlot = (
    <slot name="empty" class="empty" onMouseDown={this.preventCloseHandler.bind(this)} onClick={this.closeListHandler.bind(this)} />
  ) as HTMLSlotElement;

  /**
   * Select layout element.
   */
  @Class.Private()
  private selectLayout = (
    <label class="select">
      <div class="field">
        {this.searchSlot}
        {this.inputSlot}
        {this.arrowSlot}
      </div>
      {this.resultSlot}
      {this.emptySlot}
    </label>
  ) as HTMLLabelElement;

  /**
   * Select styles element.
   */
  @Class.Private()
  private selectStyles = (
    <style>
      {`:host > .select {
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
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Gets the first child element from the specified slot element.
   * @param slot Slot element.
   * @throws Throws an error when there are no children in the specified slot.
   * @returns Returns the first child element.
   */
  @Class.Private()
  private getChildElement(slot: HTMLSlotElement): HTMLElement {
    const child = slot.assignedNodes()[0];
    if (!child) {
      throw new Error(`There are no children in the '${slot.name}' slot.`);
    }
    return child as HTMLElement;
  }

  /**
   * Sets the property into the first child from specified slot element.
   * @param slot Slot element.
   * @param property Property name.
   * @param value Property value.
   * @throws Throws an error when there are no children in the specified slot.
   * @returns Returns true when the specified property has been assigned, false otherwise.
   */
  @Class.Private()
  private setChildProperty(slot: HTMLSlotElement, property: string, value: any): boolean {
    const child = this.getChildElement(slot) as any;
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
  @Class.Private()
  private updateState(name: string, state: boolean): void {
    if (state) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  /**
   * Update all validation attributes.
   */
  @Class.Private()
  private updateValidation(): void {
    this.updateState('empty', this.empty);
    this.updateState('invalid', !this.empty && !this.checkValidity());
  }

  /**
   * Updates the input element with the specified option entity.
   * @param option Option entity.
   */
  @Class.Private()
  private updateInputSelection(option: Internals.Option): void {
    const selection = this.renderSelectionElement(option);
    const input = this.getChildElement(this.inputSlot);
    if (input instanceof HTMLButtonElement) {
      JSX.append(JSX.clear(input), selection);
    } else if (input instanceof HTMLInputElement) {
      input.value = selection ? selection.innerText : '';
    }
  }

  /**
   * Updates the result element with any option found.
   */
  @Class.Private()
  private updateResultList(): void {
    const result = JSX.clear(this.getChildElement(this.resultSlot)) as HTMLElement;
    const search = this.search;
    this.activatedList = [];
    for (const option of this.optionsList) {
      let element = this.optionElementMap.get(option) as HTMLElement;
      if (search === void 0 || option.tags.find(tag => tag.includes(search))) {
        this.activatedList.push(option);
        if (option.group) {
          const group = this.groupsMap.get(option.group) as Internals.Group;
          if (group) {
            element = JSX.append(this.groupElementMap.get(group) as HTMLElement, element) as HTMLElement;
          } else {
            console.warn(`Option group '${option.group}' does not exists.`);
          }
        }
        JSX.append(result, element);
      } else if (option.group) {
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
  @Class.Private()
  private renderOptionElement(option: Internals.Option): HTMLElement | undefined {
    const detail = { option: option, element: void 0 } as Render.Option;
    if (this.dispatchEvent(new CustomEvent<Render.Option>('renderoption', { bubbles: true, cancelable: true, detail: detail }))) {
      return (
        <div class="option" onClick={this.optionClickHandler.bind(this, option)}>
          {detail.element || option.label || option.value}
        </div>
      ) as HTMLDivElement;
    }
    return void 0;
  }

  /**
   * Renders a new selection result for the specified option entity.
   * @param option Option entity.
   * @returns Returns the rendered selection result.
   */
  @Class.Private()
  private renderSelectionElement(option: Internals.Option): HTMLElement | undefined {
    const detail = { option: option, element: void 0 } as Render.Option;
    if (this.dispatchEvent(new CustomEvent<Render.Option>('renderselection', { bubbles: true, cancelable: true, detail: detail }))) {
      return <div class="selection">{detail.element || option.label || option.value}</div> as HTMLElement;
    }
    return void 0;
  }

  /**
   * Renders a new group element for the specified group entity.
   * @param group Group entity.
   * @returns Returns the rendered group element.
   */
  @Class.Private()
  private renderGroupElement(group: Internals.Group): HTMLElement | undefined {
    const detail = { group: group, element: void 0 } as Render.Group;
    if (this.dispatchEvent(new CustomEvent<Render.Group>('rendergroup', { bubbles: true, cancelable: true, detail: detail }))) {
      return <div class="group">{detail.element || group.label}</div> as HTMLElement;
    }
    return void 0;
  }

  /**
   * Reset the search element to find options.
   */
  @Class.Private()
  private resetSearch(): void {
    const search = this.getChildElement(this.searchSlot) as any;
    if (search.reset instanceof Function) {
      search.reset();
    } else if ('value' in search) {
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
  @Class.Private()
  private selectOption(option: Internals.Option): void {
    if (this.selectedElement) {
      delete this.selectedElement.dataset.selected;
    }
    this.selectedOption = option;
    this.selectedElement = this.optionElementMap.get(option) as HTMLElement;
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
  @Class.Private()
  private selectOptionByValue(value: string): boolean {
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
  @Class.Private()
  private selectOptionAndNotify(option: Internals.Option): void {
    if (option !== this.selectedOption) {
      const savedOption = this.selectedOption;
      this.selectOption(option);
      if (!this.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))) {
        if (savedOption) {
          this.selectOption(savedOption);
        } else {
          this.unselectOption();
        }
      }
    }
  }

  /**
   * Selects the previous option.
   */
  @Class.Private()
  private selectPreviousOptionAndNotify(): void {
    const index = this.activatedList.indexOf(this.selectedOption as Internals.Option);
    const option = this.activatedList[(index - 1 > -1 ? index : this.activatedList.length) - 1];
    this.selectOptionAndNotify(option);
  }

  /**
   * Selects the next option.
   */
  @Class.Private()
  private selectNextOptionAndNotify(): void {
    const index = this.activatedList.indexOf(this.selectedOption as Internals.Option);
    const option = this.activatedList[index + 1 < this.activatedList.length ? index + 1 : 0];
    this.selectOptionAndNotify(option);
  }

  /**
   * Selects the next first option that corresponds to the specified search.
   * @param search Search value.
   */
  @Class.Private()
  private selectNextOptionBySearchAndNotify(search: string): void {
    let index = this.activatedList.indexOf(this.selectedOption as Internals.Option);
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
  @Class.Private()
  private unselectOption(): void {
    const input = this.getChildElement(this.inputSlot);
    if (input instanceof HTMLButtonElement) {
      JSX.append(JSX.clear(input), ...this.defaultNodes);
    } else if (input instanceof HTMLInputElement) {
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
  @Class.Private()
  private optionClickHandler(option: Internals.Option): void {
    this.closeListHandler();
    this.selectOptionAndNotify(option);
  }

  /**
   * Option keydown, event handler.
   * @param event Event instance.
   */
  @Class.Private()
  private optionKeydownHandler(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.open();
      this.focus();
    } else if (event.code === 'Enter') {
      event.preventDefault();
      this.toggleListHandler();
    } else if (event.code === 'Escape') {
      event.preventDefault();
      this.closeListHandler();
    } else if (event.code === 'ArrowUp') {
      event.preventDefault();
      this.selectPreviousOptionAndNotify();
    } else if (event.code === 'ArrowDown') {
      event.preventDefault();
      this.selectNextOptionAndNotify();
    } else if (!this.searchable) {
      event.preventDefault();
      this.selectNextOptionBySearchAndNotify(event.key);
    }
  }

  /**
   * Updates the current selection into the new input slot element.
   */
  @Class.Private()
  private slotChangeHandler(): void {
    const input = this.getChildElement(this.inputSlot);
    if (input instanceof HTMLButtonElement) {
      this.defaultNodes = [];
      for (const node of input.childNodes) {
        this.defaultNodes.push(node);
      }
    } else if (input instanceof HTMLInputElement) {
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
  @Class.Private()
  private preventCloseHandler(): void {
    this.canClose = false;
    this.focus();
  }

  /**
   * Focus list, event handler.
   */
  @Class.Private()
  private focusListHandler(): void {
    if (!this.opened) {
      this.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
    }
  }

  /**
   * Blur list, event handler.
   */
  @Class.Private()
  private blurListHandler(): void {
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
  @Class.Private()
  private openListHandler(): void {
    this.open();
    this.focus();
  }

  /**
   * Closes the list, event handler.
   */
  @Class.Private()
  private closeListHandler(): void {
    this.focus();
    this.close();
  }

  /**
   * Toggles the list, event handler.
   */
  @Class.Private()
  private toggleListHandler(): void {
    if (this.opened) {
      this.closeListHandler();
    } else {
      this.openListHandler();
    }
  }

  /**
   * Default constructor.
   */
  constructor() {
    super();
    const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.selectStyles, this.selectLayout) as ShadowRoot;
    shadow.addEventListener('keydown', this.optionKeydownHandler.bind(this) as EventListener);
    this.inputSlot.addEventListener('slotchange', this.slotChangeHandler.bind(this));
    this.inputSlot.addEventListener('focus', this.focusListHandler.bind(this), true);
    this.inputSlot.addEventListener('blur', this.blurListHandler.bind(this), true);
    this.searchSlot.addEventListener('blur', this.blurListHandler.bind(this), true);
  }

  /**
   * Gets the selected option.
   */
  @Class.Public()
  public get selection(): Internals.Option | undefined {
    return this.selectedOption ? { ...this.selectedOption } : void 0;
  }

  /**
   * Gets the current search text.
   */
  @Class.Public()
  public get search(): string | undefined {
    return this.searchable ? (this.getChildElement(this.searchSlot) as any).value : void 0;
  }

  /**
   * Gets the opened state.
   */
  @Class.Public()
  public get opened(): boolean {
    return this.hasAttribute('opened');
  }

  /**
   * Gets the options found state.
   */
  @Class.Public()
  public get found(): boolean {
    return this.hasAttribute('found');
  }

  /**
   * Gets the total number of options.
   */
  @Class.Public()
  public get count(): number {
    return this.optionsList.length;
  }

  /**
   * Determines whether the element is empty or not.
   */
  @Class.Public()
  public get empty(): boolean {
    return this.selectedOption === void 0;
  }

  /**
   * Gets the element name.
   */
  @Class.Public()
  public get name(): string {
    return this.getAttribute('name') || '';
  }

  /**
   * Sets the element name.
   */
  public set name(name: string) {
    this.setAttribute('name', name);
    this.setChildProperty(this.inputSlot, 'name', name);
  }

  /**
   * Gets the element value.
   */
  @Class.Public()
  public get value(): string | undefined {
    return this.selectedOption ? this.selectedOption.value : void 0;
  }

  /**
   * Sets the element value.
   */
  public set value(value: string | undefined) {
    if (value === void 0 || !this.selectOptionByValue(value)) {
      this.unselectOption();
      this.updateValidation();
    }
  }

  /**
   * Gets the searchable state of the element.
   */
  @Class.Public()
  public get searchable(): boolean {
    return this.hasAttribute('searchable') && this.searchSlot.assignedNodes().length !== 0;
  }

  /**
   * Sets the searchable state of the element.
   */
  public set searchable(state: boolean) {
    this.updateState('searchable', state);
  }

  /**
   * Gets the required state of the element.
   */
  @Class.Public()
  public get required(): boolean {
    return this.hasAttribute('required');
  }

  /**
   * Sets the required state of the element.
   */
  public set required(state: boolean) {
    this.setChildProperty(this.inputSlot, 'required', state);
    this.updateState('required', state);
    this.updateValidation();
  }

  /**
   * Gets the read-only state of the element.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.hasAttribute('readonly');
  }

  /**
   * Sets the read-only state of the element.
   */
  public set readOnly(state: boolean) {
    this.updateState('readonly', state);
  }

  /**
   * Gets the disabled state of the element.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  /**
   * Sets the disabled state of the element.
   */
  public set disabled(state: boolean) {
    this.updateState('disabled', this.setChildProperty(this.inputSlot, 'disabled', state) && state);
  }

  /**
   * Move the focus to this element.
   */
  @Class.Public()
  public focus(): void {
    const target = this.getChildElement(this.searchable && this.opened ? this.searchSlot : this.inputSlot) as any;
    if (target.focus instanceof Function) {
      target.focus();
    }
  }

  /**
   * Reset the element value to its initial value.
   */
  @Class.Public()
  public reset(): void {
    const input = this.getChildElement(this.inputSlot) as any;
    if (input.reset instanceof Function) {
      input.reset();
    } else if ('value' in input) {
      input.value = input.defaultValue;
    }
    this.updateValidation();
  }

  /**
   * Checks the element validity.
   * @returns Returns true when the element is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    const input = this.getChildElement(this.inputSlot) as any;
    return (
      (!this.required || (this.value !== void 0 && this.value.length)) &&
      (!(input.checkValidity instanceof Function) || input.checkValidity())
    );
  }

  /**
   * Set the element's custom validity error message.
   * @param error Custom error message.
   */
  @Class.Public()
  public setCustomValidity(error?: string): void {
    const input = this.getChildElement(this.inputSlot) as any;
    if (input.setCustomValidity instanceof Function) {
      input.setCustomValidity(error);
    }
  }

  /**
   * Adds the specified group into the groups list.
   * @param name Group name.
   * @param label Group label.
   */
  @Class.Public()
  public addGroup(name: string, label: string): void {
    const group = { name: name, label: label };
    const element = this.renderGroupElement(group) as HTMLDivElement;
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
  @Class.Public()
  public addOption(value: string, label: string, data: Internals.Metadata = {}): void {
    const option = {
      value: value,
      label: label,
      group: data.group,
      tags: (data.tags || [label || value]).map((tag: string) => tag.toLocaleLowerCase()),
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
  @Class.Public()
  public clear(): void {
    this.optionsList = [];
    this.unselectOption();
    this.updateValidation();
    this.updateState('found', false);
    JSX.clear(this.getChildElement(this.resultSlot));
  }

  /**
   * Opens the options list.
   */
  @Class.Public()
  public open(): void {
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
  @Class.Public()
  public close(): void {
    this.updateState('found', false);
    this.updateState('opened', false);
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
}
