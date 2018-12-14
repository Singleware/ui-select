/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Internals from '../internals';

/**
 * Render option, event detail interface.
 */
export interface Option {
  /**
   * Option data.
   */
  option: Internals.Option;
  /**
   * Option element.
   */
  element: HTMLElement | string | undefined;
}
