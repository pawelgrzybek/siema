---
layout: default
---

Siema is a lightweight (only 2kb gzipped) carousel plugin with no dependencies and no styling. As Brad Frost once said "do that shit yourself". It is 100% open source and [available on Github](https://github.com/pawelgrzybek/siema). It is free to use on personal and commercial projects. Use it with your favourite module bundler or by manually injecting the script into your project.

<a href="https://github.com/pawelgrzybek/siema/releases" class="btn">Download Siema from Github</a>

1. [Installation](#installation)
2. [Options](#options)
3. [API](#api)
4. [Example](#example)
5. [Browser support](#browser-support)
6. [Other implementations](#other-implementations)
7. [Contributing](#contributing)
8. [Extra](#extra)

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

<video class="video" controls poster="assets/siematutorial.jpg">
  <source src="assets/siema.webm" type="video/webm">
  <source src="assets/siema.mp4" type="video/mp4">
</video>

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

- `next(howManySlides = 1, callback)` - go to next (optionally few items) (takes optional callback as an optional argument)
- `prev(howManySlides = 1, callback)` - go to previous (optionally few items) (takes optional callback as an optional argument)
- `goTo(index, callback)` - go to a specific slide (takes optional callback as an optional argument)
- `remove(index, callback)` - remove item at particular index (takes optional callback as an optional argument)
- `insert(item, index, callback)` - insert new item at particular index (takes optional callback as an optional argument)
- `prepend(item, callback)` - prepend new item (takes optional callback as an optional argument)
- `append(item, callback)` - append new item (takes optional callback as an optional argument)
- `destroy(restoreMarkup = false, callback)` - destroy instance (restore markup — optional) (takes optional callback as an optional argument)

## Example

Basic carousel with next and previous buttons.

```html
<div class="siema">
  <img src="assets/siema--pink.svg">
  <img src="assets/siema--yellow.svg">
  <img src="assets/siema--pink.svg">
  <img src="assets/siema--yellow.svg">
  <img src="assets/siema--pink.svg">
  <img src="assets/siema--yellow.svg">
</div>

<button class="prev">prev</button>
<button class="next">next</button>
```

```js
const mySiema = new Siema();
document.querySelector('.prev').addEventListener('click', () => mySiema.prev());
document.querySelector('.next').addEventListener('click', () => mySiema.next());
```

<div class="siema">
  <img src="assets/siema--pink.svg">
  <img src="assets/siema--yellow.svg">
  <img src="assets/siema--pink.svg">
  <img src="assets/siema--yellow.svg">
  <img src="assets/siema--pink.svg">
  <img src="assets/siema--yellow.svg">
</div>

<button class="btn js-prev1">prev</button>
<button class="btn js-next1">next</button>

<script>
  var mySiema = new Siema();
  document.querySelector('.js-prev1').addEventListener('click', function() {mySiema.prev()});
  document.querySelector('.js-next1').addEventListener('click', function() {mySiema.next()});
</script>

I've also created a Codepen collection with tons of Siema examples.

<a href="http://codepen.io/collection/Adpkkd/" class="btn">Check the Codepen collection</a>

## Browser support

  - IE10
  - Chrome 12
  - Firefox 16
  - Opera 15
  - Safari 4
  - Android Browser 4.0
  - iOS Safari 6.0

## Other implementations

- [Angular version](https://www.npmjs.com/package/ngx-siema) by Lex Zhukov
- [React version](https://www.npmjs.com/package/react-siema) by Mantas Kaveckas
- [Vue version](https://www.npmjs.com/package/vue-siema) by Marko Bolliger
- [Siema-rails](https://github.com/Naggi-Goishi/siema-rails) by Naggi Goishi


## Contributing
Siema's purpose is to provide a basic carousel tool and allow developers to extend it by using the available methods. It doesn't come with any complex configuration and myriad options — I would like to keep it this way. If you need a more powerful library I recommend the amazing [Flickity](http://flickity.metafizzy.co/) by David DeSandro or [Swiper](http://idangero.us/swiper/) by iDangero team.

Bug fixes are more than welcome. If you have a feature suggestion please [open an issue](https://github.com/pawelgrzybek/siema/issues) on Github. Before sending a pull request make sure to use the `build` task please.

```shell
yarn run build
```

## Extra

Siema means 'hello' in Polish. When I play around with some code, I always use random names. That's the whole story behind the name of this one :) Huge thanks to [Jarkko Sibenberg](http://www.sibenberg.com/) for the cute logo design!
