import * as Control from '@singleware/ui-control';
import * as Internals from './internals';
import { Properties } from './properties';
import { Element } from './element';
/**
 * Select component class.
 */
export declare class Component<T extends Properties = Properties> extends Control.Component<T> {
    /**
     * Element instance.
     */
    private skeleton;
    /**
     * Render option, event handler.
     * @param event Event information.
     */
    private renderOptionHandler;
    /**
     * Render selection, event handler.
     * @param event Event information.
     */
    private renderSelectionHandler;
    /**
     * Render group, event handler.
     * @param event Event information.
     */
    private renderGroupHandler;
    /**
     * Add the specified list of options.
     * @param options List of options.
     */
    private addOptions;
    /**
     * Initializes the select element adding options and selecting the specified value.
     */
    private initialize;
    /**
     * Default constructor.
     * @param properties Initial properties.
     * @param children Initial children.
     */
    constructor(properties?: T, children?: any[]);
    /**
     * Gets the element.
     */
    readonly element: Element;
    /**
     * Gets the selected option.
     */
    readonly selection: Internals.Option | undefined;
    /**
     * Gets the current search.
     */
    readonly search: string | undefined;
    /**
     * Gets the opened state.
     */
    readonly opened: boolean;
    /**
     * Gets the options found state.
     */
    readonly found: boolean;
    /**
     * Gets the total number of options.
     */
    readonly count: number;
    /**
     * Gets the empty state of the element.
     */
    readonly empty: boolean;
    /**
     * Gets the element name.
     */
    /**
    * Sets the element name.
    */
    name: string;
    /**
     * Gets the element value.
     */
    /**
    * Sets the element value.
    */
    value: string | undefined;
    /**
     * Gets the default value of the element.
     */
    /**
    * Sets the default value of the element.
    */
    defaultValue: string | undefined;
    /**
     * Gets the searchable state of the element.
     */
    /**
    * Sets the searchable state of the element.
    */
    searchable: boolean;
    /**
     * Gets the required state of the element.
     */
    /**
    * Sets the required state of the element.
    */
    required: boolean;
    /**
     * Gets the read-only state of the element.
     */
    /**
    * Sets the read-only state of the element.
    */
    readOnly: boolean;
    /**
     * Gets the disabled state of the element.
     */
    /**
    * Sets the disabled state of the element.
    */
    disabled: boolean;
    /**
     * Move the focus to this element.
     */
    focus(): void;
    /**
     * Reset the element value to its initial value.
     */
    reset(): void;
    /**
     * Checks the element validity.
     * @returns Returns true when the element is valid, false otherwise.
     */
    checkValidity(): boolean;
    /**
     * Set the element custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error?: string): void;
    /**
     * Adds the specified group into the groups list.
     * @param name Group name.
     * @param label Group label.
     */
    addGroup(name: string, label: string): void;
    /**
     * Adds the specified option into the options list.
     * @param value Option value.
     * @param label Option label.
     * @param data Option metadata.
     */
    addOption(value: string, label: string, data?: Internals.Metadata): void;
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
    /**
     * Toggles the options list.
     */
    toggle(): void;
}
