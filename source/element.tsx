/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as JSX from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import * as Rendering from './rendering';
import * as Internals from './internals';

import { Stylesheet } from './stylesheet';

/**
 * Select element.
 */
@JSX.Describe('swe-select')
@Class.Describe()
export class Element extends Control.Element {
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
   * Map of options.
   */
  @Class.Private()
  private optionsMap = {} as Internals.Map<Internals.Option[]>;

  /**
   * List of active options.
   */
  @Class.Private()
  private activatedList = [] as Internals.Option[];

  /**
   * Map of entity group by name.
   */
  @Class.Private()
  private groupsMap = {} as Internals.Map<Internals.Group>;

  /**
   * Map of element group by entity group.
   */
  @Class.Private()
  private groupElementMap = new WeakMap<Internals.Group, HTMLElement>();

  /**
   * Map of element option by entity option.
   */
  @Class.Private()
  private optionElementMap = new WeakMap<Internals.Option, HTMLElement>();

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
   * Element styles.
   */
  @Class.Private()
  private styles = new Stylesheet();

  /**
   * Input slot element.
   */
  @Class.Private()
  private inputSlot = (
    <slot name="input" class="input" onClick={this.toggleListHandler.bind(this)} onSlotChange={this.slotChangeHandler.bind(this)} />
  ) as HTMLSlotElement;

  /**
   * Arrow slot element.
   */
  @Class.Private()
  private arrowSlot = <slot name="arrow" class="arrow" onClick={this.toggleListHandler.bind(this)} /> as HTMLSlotElement;

  /**
   * Unselect slot element.
   */
  @Class.Private()
  private unselectSlot = <slot name="unselect" class="unselect" onClick={this.unselectHandler.bind(this)} /> as HTMLSlotElement;

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
        {this.unselectSlot}
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
  private selectStyles = <style type="text/css">{this.styles.toString()}</style> as HTMLStyleElement;

  /**
   * Update all validation attributes.
   */
  @Class.Private()
  private updateValidation(): void {
    this.updatePropertyState('empty', this.empty);
    this.updatePropertyState('invalid', !this.empty && !this.checkValidity());
  }

  /**
   * Updates the input element with the specified option entity.
   * @param option Option entity.
   */
  @Class.Private()
  private updateInputSelection(option: Internals.Option): void {
    const selection = this.renderSelectionElement(option);
    const input = this.getRequiredChildElement(this.inputSlot);
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
    const result = JSX.clear(this.getRequiredChildElement(this.resultSlot)) as HTMLElement;
    const search = this.search;
    this.activatedList = [];
    for (const value in this.optionsMap) {
      const options = this.optionsMap[value] as Internals.Option[];
      for (const option of options) {
        let element = this.optionElementMap.get(option) as HTMLElement;
        if (search.length === 0 || option.tags.find(tag => tag.includes(search))) {
          this.activatedList.push(option);
          if (option.group) {
            const group = this.groupsMap[option.group] as Internals.Group;
            if (group) {
              element = JSX.append(this.groupElementMap.get(group) as HTMLElement, element) as HTMLElement;
            } else {
              console.warn(`Option group '${option.group}' wasn't found.`);
            }
          }
          JSX.append(result, element);
        } else if (option.group) {
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
  @Class.Private()
  private renderOptionElement(option: Internals.Option): HTMLElement | undefined {
    const detail = { option: option, element: void 0 } as Rendering.Option;
    const event = new CustomEvent<Rendering.Option>('renderoption', { bubbles: true, cancelable: true, detail: detail });
    if (this.dispatchEvent(event)) {
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
    const detail = { option: option, element: void 0 } as Rendering.Option;
    const event = new CustomEvent<Rendering.Option>('renderselection', { bubbles: true, cancelable: true, detail: detail });
    if (this.dispatchEvent(event)) {
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
    const detail = { group: group, element: void 0 } as Rendering.Group;
    const event = new CustomEvent<Rendering.Group>('rendergroup', { bubbles: true, cancelable: true, detail: detail });
    if (this.dispatchEvent(event)) {
      return <div class="group">{detail.element || group.label}</div> as HTMLElement;
    }
    return void 0;
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
    const options = this.optionsMap[value];
    if (options) {
      const option = options[0] as Internals.Option;
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
  @Class.Private()
  private selectOptionAndNotify(option: Internals.Option): boolean {
    if (option !== this.selectedOption) {
      const event = new Event('change', { bubbles: true, cancelable: true });
      const saved = this.selectedOption;
      this.selectOption(option);
      if (!this.dispatchEvent(event)) {
        if (saved) {
          this.selectOption(saved);
        } else {
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
  @Class.Private()
  private selectPreviousOptionAndNotify(): boolean {
    const index = this.activatedList.indexOf(this.selectedOption as Internals.Option);
    const option = this.activatedList[(index - 1 > -1 ? index : this.activatedList.length) - 1];
    return this.selectOptionAndNotify(option);
  }

  /**
   * Selects the next option.
   * @returns Returns true when some option was selected, false otherwise.
   */
  @Class.Private()
  private selectNextOptionAndNotify(): boolean {
    const index = this.activatedList.indexOf(this.selectedOption as Internals.Option);
    const option = this.activatedList[index + 1 < this.activatedList.length ? index + 1 : 0];
    return this.selectOptionAndNotify(option);
  }

  /**
   * Selects the next first option that corresponds to the specified search.
   * @param search Search value.
   * @returns Returns true when some option was selected, false otherwise.
   */
  @Class.Private()
  private selectNextOptionBySearchAndNotify(search: string): boolean {
    let index = this.activatedList.indexOf(this.selectedOption as Internals.Option);
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
  @Class.Private()
  private unselectOptionAndNotify(): boolean {
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
  @Class.Private()
  private unselectOption(): void {
    const input = this.getRequiredChildElement(this.inputSlot);
    if (input instanceof HTMLButtonElement) {
      JSX.append(JSX.clear(input), ...this.defaultNodes);
    } else if (input instanceof HTMLInputElement) {
      input.value = this.defaultText;
    }
    delete (this.selectedElement as HTMLElement).dataset.selected;
    this.selectedOption = void 0;
    this.selectedElement = void 0;
  }

  /**
   * Opens the option list result.
   */
  @Class.Private()
  private openList(): void {
    if (this.searchable) {
      const search = this.getRequiredChildElement(this.searchSlot) as any;
      if (search.reset instanceof Function) {
        search.reset();
      } else if ('value' in search) {
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
  @Class.Private()
  private closeList(): void {
    this.updatePropertyState('found', false);
    this.updatePropertyState('opened', false);
  }

  /**
   * Gets the normalized tag list based on the specified input tags.
   * @param inputs Input tags.
   * @returns Returns the generated tag list.
   */
  @Class.Private()
  private getTagList(inputs: (string | JSX.Element | undefined)[]): string[] {
    const tags = [];
    for (const input of inputs) {
      if (input instanceof Element) {
        tags.push(input.innerText.toLocaleLowerCase());
      } else if (input !== void 0) {
        tags.push((input as string).toLocaleLowerCase());
      }
    }
    return tags;
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
      if (this.open()) {
        event.preventDefault();
        this.focus();
      }
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
    } else if (!this.searchable && this.selectNextOptionBySearchAndNotify(event.key)) {
      event.preventDefault();
    }
  }

  /**
   * Updates the current selection into the new input slot element.
   */
  @Class.Private()
  private slotChangeHandler(): void {
    const input = this.getRequiredChildElement(this.inputSlot);
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
      const event = new Event('focus', { bubbles: true, cancelable: true });
      this.dispatchEvent(event);
    }
  }

  /**
   * Blur list, event handler.
   */
  @Class.Private()
  private blurListHandler(): void {
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
   * Unselect current option, event handler.
   */
  @Class.Private()
  private unselectHandler(): void {
    if (this.unselectOptionAndNotify()) {
      this.updateValidation();
    }
  }

  /**
   * Default constructor.
   */
  constructor() {
    super();
    const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.selectStyles, this.selectLayout) as ShadowRoot;
    shadow.addEventListener('keydown', this.optionKeydownHandler.bind(this) as EventListener);
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
  public get search(): string {
    return this.searchable ? (this.getRequiredChildElement(this.searchSlot) as any).value : '';
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
   * Gets the number of active options.
   */
  @Class.Public()
  public get count(): number {
    return this.activatedList.length;
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
    this.setRequiredChildProperty(this.inputSlot, 'name', name);
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
      if (this.selectedOption) {
        this.unselectOption();
        this.updateValidation();
      }
    }
  }

  /**
   * Default value for resets.
   */
  @Class.Public()
  public defaultValue: any;

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
    this.updatePropertyState('searchable', state);
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
    this.setRequiredChildProperty(this.inputSlot, 'required', state);
    this.updatePropertyState('required', state);
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
    this.updatePropertyState('readonly', state);
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
    this.updatePropertyState('disabled', this.setRequiredChildProperty(this.inputSlot, 'disabled', state) && state);
  }

  /**
   * Move the focus to this element.
   */
  @Class.Public()
  public focus(): void {
    this.callRequiredChildMethod(this.searchable && this.opened ? this.searchSlot : this.inputSlot, 'focus', []);
  }

  /**
   * Reset the element value to its initial value.
   */
  @Class.Public()
  public reset(): void {
    this.value = this.defaultValue;
  }

  /**
   * Checks the element validity.
   * @returns Returns true when the element is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    return (
      (!this.required || (this.value !== void 0 && this.value.length !== 0)) &&
      this.callRequiredChildMethod(this.inputSlot, 'checkValidity', []) !== false
    );
  }

  /**
   * Sets the element custom validity error message.
   * @param error Custom error message.
   */
  @Class.Public()
  public setCustomValidity(error?: string): void {
    this.callRequiredChildMethod(this.inputSlot, 'setCustomValidity', [error]);
  }

  /**
   * Adds the specified group into the groups list.
   * @param name Group name.
   * @param label Group label.
   */
  @Class.Public()
  public addGroup(name: string, label: string | JSX.Element): void {
    const group = { name: name, label: label };
    const element = this.renderGroupElement(group) as HTMLDivElement;
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
  @Class.Public()
  public addOption(value: string, label: string | JSX.Element, data: Internals.Metadata = {}): boolean {
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
  @Class.Public()
  public removeOption(value: string): boolean {
    const options = this.optionsMap[value];
    if (options) {
      for (const option of options) {
        (this.optionElementMap.get(option) as HTMLElement).remove();
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
  @Class.Public()
  public clear(): void {
    if (this.selectedOption) {
      this.unselectOption();
      this.updateValidation();
    }
    for (const value in this.optionsMap) {
      const options = this.optionsMap[value];
      for (const option of options) {
        (this.optionElementMap.get(option) as HTMLElement).remove();
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
  @Class.Public()
  public open(): boolean {
    if (!this.readOnly && !this.disabled && !this.opened) {
      return this.openList(), true;
    }
    return false;
  }

  /**
   * Closes the options list.
   * @returns Returns true when the options list was closed, false otherwise.
   */
  @Class.Public()
  public close(): boolean {
    if (this.opened) {
      return this.closeList(), true;
    }
    return false;
  }

  /**
   * Toggles the options list.
   */
  @Class.Public()
  public toggle(): void {
    if (this.opened) {
      this.closeList();
    } else {
      this.openList();
    }
  }
}
