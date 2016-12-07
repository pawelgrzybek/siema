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
    this.selector = document.querySelector(this.config.selector);
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

    // If element if draggable / swipable, add event handlers
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
      this.selector.addEventListener('touchmove', this.touchmoveHandler.bind(this));

      // Mouse events
      this.selector.addEventListener('mousedown', this.mousedownHandler.bind(this));
      this.selector.addEventListener('mouseup', this.mouseupHandler.bind(this));
      this.selector.addEventListener('mouseleave', this.mouseleaveHandler.bind(this));
      this.selector.addEventListener('mousemove', this.mousemoveHandler.bind(this));
    }
  }

  Siema.prototype.init = function init() {
    if (this.selector === null) {
      throw new Error('Something wrong with your sleector 😭');
    }

    // hide everything out of selector's bounduries
    this.selector.style.overflow = 'hidden';

    // Create frame and apply styling
    this.sliderFrame = document.createElement('div');
    this.sliderFrame.style.width = `${(this.selectorWidth / this.config.perPage) * this.innerElements.length}px`;
    this.sliderFrame.style.transition = `transform ${this.config.duration}ms ${this.config.easing}`;

    if (this.config.draggable) {
      this.sliderFrame.style.cursor = '-webkit-grab';
    }

    // Create a document fragment to pus slides into it
    const docFragment = document.createDocumentFragment();

    // Loop through the slides, add styling and add them to document fragment
    for (let i = 0; i < this.innerElements.length; i++) {
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
  Siema.prototype.prev = function prev() {
    if (this.currentSlide === 0 && this.config.loop) {
      this.currentSlide = this.innerElements.length - this.config.perPage;
    }
    else {
      this.currentSlide = Math.max(this.currentSlide - 1, 0);
    }
    this.slideToCurrent();
  };

  // Go to Next slide
  Siema.prototype.next = function next() {
    if (this.currentSlide === this.innerElements.length - this.config.perPage && this.config.loop) {
      this.currentSlide = 0;
    }
    else {
      this.currentSlide = Math.min(this.currentSlide + 1, this.innerElements.length - this.config.perPage);
    }
    this.slideToCurrent();
  };

  // Go to slide with particular index
  Siema.prototype.goTo = (index) => {
    this.currentSlide = Math.min(Math.max(index, 0), this.innerElements.length - 1);
    this.slideToCurrent();
  };

  // Move slider frame to corect position depending of currently active slide
  Siema.prototype.slideToCurrent = function slideToCurrent() {
    this.sliderFrame.style.transform = `translate3d(-${this.currentSlide * (this.selectorWidth / this.config.perPage)}px, 0, 0)`;
  };

  // Recalculate drag /swipe event and repositionthe frame of a slider
  Siema.prototype.updateAfterDrag = function updateAfterDrag() {
    const move = this.drag.end - this.drag.start;
    if (move > 0 && Math.abs(move) > this.config.threshold) {
      this.prev();
    }
    else if (move < 0 && Math.abs(move) > this.config.threshold) {
      this.next();
    }
    else {
      this.slideToCurrent();
    }
  };

  // When window resizes, resize slider components as well
  Siema.prototype.resize = function resize() {
    this.selectorWidth = this.selector.getBoundingClientRect().width;
    this.sliderFrame.style.width = `${(this.selectorWidth / this.config.perPage) * this.innerElements.length}px`;
  };

  // Event handlers
  // Touch events
  Siema.prototype.touchstartHandler = function touchstartHandler(e) {
    e.stopImmediatePropagation();
    this.pointerDown = true;
    this.drag.start = e.pageX;
  };
  Siema.prototype.touchendHandler = function touchendHandler(e) {
    e.stopImmediatePropagation();
    this.pointerDown = false;
    this.drag.end = e.pageX;
    this.sliderFrame.style.transition = `transform ${this.config.duration}ms ${this.config.easing}`;
    this.updateAfterDrag();
  };
  Siema.prototype.touchmoveHandler = function touchmoveHandler(e) {
    e.stopImmediatePropagation();
    this.sliderFrame.style.transition = `transform 0ms ${this.config.easing}`;
    this.drag.end = e.pageX;
    this.sliderFrame.style.transform = `translate3d(${(this.currentSlide * (this.selectorWidth / this.config.perPage) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
  };

  // Mouse events
  Siema.prototype.mousedownHandler = function mousedownHandler(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.pointerDown = true;
    this.drag.start = e.pageX;
  };
  Siema.prototype.mouseupHandler = function mouseupHandler(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this.pointerDown) {
      this.pointerDown = false;
      this.drag.end = e.pageX;
      this.sliderFrame.style.transition = `transform ${this.config.duration}ms ${this.config.easing}`;
      this.sliderFrame.style.cursor = '-webkit-grab';
      this.updateAfterDrag();
    }
  };
  Siema.prototype.mouseleaveHandler = function mouseleaveHandler(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this.pointerDown) {
      this.drag.end = e.pageX;
      this.sliderFrame.style.transition = `transform ${this.config.duration}ms ${this.config.easing}`;
      this.sliderFrame.style.cursor = '-webkit-grab';
      this.updateAfterDrag();
    }
    this.pointerDown = false;
  };
  Siema.prototype.mousemoveHandler = function mousemoveHandler(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this.pointerDown) {
      this.sliderFrame.style.transition = `transform 0ms ${this.config.easing}`;
      this.sliderFrame.style.cursor = '-webkit-grabbing';
      this.drag.end = e.pageX;
      this.sliderFrame.style.transform = `translate3d(${(this.currentSlide * (this.selectorWidth / this.config.perPage) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
    }
  };

  // Exports to node & browser
  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Siema;
  }
  // Browser
  else {
    global['Siema'] = Siema;
  }
}(window));
