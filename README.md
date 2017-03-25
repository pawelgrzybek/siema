# Siema - Lightweight and simple carousel with no dependencies

Full docs with examples: [https://pawelgrzybek.com/siema/](https://pawelgrzybek.com/siema/).

Siema is a lightweight (only 1kb gzipped) carousel plugin with no dependencies and no styling. As Brad Frost once said "do that shit yourself". It is 100% open source and [available on Github](https://pawelgrzybek.com/siema/). It is free to use on personal and commercial projects. Use it with your favourite module bundler or by manually injecting the script into your project.

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

```bash
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
  onInit: function(){},
  onChange: function(){},
});
```

- `selector` - (string or DOM element) specify the selector
- `duration` - (number) slide transition duration (in ms)
- `easing` - (string) the same as transition-timing-function in CSS
- `perPage` - (number or object) the number of slides to be shown
- `startIndex` - (number) index of the starting slide (zero-based)
- `draggable` - (boolean) use dragging and touch swiping
- `threshold` - (number) touch and mouse dragging threshold (in px)
- `loop` - (boolean) loop the slides around
- `onInit` - (function) runs immediately after first initialization
- `onChange` - (function) runs after slide change

## API

As mentioned above, Siema doesn't come with many options - just a few useful methods. Combine it with some very basic JavaScript and voila!

- `next(howManySlides = 1)` - go to next slide (optionally few items)
- `prev(howManySlides = 1)` - go to previous slide (optionally few items)
- `goTo(index)` - go to a specific slide
- `destroy()` - remove all active listeners
- `currentSlide` - index of the current active slide (read only)

## Browser support

- IE10
- Chrome 12
- Firefox 16
- Opera 15
- Safari 4
- Android Browser 4.0
- iOS Safari 6.0
