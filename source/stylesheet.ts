/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as OSS from '@singleware/oss';

/**
 * Select stylesheet class.
 */
@Class.Describe()
export class Stylesheet extends OSS.Stylesheet {
  /**
   * Select styles.
   */
  @Class.Private()
  private element = this.select(':host>.select');

  /**
   * Field styles.
   */
  @Class.Private()
  private field = this.select(':host(:not([opened]))>.select>.field');

  /**
   * Arrow styles.
   */
  @Class.Private()
  private arrow = this.select(':host>.select>.field>.arrow');

  /**
   * Unselect styles.
   */
  @Class.Private()
  private unselect = this.select(':host>.select>.field>.unselect');

  /**
   * Unselect active styles.
   */
  @Class.Private()
  private unselectActive = this.select(':host(:not([empty]))>.select>.field:hover>.unselect');

  /**
   * Slotted selection styles.
   */
  @Class.Private()
  private slottedSelection = this.select(':host>.select>.field>.input::slotted(*)');

  /**
   * Slotted input styles.
   */
  @Class.Private()
  private slottedInput = this.select(':host>.select>.field>.search::slotted(*)', ':host>.select>.field>.input::slotted(*)');

  /**
   * Slotted arrow styles.
   */
  @Class.Private()
  private slottedArrow = this.select(':host>.select>.field>.arrow::slotted(*)');

  /**
   * Slotted unselect styles.
   */
  @Class.Private()
  private slottedUnselect = this.select(':host>.select>.field>.unselect::slotted(*)');

  /**
   * Slotted unselect styles.
   */
  @Class.Private()
  private slottedUnselectBeforeAfter = this.select(
    ':host>.select>.field>.unselect::slotted(*)::after',
    ':host>.select>.field>.unselect::slotted(*)::before'
  );

  /**
   * Slotted unselect styles.
   */
  @Class.Private()
  private slottedUnselectBefore = this.select(':host>.select>.field>.unselect::slotted(*)::before');

  /**
   * Slotted unselect styles.
   */
  @Class.Private()
  private slottedUnselectAfter = this.select(':host>.select>.field>.unselect::slotted(*)::after');

  /**
   * Slotted arrow styles.
   */
  @Class.Private()
  private slottedResults = this.select(':host>.select>.result::slotted(*)', ':host>.select>.empty::slotted(*)');

  /**
   * Slotted hidden styles.
   */
  @Class.Private()
  private slottedHidden = this.select(
    ':host([searchable][opened])>.select>.field>.input::slotted(*)',
    ':host([searchable]:not([opened]))>.select>.field>.search::slotted(*)',
    ':host(:not([searchable]))>.select>.field>.search::slotted(*)',
    ':host(:not([searchable]))>.select>.empty::slotted(*)',
    ':host(:not([opened]))>.select>.result::slotted(*)',
    ':host(:not([found]))>.select>.result::slotted(*)',
    ':host(:not([opened]))>.select>.empty::slotted(*)',
    ':host([opened][found])>.select>.empty::slotted(*)'
  );

  /**
   * Default constructor.
   */
  constructor() {
    super();
    this.element.display = 'flex';
    this.element.position = 'relative';
    this.element.flexDirection = 'column';
    this.element.position = 'relative';
    this.element.height = 'inherit';
    this.element.width = 'inherit';
    this.element.userSelect = 'none';
    this.field.display = 'flex';
    this.unselect.position = 'absolute';
    this.unselect.visibility = 'hidden';
    this.unselect.cursor = 'pointer';
    this.unselect.top = '0';
    this.unselect.bottom = '0';
    this.unselect.right = '0';
    this.unselectActive.visibility = 'visible';
    this.arrow.position = 'absolute';
    this.arrow.top = '0';
    this.arrow.bottom = '0';
    this.arrow.right = '0';
    this.slottedSelection.cursor = 'default';
    this.slottedInput.width = '100%';
    this.slottedInput.whiteSpace = 'nowrap';
    this.slottedInput.textAlign = 'left';
    this.slottedInput.paddingRight = '2.5rem';
    this.slottedUnselect.position = 'absolute';
    this.slottedUnselect.top = '50%';
    this.slottedUnselect.right = '1.5rem';
    this.slottedUnselect.width = '0.5rem';
    this.slottedUnselect.height = '0.5rem';
    this.slottedUnselect.transform = 'translate(-50%,-50%)';
    this.slottedUnselectBeforeAfter.content = '""';
    this.slottedUnselectBeforeAfter.position = 'absolute';
    this.slottedUnselectBeforeAfter.height = 'inherit';
    this.slottedUnselectBeforeAfter.width = '0.0625rem';
    this.slottedUnselectBeforeAfter.left = '0.25rem';
    this.slottedUnselectBeforeAfter.backgroundColor = 'black';
    this.slottedUnselectBefore.transform = 'rotate(45deg)';
    this.slottedUnselectAfter.transform = 'rotate(-45deg)';
    this.slottedArrow.position = 'absolute';
    this.slottedArrow.top = '50%';
    this.slottedArrow.right = '0.75rem';
    this.slottedArrow.width = '0';
    this.slottedArrow.height = '0';
    this.slottedArrow.transform = 'translate(-50%,-50%)';
    this.slottedArrow.borderLeft = '0.1875rem solid transparent';
    this.slottedArrow.borderRight = this.slottedArrow.borderLeft;
    this.slottedArrow.borderTop = '0.25rem solid black';
    this.slottedResults.display = 'block';
    this.slottedResults.position = 'absolute';
    this.slottedResults.border = '0.0625rem solid black';
    this.slottedResults.overflow = 'auto';
    this.slottedResults.top = '100%';
    this.slottedResults.width = '100%';
    this.slottedResults.zIndex = 1;
    this.slottedHidden.display = 'none';
  }
}
