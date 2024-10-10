**Hi. I will be discontinuing active maintenance of Siema. I built it by myself to use on one of my projects. Two years later I consider carousels as an anti-pattern and I would suggest you to find a better UI pattern than carousel for your current project. If you really want to use it, feel free. If you have any questions, please look for the answer in closed issues section. Would you like to contribute or coutinue maintenance of Siema? Fantastic!**

- - -

# Siema - Lightweight and simple carousel with no dependencies

Full docs with examples: [https://pawelgrzybek.github.io/siema/](https://pawelgrzybek.github.io/siema/).

Siema is a lightweight (only 3kb gzipped) carousel plugin with no dependencies and no styling. As Brad Frost once said "do that shit yourself". It is 100% open source and [available on Github](https://github.com/pawelgrzybek/siema). It is free to use on personal and commercial projects. Use it with your favourite module bundler or by manually injecting the script into your project.

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
  multipleDrag: true,
  threshold: 20,
  loop: false,
  rtl: false,
  onInit: () => {},
  onChange: () => {},
});
```

**`selector`** (string or DOM element)  
The selector to use as a carousel. Siema will use all immediate children of this selector as a slider items. It can be a query string [(example)](http://codepen.io/pawelgrzybek/pen/QvLjxY) or DOM element [(example)](http://codepen.io/pawelgrzybek/pen/gWYaje).

**`duration`** (number)  
Slide transition duration in milliseconds [(example)](http://codepen.io/pawelgrzybek/pen/BRBoqO).

**`easing`** (string)  
It is like a CSS `transition-timing-function` — describes acceleration curve [(example)](http://codepen.io/pawelgrzybek/pen/aWovrB).

**`center`** (boolean)  
Determine if slider will be center in the selector or not.  Default: false.

**`perPage`** (number or object)  
The number of slides to be shown. It accepts a number [(example)](http://codepen.io/pawelgrzybek/pen/bWbVXz) or an object [(example)](http://codepen.io/pawelgrzybek/pen/dWbGyZ) for complex responsive layouts.

**`offset`** (number or object)  
An offset applied on slides width based on items per page.  
For example, a configuration with perPage = 1 and offset = 0.25 will show in viewport the current slide and 25% of the next slide.  
With center attribute enable, it will show 25% of the prev slide, the current slide and 25% of the next slide.  
It accepts a number between 0 and 1 and object with value by breakpoint as for **perPage** attribute.

**`startIndex`** (number)  
Index (zero-based) of the starting slide [(example)](http://codepen.io/pawelgrzybek/pen/vmBLER).

**`draggable`** (boolean)  
Use dragging and touch swiping [(example)](http://codepen.io/pawelgrzybek/pen/mmbVVj).

**`multipleDrag`** (boolean)  
Allow dragging to move multiple slides.

**`threshold`** (number)  
Touch and mouse dragging threshold (in px) [(example)](http://codepen.io/pawelgrzybek/pen/gWYPrQ).

**`loop`** (boolean)  
Loop the slides around [(example)](http://codepen.io/pawelgrzybek/pen/zwOrKN).

**`rtl`** (boolean)  
Enables layout for languages written from right to left (like Hebrew or Arabic) [(example)](https://codepen.io/pawelgrzybek/pen/XZNEgd).

**`onInit`** (function)  
Runs immediately after initialization [(example)](http://codepen.io/pawelgrzybek/pen/BRBjpE).

**`onChange`** (function)  
Runs after slide change [(example)](http://codepen.io/pawelgrzybek/pen/RVbrVe).

## API

As mentioned above, Siema doesn't come with many options - just a few useful methods. Combine it with some very basic JavaScript and voila!

**`prev(howManySlides = 1, callback)`**  
Go to previous item [(example)](http://codepen.io/pawelgrzybek/pen/JNPKVE). Optionally slide few items backward by passing `howManySlides` (number) argument [(example)](http://codepen.io/pawelgrzybek/pen/wdwWZQ). Optional `callback` (function) available as a third argument [(example)](http://codepen.io/pawelgrzybek/pen/JNPKQW).

**`next(howManySlides = 1, callback)`**  
Go to next item [(example)](http://codepen.io/pawelgrzybek/pen/JNPKVE). Optionally slide few items forward by passing `howManySlides` (number) argument [(example)](http://codepen.io/pawelgrzybek/pen/wdwWZQ). Optional `callback` (function) available as a third argument [(example)](http://codepen.io/pawelgrzybek/pen/JNPKQW).

**`goTo(index, callback)`**  
Go to item at particular `index` (number) [(example)](http://codepen.io/pawelgrzybek/pen/gWYLXP). Optional `callback` (function) available as a second argument [(example)](http://codepen.io/pawelgrzybek/pen/ZKzBvo).

**`remove(index, callback)`**  
Remove item at particular `index` (number) [(example)](http://codepen.io/pawelgrzybek/pen/BRBpQJ). Optional `callback` (function) available as a second argument [(example)](http://codepen.io/pawelgrzybek/pen/rmBjjE).

**`insert(item, index, callback)`**  
Insert new `item` (DOM element) at specific `index` (number) [(example)](http://codepen.io/pawelgrzybek/pen/QvLdaJ). Optional `callback` (function) available as a third argument [(example)](http://codepen.io/pawelgrzybek/pen/vmBgdZ).

**`prepend(item, callback)`**  
Prepend new `item` (DOM element) [(example)](http://codepen.io/pawelgrzybek/pen/rmBymW). Optional `callback` (function) available as a second argument [(example)](http://codepen.io/pawelgrzybek/pen/LyPWLe).

**`append(item, callback)`**  
Append new `item` (DOM element) [(example)](http://codepen.io/pawelgrzybek/pen/RVbpZe). Optional `callback` (function) available as a second argument [(example)](http://codepen.io/pawelgrzybek/pen/rmByGj).

**`destroy(restoreMarkup = false, callback)`**  
Remove all event listeners on instance [(example)](http://codepen.io/pawelgrzybek/pen/oWvZEd). Use `restoreMarkup` to restore the initial markup inside selector [(example)](http://codepen.io/pawelgrzybek/pen/ZKzeoL). Optional `callback` (function) available as a third argument [(example)](http://codepen.io/pawelgrzybek/pen/Wjepyv).

**`currentSlide`**  
Prints current slide index [(example)](https://codepen.io/pawelgrzybek/pen/XRNOPP).

## Browser support

- IE10
- Chrome 12
- Firefox 16
- Opera 15
- Safari 5.1
- Android Browser 4.0
- iOS Safari 6.0

## Extra & Thanks

Siema means 'hello' in Polish. When I play around with some code, I always use random names. That's the whole story behind the name of this one :)

Huge thanks to [Jarkko Sibenberg](http://www.sibenberg.com/) for the cute logo design! I can't thank [BrowserStack](https://www.browserstack.com) enough for giving me a free access to their testing amazing service.
