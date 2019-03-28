/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Internals from './internals';
import { Option } from './option';

/**
 * Select properties interface.
 */
export interface Properties {
  /**
   * Select classes.
   */
  class?: string;
  /**
   * Select slot.
   */
  slot?: string;
  /**
   * Select name.
   */
  name?: string;
  /**
   * Select value.
   */
  value?: string;
  /**
   * Select default value.
   */
  defaultValue?: string;
  /**
   * Determines whether the select options can be searchable or not.
   */
  searchable?: boolean;
  /**
   * Determines whether the select is required or not.
   */
  required?: boolean;
  /**
   * Determines whether the select is read-only or not.
   */
  readOnly?: boolean;
  /**
   * Determines whether the select is disabled or not.
   */
  disabled?: boolean;
  /**
   * Initial options.
   */
  options?: Option[] | string[];
  /**
   * Select children.
   */
  children?: {};
  /**
   * Focus event.
   */
  onFocus?: (event: Event) => void;
  /**
   * Blur event.
   */
  onBlur?: (event: Event) => void;
  /**
   * Change option event.
   */
  onChange?: (event: Event) => void;
  /**
   * Render option event.
   */
  onRenderOption?: (option: Internals.Option) => HTMLElement | undefined;
  /**
   * Render selection event.
   */
  onRenderSelection?: (option: Internals.Option) => HTMLElement | string | undefined;
  /**
   * Render group event.
   */
  onRenderGroup?: (group: Internals.Group) => HTMLElement | undefined;
}
