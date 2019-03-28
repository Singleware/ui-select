/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Option } from '../option';

/**
 * Internal option map interface.
 */
export interface Map {
  [value: string]: Option[];
}
