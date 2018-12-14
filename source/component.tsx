/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as JSX from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import * as Render from './render';
import * as Internals from './internals';

import { Properties } from './properties';
import { Element } from './element';
import { Option } from './option';

/**
 * Select component class.
 */
@Class.Describe()
export class Component<T extends Properties = Properties> extends Control.Component<T> {
  /**
   * Element instance.
   */
  @Class.Private()
  private skeleton = (
    <swe-select
      class={this.properties.class}
      slot={this.properties.slot}
      name={this.properties.name}
      searchable={this.properties.searchable}
      required={this.properties.required}
      readOnly={this.properties.readOnly}
      disabled={this.properties.disabled}
      onFocus={this.properties.onFocus}
      onBlur={this.properties.onBlur}
      onChange={this.properties.onChange}
    >
      {this.children}
    </swe-select>
  ) as Element;

  /**
   * Render option, event handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderOptionHandler(event: CustomEvent<Render.Option>): void {
    if (this.properties.onRenderOption) {
      event.detail.element = this.properties.onRenderOption(event.detail.option);
    }
  }

  /**
   * Render selection, event handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderSelectionHandler(event: CustomEvent<Render.Option>): void {
    if (this.properties.onRenderSelection) {
      event.detail.element = this.properties.onRenderSelection(event.detail.option);
    }
  }

  /**
   * Render group, event handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderGroupHandler(event: CustomEvent<Render.Group>): void {
    if (this.properties.onRenderGroup) {
      event.detail.element = this.properties.onRenderGroup(event.detail.group);
    }
  }

  /**
   * Initializes the specified list of options.
   * @param options List of options.
   */
  @Class.Private()
  private initializeOptions(options: Option[] | string[]): void {
    for (const option of options) {
      if (typeof option !== 'string') {
        this.skeleton.addOption(option.value, option.label, { group: option.group, tags: option.tags, custom: option.custom });
      } else {
        this.skeleton.addOption(option, option);
      }
    }
  }

  /**
   * Initializes the select element adding options and selecting the specified value.
   */
  @Class.Private()
  private initializeSelect(): void {
    if (this.properties.options) {
      this.initializeOptions(this.properties.options);
      if (this.properties.value) {
        this.skeleton.value = this.properties.value;
      }
    }
  }

  /**
   * Default constructor.
   * @param properties Initial properties.
   * @param children Initial children.
   */
  constructor(properties?: T, children?: any[]) {
    super(properties, children);
    this.skeleton.addEventListener('renderoption', this.renderOptionHandler.bind(this) as EventListener);
    this.skeleton.addEventListener('renderselection', this.renderSelectionHandler.bind(this) as EventListener);
    this.skeleton.addEventListener('rendergroup', this.renderGroupHandler.bind(this) as EventListener);
    this.initializeSelect();
  }

  /**
   * Gets the element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Gets the selected option.
   */
  @Class.Public()
  public get selection(): Internals.Option | undefined {
    return this.skeleton.selection;
  }

  /**
   * Gets the current search.
   */
  @Class.Public()
  public get search(): string | undefined {
    return this.skeleton.search;
  }

  /**
   * Gets the opened state.
   */
  @Class.Public()
  public get opened(): boolean {
    return this.skeleton.opened;
  }

  /**
   * Gets the options found state.
   */
  @Class.Public()
  public get found(): boolean {
    return this.skeleton.found;
  }

  /**
   * Gets the total number of options.
   */
  @Class.Public()
  public get count(): number {
    return this.skeleton.count;
  }

  /**
   * Gets the empty state of the element.
   */
  @Class.Public()
  public get empty(): boolean {
    return this.skeleton.empty;
  }

  /**
   * Gets the element name.
   */
  @Class.Public()
  public get name(): string {
    return this.skeleton.name;
  }

  /**
   * Sets the element name.
   */
  public set name(name: string) {
    this.skeleton.name = name;
  }

  /**
   * Gets the element value.
   */
  @Class.Public()
  public get value(): string | undefined {
    return this.skeleton.value;
  }

  /**
   * Sets the element value.
   */
  public set value(value: string | undefined) {
    this.skeleton.value = value;
  }

  /**
   * Gets the default value of the element.
   */
  @Class.Public()
  public get defaultValue(): string | undefined {
    return this.skeleton.defaultValue;
  }

  /**
   * Sets the default value of the element.
   */
  public set defaultValue(value: string | undefined) {
    this.skeleton.defaultValue = value;
  }

  /**
   * Gets the searchable state of the element.
   */
  @Class.Public()
  public get searchable(): boolean {
    return this.skeleton.searchable;
  }

  /**
   * Sets the searchable state of the element.
   */
  public set searchable(state: boolean) {
    this.skeleton.searchable = state;
  }

  /**
   * Gets the required state of the element.
   */
  @Class.Public()
  public get required(): boolean {
    return this.skeleton.required;
  }

  /**
   * Sets the required state of the element.
   */
  public set required(state: boolean) {
    this.skeleton.required = state;
  }

  /**
   * Gets the read-only state of the element.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.skeleton.readOnly;
  }

  /**
   * Sets the read-only state of the element.
   */
  public set readOnly(state: boolean) {
    this.skeleton.readOnly = state;
  }

  /**
   * Gets the disabled state of the element.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.skeleton.disabled;
  }

  /**
   * Sets the disabled state of the element.
   */
  public set disabled(state: boolean) {
    this.skeleton.disabled = state;
  }

  /**
   * Move the focus to this element.
   */
  @Class.Public()
  public focus(): void {
    this.skeleton.focus();
  }

  /**
   * Reset the element value to its initial value.
   */
  @Class.Public()
  public reset(): void {
    this.skeleton.reset();
  }

  /**
   * Checks the element validity.
   * @returns Returns true when the element is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    return this.skeleton.checkValidity();
  }

  /**
   * Set the element custom validity error message.
   * @param error Custom error message.
   */
  @Class.Public()
  public setCustomValidity(error?: string): void {
    this.skeleton.setCustomValidity(error);
  }

  /**
   * Adds the specified group into the groups list.
   * @param name Group name.
   * @param label Group label.
   */
  @Class.Public()
  public addGroup(name: string, label: string): void {
    this.skeleton.addGroup(name, label);
  }

  /**
   * Adds the specified option into the options list.
   * @param value Option value.
   * @param label Option label.
   * @param data Option metadata.
   */
  @Class.Public()
  public addOption(value: string, label: string, data: Internals.Metadata = {}): void {
    this.skeleton.addOption(value, label, data);
  }

  /**
   * Clear all options.
   */
  @Class.Public()
  public clear(): void {
    this.skeleton.clear();
  }

  /**
   * Opens the options list.
   */
  @Class.Public()
  public open(): void {
    this.skeleton.open();
  }

  /**
   * Closes the options list.
   */
  @Class.Public()
  public close(): void {
    this.skeleton.close();
  }

  /**
   * Toggles the options list.
   */
  @Class.Public()
  public toggle(): void {
    this.skeleton.toggle();
  }
}
