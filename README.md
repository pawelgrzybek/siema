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
npm i -S siema

// or

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

## API

As mentioned above, Siema doesn't come with many options - just a few useful methods. Combine it with some very basic JavaScript and voila!

- `next()` - go to next slide
- `prev()` - go to previous slide
- `goTo(index)` - go to a specific slide
- `currentSlide` - index of the current active slide (read only)

## Siema used in production

Nowhere yet — I've just built it. If you use it on your website please let me know and I will make sure to add the URL of your project here.

## Browser support

- IE10
- Chrome 12
- Firefox 16
- Opera 15
- Safari 4
- Android Browser 4.0
- iOS Safari 6.0

## Gem

[Siema-rails](https://github.com/Naggi-Goishi/siema-rails) allows you to use Siema as a a gem. Thanks to [Naggi Goishi](https://github.com/Naggi-Goishi) for amazing contribution.

```ruby
gem 'siema-rails'
```

## Contributing

Siema's purpose is to provide a basic carousel tool and allow developers to extend it by using the available methods. It doesn't come with any complex configuration and myriad options — I would like to keep it this way. If you need a more powerful library I recommend the amazing [Flickity](http://flickity.metafizzy.co/) by David DeSandro or [Swiper](http://idangero.us/swiper/) by iDangero team.

Bug fixes are more than welcome. If you have a feature suggestion please open an issue on Github. Before sending a pull request make sure to use the 'build' task please.

```bash
npm run build

//or

yarn run build
```

## Extra

Siema means 'hello' in Polish. When I play around with some code, I always use random names. That's the whole story behind the name of this one :) Huge thanks to [Jarkko Sibenberg](http://www.sibenberg.com/) for the cute logo design!

- - -

Built by [Paweł Grzybek](https://pawelgrzybek.com/) | Follow me on: [Twitter](https://twitter.com/pawelgrzybek), [Github](https://github.com/pawelgrzybek), [Instagram](https://www.instagram.com/pawelgrzybek/)
