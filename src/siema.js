(function(global) {

  function Siema(options) {

    // Default settings
    const defaults = {
      selector: '.siema',
      duration: 200,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      threshold: 20,
      loop: false,
    };

    // Merge defaults with user's settings
    this.config = Object.assign(defaults, options);

    // Create global references
    this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;
    this.selectorWidth = this.selector.getBoundingClientRect().width;
    this.innerElements = [].slice.call(this.selector.children);
    this.currentSlide = this.config.startIndex;

    // Build markup and apply required styling to elements
    this.init();

    // Resize element on window resize
    window.addEventListener('resize', () => {
      this.resize();
      this.slideToCurrent();
    });

    // If element is draggable / swipable, add event handlers
    if (this.config.draggable) {
      // Keep track pointer hold and dragging distance
      this.pointerDown = false;
      this.drag = {
        start: 0,
        end: 0,
      };

      // Touch events
      this.selector.addEventListener('touchstart', this.touchstartHandler.bind(this));
      this.selector.addEventListener('touchend', this.touchendHandler.bind(this));
      this.selector.addEventListener('touchmove', this.touchmoveHandler.bind(this), { passive: true });

      // Mouse events
      this.selector.addEventListener('mousedown', this.mousedownHandler.bind(this));
      this.selector.addEventListener('mouseup', this.mouseupHandler.bind(this));
      this.selector.addEventListener('mouseleave', this.mouseleaveHandler.bind(this));
      this.selector.addEventListener('mousemove', this.mousemoveHandler.bind(this));
    }
  }

  Siema.prototype.init = function init() {
    if (this.selector === null) {
      throw new Error('Something wrong with your selector 😭');
    }

    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    // hide everything out of selector's boundaries
    this.selector.style.overflow = 'hidden';

    // Create frame and apply styling
    this.sliderFrame = document.createElement('div');
    this.sliderFrame.style.width = `${(this.selectorWidth / this.perPage) * this.innerElements.length}px`;
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;

    if (this.config.draggable) {
      this.sliderFrame.style.cursor = '-webkit-grab';
    }

    // Create a document fragment to put slides into it
    const docFragment = document.createDocumentFragment();

    // Loop through the slides, add styling and add them to document fragment
    for (let i = 0; i < this.innerElements.length; i++) {
      this.innerElements[i].style.cssFloat = 'left';
      this.innerElements[i].style.float = 'left';
      this.innerElements[i].style.width = `${100 / this.innerElements.length}%`;
      docFragment.appendChild(this.innerElements[i]);
    }

    // Add fragment to frame and frame to selector
    this.sliderFrame.appendChild(docFragment);
    this.selector.appendChild(this.sliderFrame);

    // Go to currently active slide after initial build
    this.slideToCurrent();
  };

  // Go to previous slide
  Siema.prototype.resolveSlidesNumber = function resolveSlidesNumber() {
    if (typeof this.config.perPage === 'number') {
      this.perPage = this.config.perPage;
    }
    else if (typeof this.config.perPage === 'object') {
      this.perPage = 1;
      for (const viewport in this.config.perPage) {
        if (window.innerWidth > viewport) {
          this.perPage = this.config.perPage[viewport];
        }
      }
    }
  };

  // Go to previous slide
  Siema.prototype.prev = function prev() {
    if (this.currentSlide === 0 && this.config.loop) {
      this.currentSlide = this.innerElements.length - this.perPage;
    }
    else {
      this.currentSlide = Math.max(this.currentSlide - 1, 0);
    }
    this.slideToCurrent();
  };

  // Go to Next slide
  Siema.prototype.next = function next() {
    if (this.currentSlide === this.innerElements.length - this.perPage && this.config.loop) {
      this.currentSlide = 0;
    }
    else {
      this.currentSlide = Math.min(this.currentSlide + 1, this.innerElements.length - this.perPage);
    }
    this.slideToCurrent();
  };

  // Go to slide with particular index
  Siema.prototype.goTo = function goTo(index) {
    this.currentSlide = Math.min(Math.max(index, 0), this.innerElements.length - 1);
    this.slideToCurrent();
  };

  // Move slider frame to correct position depending on currently active slide
  Siema.prototype.slideToCurrent = function slideToCurrent() {
    this.sliderFrame.style[transformProperty] = `translate3d(-${this.currentSlide * (this.selectorWidth / this.perPage)}px, 0, 0)`;
  };

  // Recalculate drag /swipe event and repositionthe frame of a slider
  Siema.prototype.updateAfterDrag = function updateAfterDrag() {
    const movement = this.drag.end - this.drag.start;
    if (movement > 0 && Math.abs(movement) > this.config.threshold) {
      this.prev();
    }
    else if (movement < 0 && Math.abs(movement) > this.config.threshold) {
      this.next();
    }
    this.slideToCurrent();
  };

  // When window resizes, resize slider components as well
  Siema.prototype.resize = function resize() {
    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    this.selectorWidth = this.selector.getBoundingClientRect().width;
    this.sliderFrame.style.width = `${(this.selectorWidth / this.perPage) * this.innerElements.length}px`;
  };

  // Clear drag
  Siema.prototype.clearDrag = function clearDrag() {
    this.drag = {
      start: 0,
      end: 0,
    };
  };

  // Touch events handlers
  Siema.prototype.touchstartHandler = function touchstartHandler(e) {
    e.stopPropagation();
    this.pointerDown = true;
    this.drag.start = e.touches[0].pageX;
  };
  Siema.prototype.touchendHandler = function touchendHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
    if (this.drag.end) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  };
  Siema.prototype.touchmoveHandler = function touchmoveHandler(e) {
    e.stopPropagation();
    if (this.pointerDown) {
      this.drag.end = e.touches[0].pageX;
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style[transformProperty] = `translate3d(${(this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
    }
  };

  // Mouse events handlers
  Siema.prototype.mousedownHandler = function mousedownHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    this.pointerDown = true;
    this.drag.start = e.pageX;
  };
  Siema.prototype.mouseupHandler = function mouseupHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.sliderFrame.style.cursor = '-webkit-grab';
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
    if (this.drag.end) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  };
  Siema.prototype.mousemoveHandler = function mousemoveHandler(e) {
    e.preventDefault();
    if (this.pointerDown) {
      this.drag.end = e.pageX;
      this.sliderFrame.style.cursor = '-webkit-grabbing';
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style[transformProperty] = `translate3d(${(this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
    }
  };
  Siema.prototype.mouseleaveHandler = function mouseleaveHandler(e) {
    if (this.pointerDown) {
      this.pointerDown = false;
      this.drag.end = e.pageX;
      this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
      this.updateAfterDrag();
      this.clearDrag();
    }
  };

  // Public methods
  const transformProperty = (() => {
    const style = document.documentElement.style;
    if (typeof style.transform == 'string') {
      return 'transform';
    }
    return 'WebkitTransform';
  })();

  // Export to CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Siema;
  }
  // Export to Browser
  else {
    global['Siema'] = Siema;
  }
}(window));
