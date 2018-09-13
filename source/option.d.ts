/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Select option interface.
 */
export interface Option {
  /**
   * Option label.
   */
  label: JSX.Element;
  /**
   * Option value.
   */
  value: string;
  /**
   * Option element.
   */
  element: HTMLDivElement;
  /**
   * Option group name.
   */
  group?: string;
}
