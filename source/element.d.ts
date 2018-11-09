/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Selection } from './selection';

/**
 * Select element interface.
 */
export interface Element extends HTMLDivElement {
  /**
   * Select name.
   */
  name: string;
  /**
   * Select value.
   */
  value: string | undefined;
  /**
   * Default select value.
   */
  readonly defaultValue: string;
  /**
   * Selected option.
   */
  readonly selection: Selection;
  /**
   * Determines whether the select is empty or not.
   */
  readonly empty: boolean;
  /**
   * Determines whether the options list is opened or not.
   */
  readonly opened: boolean;
  /**
   * Required state.
   */
  required: boolean;
  /**
   * Read-only state.
   */
  readOnly: boolean;
  /**
   * Disabled state.
   */
  disabled: boolean;
  /**
   * Checks the select validity.
   * @returns Returns true when the select is valid, false otherwise.
   */
  checkValidity: () => boolean;
  /**
   * Reports the select validity.
   * @returns Returns true when the select is valid, false otherwise.
   */
  reportValidity: () => boolean;
  /**
   * Set the custom validity error message.
   * @param error Custom error message.
   */
  setCustomValidity: (error?: string) => void;
  /**
   * Reset the select to its initial option and state.
   */
  reset: () => void;
  /**
   * Adds the specified option into the options list.
   * @param label Option label element.
   * @param value Option value.
   * @param group Option group.
   * @returns Returns the generated option element.
   */
  add: (label: JSX.Element, value: string, group?: string) => HTMLDivElement;
  /**
   * Clear all options.
   */
  clear: () => void;
  /**
   * Opens the options list.
   */
  open: () => void;
  /**
   * Closes the options list.
   */
  close: () => void;
  /**
   * Toggles the options list.
   */
  toggle(): void;
}
