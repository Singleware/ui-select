import * as Internals from './internals';
/**
 * Select element.
 */
export declare class Element extends HTMLElement {
    /**
     * Default value for resets.
     */
    defaultValue: any;
    /**
     * Default text for no selections in the text input.
     */
    private defaultText;
    /**
     * Default nodes for no selections in the button input.
     */
    private defaultNodes;
    /**
     * List of options.
     */
    private optionsList;
    /**
     * List of active options.
     */
    private activatedList;
    /**
     * Map of option entity by option element.
     */
    private optionsMap;
    /**
     * Map of option element by option entity.
     */
    private optionElementMap;
    /**
     * Map of group entity by name.
     */
    private groupsMap;
    /**
     * Map of group element by group entity.
     */
    private groupElementMap;
    /**
     * Current option selected.
     */
    private selectedOption?;
    /**
     * Current element selected.
     */
    private selectedElement?;
    /**
     * Determines whether the result or empty element slot can be closed or not.
     */
    private canClose;
    /**
     * Input slot element.
     */
    private inputSlot;
    /**
     * Arrow slot element.
     */
    private arrowSlot;
    /**
     * Search slot element.
     */
    private searchSlot;
    /**
     * Result slot element.
     */
    private resultSlot;
    /**
     * Empty slot element.
     */
    private emptySlot;
    /**
     * Select layout element.
     */
    private selectLayout;
    /**
     * Select styles element.
     */
    private selectStyles;
    /**
     * Gets the first child element from the specified slot element.
     * @param slot Slot element.
     * @throws Throws an error when there are no children in the specified slot.
     * @returns Returns the first child element.
     */
    private getChildElement;
    /**
     * Sets the property into the first child from specified slot element.
     * @param slot Slot element.
     * @param property Property name.
     * @param value Property value.
     * @throws Throws an error when there are no children in the specified slot.
     * @returns Returns true when the specified property has been assigned, false otherwise.
     */
    private setChildProperty;
    /**
     * Updates the specified state in the element.
     * @param name State name.
     * @param state State value.
     */
    private updateState;
    /**
     * Update all validation attributes.
     */
    private updateValidation;
    /**
     * Updates the input element with the specified option entity.
     * @param option Option entity.
     */
    private updateInputSelection;
    /**
     * Updates the result element with any option found.
     */
    private updateResultList;
    /**
     * Renders a new option element for the specified option entity.
     * @param option Option entity.
     * @returns Returns the rendered option element.
     */
    private renderOptionElement;
    /**
     * Renders a new selection result for the specified option entity.
     * @param option Option entity.
     * @returns Returns the rendered selection result.
     */
    private renderSelectionElement;
    /**
     * Renders a new group element for the specified group entity.
     * @param group Group entity.
     * @returns Returns the rendered group element.
     */
    private renderGroupElement;
    /**
     * Reset the search element to find options.
     */
    private resetSearch;
    /**
     * Selects the element that corresponds to the specified option entity.
     * @param option Option entity.
     */
    private selectOption;
    /**
     * Selects the option that corresponds to the specified value.
     * @param value Option value.
     * @returns Returns true when an option was selected, false otherwise.
     */
    private selectOptionByValue;
    /**
     * Selects the element that corresponds to the specified option and notifies the change.
     * @param option Option entity.
     */
    private selectOptionAndNotify;
    /**
     * Selects the previous option.
     */
    private selectPreviousOptionAndNotify;
    /**
     * Selects the next option.
     */
    private selectNextOptionAndNotify;
    /**
     * Selects the next first option that corresponds to the specified search.
     * @param search Search value.
     */
    private selectNextOptionBySearchAndNotify;
    /**
     * Unselects the current selected option.
     */
    private unselectOption;
    /**
     * Option click, event handler.
     * @param option Option entity.
     */
    private optionClickHandler;
    /**
     * Option keydown, event handler.
     * @param event Event instance.
     */
    private optionKeydownHandler;
    /**
     * Updates the current selection into the new input slot element.
     */
    private slotChangeHandler;
    /**
     * Prevent close, event handler.
     */
    private preventCloseHandler;
    /**
     * Focus list, event handler.
     */
    private focusListHandler;
    /**
     * Blur list, event handler.
     */
    private blurListHandler;
    /**
     * Opens the list, event handler.
     */
    private openListHandler;
    /**
     * Closes the list, event handler.
     */
    private closeListHandler;
    /**
     * Toggles the list, event handler.
     */
    private toggleListHandler;
    /**
     * Default constructor.
     */
    constructor();
    /**
     * Gets the selected option.
     */
    readonly selection: Internals.Option | undefined;
    /**
     * Gets the current search text.
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
     * Determines whether the element is empty or not.
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
     * Set the element's custom validity error message.
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
     * @param metadata Option metadata.
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
