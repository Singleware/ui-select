/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Selection } from './selection';

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
   * Select children.
   */
  children?: {};
}
