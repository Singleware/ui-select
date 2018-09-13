import * as Control from '@singleware/ui-control';
import { Properties } from './properties';
import { Selection } from './selection';
import { Element } from './element';
/**
 * Select template class.
 */
export declare class Template extends Control.Component<Properties> {
    /**
     * Select states.
     */
    private states;
    /**
     * Input slot.
     */
    private inputSlot;
    /**
     * Arrow slot.
     */
    private arrowSlot;
    /**
     * List slot.
     */
    private listSlot;
    /**
     * Select element.
     */
    private select;
    /**
     * Select styles.
     */
    private styles;
    /**
     * Select skeleton.
     */
    private skeleton;
    /**
     * Changes the input content with the specified option information.
     * @param option Option information.
     */
    private changeInput;
    /**
     * Selects the specified option.
     * @param option Option information.
     */
    private selectOption;
    /**
     * Build the result options list.
     */
    private buildOptionList;
    /**
     * Preserve event handler.
     * @param event Event information.
     */
    private preserveHandler;
    /**
     * Bind event handlers to update the custom element.
     */
    private bindHandlers;
    /**
     * Bind exposed properties to the custom element.
     */
    private bindProperties;
    /**
     * Assign all element properties.
     */
    private assignProperties;
    /**
     * Default constructor.
     * @param properties Select properties.
     * @param children Select children.
     */
    constructor(properties?: Properties, children?: any[]);
    /**
     * Get select name.
     */
    /**
    * Set select name.
    */
    name: string;
    /**
     * Get select value.
     */
    /**
    * Set select value.
    */
    value: string | undefined;
    /**
     * Get default value.
     */
    readonly defaultValue: string | undefined;
    /**
     * Get selected option.
     */
    readonly selected: Selection | undefined;
    /**
     * Get empty state.
     */
    readonly empty: any;
    /**
     * Get required state.
     */
    /**
    * Set required state.
    */
    required: boolean;
    /**
     * Get read-only state.
     */
    /**
    * Set read-only state.
    */
    readOnly: boolean;
    /**
     * Get disabled state.
     */
    /**
    * Set disabled state.
    */
    disabled: boolean;
    /**
     * Select element.
     */
    readonly element: Element;
    /**
     * Checks the select validity.
     * @returns Returns true when the select is valid, false otherwise.
     */
    checkValidity(): boolean;
    /**
     * Reports the select validity.
     * @returns Returns true when the select is valid, false otherwise.
     */
    reportValidity(): boolean;
    /**
     * Set the custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error?: string): void;
    /**
     * Reset the select to its initial option and state.
     */
    reset(): void;
    /**
     * Adds the specified option into the options list.
     * @param label Option text label.
     * @param value Option value.
     * @param group Option group.
     * @returns Returns the generated option element.
     */
    add(label: JSX.Element, value: string, group?: string): HTMLDivElement;
    /**
     * Clear all options.
     */
    clear(): void;
    /**
     * Opens the options list.
     */
    open(): void;
    /**
     * Closes the options list.
     */
    close(): void;
}
