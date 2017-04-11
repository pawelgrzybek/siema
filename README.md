# Siema - Lightweight and simple carousel with no dependencies

Full docs with examples: [https://pawelgrzybek.com/siema/](https://pawelgrzybek.com/siema/).

Siema is a lightweight (only 2kb gzipped) carousel plugin with no dependencies and no styling. As Brad Frost once said "do that shit yourself". It is 100% open source and [available on Github](https://github.com/pawelgrzybek/siema). It is free to use on personal and commercial projects. Use it with your favourite module bundler or by manually injecting the script into your project.

## Installation

Setup is trivially easy. A little bit of markup...

```html
<div class="siema">
  <div>Hi, I'm slide 1</div>
  <div>Hi, I'm slide 2</div>
  <div>Hi, I'm slide 3</div>
  <div>Hi, I'm slide 4</div>
</div>
```

If you are using a module bundler like Webpack or Browserify...

```
yarn add siema
```

```js
import Siema from 'siema';
new Siema();
```

...or manually inject the minified script into your website.

```html
<script src="siema.min.js"></script>
<script>
  new Siema();
</script>
```

## Options

Siema comes with a few (optional) settings that you can change by passing an object as an argument. Default values are presented below.

```js
new Siema({
  selector: '.siema',
  duration: 200,
  easing: 'ease-out',
  perPage: 1,
  startIndex: 0,
  draggable: true,
  threshold: 20,
  loop: false,
  onInit: () => {},
  onChange: () => {},
});
```

### `selector` (string or DOM element)

Specify the selector to use as a carousel. Siema will use all immediate children of this selector as a slider items. It can be a query string [(example)](http://codepen.io/pawelgrzybek/pen/QvLjxY) or DOM element [(example)](http://codepen.io/pawelgrzybek/pen/gWYaje).

### `duration` (number)

Slide transition duration in milliseconds [(example)](http://codepen.io/pawelgrzybek/pen/BRBoqO).

### `easing` (string)

It is like a CSS `transition-timing-function` — describes acceleration curve [(example)](http://codepen.io/pawelgrzybek/pen/aWovrB).

### `perPage` (number or object)

The number of slides to be shown. It accepts a number [(example)](http://codepen.io/pawelgrzybek/pen/bWbVXz) or object [(example)](http://codepen.io/pawelgrzybek/pen/dWbGyZ) for complex responsive layouts.

### `startIndex` (number)

Index (zero-based) of the starting slide [(example)](http://codepen.io/pawelgrzybek/pen/vmBLER).

### `draggable` (boolean)

Use dragging and touch swiping [(example)](http://codepen.io/pawelgrzybek/pen/mmbVVj).

### `threshold` (number)

Touch and mouse dragging threshold (in px) [(example)](http://codepen.io/pawelgrzybek/pen/gWYPrQ).

### `loop` (boolean)

Loop the slides around [(example)](http://codepen.io/pawelgrzybek/pen/zwOrKN).

### `onInit` (function)

Runs immediately after initialization [(example)](http://codepen.io/pawelgrzybek/pen/BRBjpE).

### `onChange` (function)

Runs after slide change [(example)](http://codepen.io/pawelgrzybek/pen/RVbrVe).

## API

As mentioned above, Siema doesn't come with many options - just a few useful methods. Combine it with some very basic JavaScript and voila!

- `next(howManySlides = 1, callback)` - go to next slide (optionally few items) (takes optional callback as an optional argument)
- `prev(howManySlides = 1, callback)` - go to previous slide (optionally few items) (takes optional callback as an optional argument)
- `goTo(index, callback)` - go to a specific slide (takes optional callback as an optional argument)
- `remove(index, callback)` - remove item at particular index (takes optional callback as an optional argument)
- `insert(item, index, callback)` - insert new item at particular index (takes optional callback as an optional argument)
- `prepend(item, callback)` - prepend new item (takes optional callback as an optional argument)
- `append(item, callback)` - append new item (takes optional callback as an optional argument)
- `destroy(restoreMarkup = false, callback)` - destroy instance (restore markup — optional) (takes optional callback as an optional argument)

## Browser support

- IE10
- Chrome 12
- Firefox 16
- Opera 15
- Safari 4
- Android Browser 4.0
- iOS Safari 6.0
