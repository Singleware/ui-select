/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Internals from '../internals';

/**
 * Render group, event detail interface.
 */
export interface Group {
  /**
   * Group data.
   */
  group: Internals.Group;
  /**
   * Group element.
   */
  element: HTMLElement | undefined;
}
