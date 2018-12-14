# UI-Select

Custom HTML element used to replace the common select element, this custom element provides a simple way to customize the select input, arrow, list and its options inside.

### State Attributes

| Name    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| empty   | Automatically assigned when there is no option selected         |
| opened  | Automatically assigned when the options list is displayed       |
| found   | Automatically assigned when there are options found             |
| invalid | Automatically assigned when there is an invalid option selected |

### Mirrored Properties

| Name     | Description                                                |
| -------- | ---------------------------------------------------------- |
| name     | Get and set the element `name` in the input slot           |
| required | Get and set the `required` state in the input slot element |
| disabled | Get and set the `disabled` state in the input slot element |

### Properties

| Name         | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| selection    | Get the current selected option                               |
| search       | Get the current search text                                   |
| opened       | Get the current opened state                                  |
| found        | Get the options found state                                   |
| count        | Get the total number of options                               |
| empty        | Get the current empty state                                   |
| value        | Get the selected value or selects another options             |
| defaultValue | Get and set the defaultValue                                  |
| searchable   | Get and set the searchable state                              |
| readOnly     | Get and set the readOnly state                                |
| options      | Set the initial list of options in the component construction |

### Methods

| Name              | Description                                     |
| ----------------- | ----------------------------------------------- |
| focus             | Move the focus to the input slot element        |
| reset             | Reset the current value to the default value    |
| checkValidity     | Get the validity of the input slot element      |
| setCustomValidity | Set a custom validity in the input slot element |
| addGroup          | Adds a new group to be used by options          |
| addOption         | Adds a new select option                        |
| clear             | Clear all options                               |
| open              | Opens the options list                          |
| close             | Closes the options list                         |
| toggle            | Toggles the options list                        |

### Slots

| Name   | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| input  | Element to shows the selected option. Use: `input` or `button` element |
| search | Element to shows the options search (can be omitted)                   |
| arrow  | Element to shows the customizable arrow (can be omitted)               |
| result | Element to aggregate options with their groups                         |
| empty  | Element to be visible when there are no options in the result          |

### Events

| Name            | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| focus           | Dispatched when the input slot is focused                                    |
| blur            | Dispatched when the input slot loses focus                                   |
| change          | Dispatched when a different option is selected                               |
| renderoption    | Dispatched when an option is added, needs to render the option element       |
| renderselection | Dispatched when as option is selected, needs to render the current selection |
| rendergroup     | Dispatched when an group is added, needs to render the group element         |

## Install

Using npm:

```sh
npm i @singleware/ui-select
```

## License

[MIT &copy; Silas B. Domingos](https://balmante.eti.br)
