import * as JSX from '@singleware/jsx';
import * as Control from '@singleware/ui-control';
import * as Internals from './internals';
import { Properties } from './properties';
import { Element } from './element';
import { Option } from './option';
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
    get element(): Element;
    /**
     * Gets the selected option.
     */
    get selection(): Internals.Option | undefined;
    /**
     * Gets the current search.
     */
    get search(): string | undefined;
    /**
     * Gets the opened state.
     */
    get opened(): boolean;
    /**
     * Gets the options found state.
     */
    get found(): boolean;
    /**
     * Gets the total number of options.
     */
    get count(): number;
    /**
     * Gets the empty state of the element.
     */
    get empty(): boolean;
    /**
     * Gets the element name.
     */
    get name(): string;
    /**
     * Sets the element name.
     */
    set name(name: string);
    /**
     * Gets the element value.
     */
    get value(): string | undefined;
    /**
     * Sets the element value.
     */
    set value(value: string | undefined);
    /**
     * Gets the default value of the element.
     */
    get defaultValue(): string | undefined;
    /**
     * Sets the default value of the element.
     */
    set defaultValue(value: string | undefined);
    /**
     * Gets the searchable state of the element.
     */
    get searchable(): boolean;
    /**
     * Sets the searchable state of the element.
     */
    set searchable(state: boolean);
    /**
     * Gets the required state of the element.
     */
    get required(): boolean;
    /**
     * Sets the required state of the element.
     */
    set required(state: boolean);
    /**
     * Gets the read-only state of the element.
     */
    get readOnly(): boolean;
    /**
     * Sets the read-only state of the element.
     */
    set readOnly(state: boolean);
    /**
     * Gets the disabled state of the element.
     */
    get disabled(): boolean;
    /**
     * Sets the disabled state of the element.
     */
    set disabled(state: boolean);
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
    addGroup(name: string, label: string | JSX.Element): void;
    /**
     * Adds the specified option into the options list.
     * @param value Option value.
     * @param label Option label.
     * @param data Option metadata.
     * @returns Returns true when the option has been added, false otherwise.
     */
    addOption(value: string, label: string | JSX.Element, data?: Internals.Metadata): boolean;
    /**
     * Add the specified option list.
     * @param option Options list.
     */
    addOptions(options: (Option | string)[]): void;
    /**
     * Removes all the options that corresponds to the specified option value.
     * @param value Option value.
     * @returns Returns true when some option was removed or false otherwise.
     */
    removeOption(value: string): boolean;
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
