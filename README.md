# Wheel input web component

Web component acting as a dropdown witha wheel design inspired by the Apple iOS wheel input.

## Install

Import the Javascript module in your web page.

```html
<script type="module" src=".../path/to/wheel-input.js"></script>
```

## How to use

Exemple of basic use case

```html
<wheel-input values="[1,2,3,4]" label="minutes"></wheel-input>
```

### Set values options

- In HTML
```html
<!-- Numeric values -->
<wheel-input values="[1,2,3,4]"></wheel-input>
<!-- String values -->
<wheel-input values="['one', 'two', 'three', 'four']"></wheel-input>
```
- In Javascript
```javascript
const wheelInput = document.querySelector('wheel-input');
const valuesNr = [1,2,3,4,5];

// Need to stringify the values
wheelInput.setAttribute('values', JSON.stringify(valuesNr));
```

### Set label

The label attribute will display a label integrated in the wheel input.

- In HTML
```html
<wheel-input label="minutes"></wheel-input>
```
- In Javascript
```javascript
wheelInput.setAttribute('label', 'minutes');
```

### Form integration

The wheel input can be use in HTML forms:
- getting value
```javascript
console.log(wheelInput.value);
```
- setting value (will scroll the will to the given value)
```javascript
wheelInput.value = 3;
```

On form serialization, the input will be treated as a classic input and will generate an entry with the name and input value.