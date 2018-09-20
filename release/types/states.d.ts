/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Option } from './option';

/**
 * Select states interface.
 */
export interface States {
  /**
   * Current selected option.
   */
  selection: Option | undefined;
  /**
   * Current options.
   */
  options: Option[];
  /**
   * Determines whether the select is read-only or not.
   */
  readOnly: boolean;
  /**
   * Determines whether the select is required or not.
   */
  required: boolean;
}
