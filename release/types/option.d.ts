/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Option interface.
 */
export interface Option {
  /**
   * Option label.
   */
  label: string | JSX.Element;
  /**
   * Option value.
   */
  value: string;
  /**
   * Option group name.
   */
  group?: string;
  /**
   * Option tags.
   */
  tags?: string[];
  /**
   * Option custom data.
   */
  custom?: any;
}
