/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Select selection interface.
 */
export interface Selection {
  /**
   * Selected text label.
   */
  label: JSX.Element;
  /**
   * Selected value.
   */
  value: string;
  /**
   * Selected group name.
   */
  group?: string;
}
