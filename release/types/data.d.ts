/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Data entity interface.
 */
export interface Data {
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
