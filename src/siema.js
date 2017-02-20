// Hi :-)
export default class Siema {

  constructor(options) {
    // Merge defaults with user's settings
    this.config = this.mergeSettings(options);

    // Create global references
    this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;
    this.selectorWidth = this.selector.getBoundingClientRect().width;
    this.innerElements = [].slice.call(this.selector.children);
    this.currentSlide = this.config.startIndex;
    this.transformProperty = this.webkitOrNot();

    // Build markup and apply required styling to elements
    this.init();

    // Bind all event handlers for referencability
    ['resizeHandler', 'touchstartHandler', 'touchendHandler', 'touchmoveHandler', 'mousedownHandler', 'mouseupHandler', 'mouseleaveHandler', 'mousemoveHandler'].forEach(method => {
      this[method] = this[method].bind(this);
    });

    // Resize element on window resize
    window.addEventListener('resize', this.resizeHandler);

    // If element is draggable / swipable, add event handlers
    if (this.config.draggable) {
      // Keep track pointer hold and dragging distance
      this.pointerDown = false;
      this.drag = {
        start: 0,
        end: 0,
      };

      // Touch events
      this.selector.addEventListener('touchstart', this.touchstartHandler);
      this.selector.addEventListener('touchend', this.touchendHandler);
      this.selector.addEventListener('touchmove', this.touchmoveHandler, { passive: true });

      // Mouse events
      this.selector.addEventListener('mousedown', this.mousedownHandler);
      this.selector.addEventListener('mouseup', this.mouseupHandler);
      this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
      this.selector.addEventListener('mousemove', this.mousemoveHandler);
    }
  }


  mergeSettings(options) {
    const settings = {
      selector: '.siema',
      duration: 200,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      threshold: 20,
      loop: false,
    };
    const userSttings = options;
    for (const attrname in userSttings) {
      settings[attrname] = userSttings[attrname];
    }
    return settings;
  }


  webkitOrNot() {
    const style = document.documentElement.style;
    if (typeof style.transform == 'string') {
      return 'transform';
    }
    return 'WebkitTransform';
  }


  init() {
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
      const elementContainer = document.createElement('div');
      elementContainer.style.cssFloat = 'left';
      elementContainer.style.float = 'left';
      elementContainer.style.width = `${100 / this.innerElements.length}%`;
      elementContainer.appendChild(this.innerElements[i]);
      docFragment.appendChild(elementContainer);
    }

    // Add fragment to frame and frame to selector
    this.sliderFrame.appendChild(docFragment);
    this.selector.appendChild(this.sliderFrame);

    // Go to currently active slide after initial build
    this.slideToCurrent();
  }


  // Determinate slides number
  resolveSlidesNumber() {
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
  }


  // Go to previous slide
  prev(howManySlides = 1) {
    if (this.currentSlide === 0 && this.config.loop) {
      this.currentSlide = this.innerElements.length - this.perPage;
    }
    else {
      this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
    }
    this.slideToCurrent();
  }


  // Go to Next slide
  next(howManySlides = 1) {
    if (this.currentSlide === this.innerElements.length - this.perPage && this.config.loop) {
      this.currentSlide = 0;
    }
    else {
      this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
    }
    this.slideToCurrent();
  }


  // Go to slide with particular index
  goTo(index) {
    this.currentSlide = Math.min(Math.max(index, 0), this.innerElements.length - 1);
    this.slideToCurrent();
  }


  // Move slider frame to correct position depending on currently active slide
  slideToCurrent() {
    this.sliderFrame.style[this.transformProperty] = `translate3d(-${this.currentSlide * (this.selectorWidth / this.perPage)}px, 0, 0)`;
  }


  // Recalculate drag /swipe event and reposition the frame of a slider
  updateAfterDrag() {
    const movement = this.drag.end - this.drag.start;
    const movementDistance = Math.abs(movement);
    const howManySliderToSlide = Math.ceil(movementDistance / (this.selectorWidth / this.perPage));

    if (movement > 0 && movementDistance > this.config.threshold) {
      this.prev(howManySliderToSlide);
    }
    else if (movement < 0 && movementDistance > this.config.threshold) {
      this.next(howManySliderToSlide);
    }
    this.slideToCurrent();
  }


  // When window resizes, resize slider components as well
  resizeHandler() {
    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    this.selectorWidth = this.selector.getBoundingClientRect().width;
    this.sliderFrame.style.width = `${(this.selectorWidth / this.perPage) * this.innerElements.length}px`;

    this.slideToCurrent();
  }


  // Clear drag
  clearDrag() {
    this.drag = {
      start: 0,
      end: 0,
    };
  }


  // Touch events handlers
  touchstartHandler(e) {
    e.stopPropagation();
    this.pointerDown = true;
    this.drag.start = e.touches[0].pageX;
  }


  touchendHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
    if (this.drag.end) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  touchmoveHandler(e) {
    e.stopPropagation();
    if (this.pointerDown) {
      this.drag.end = e.touches[0].pageX;
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
    }
  }


  // Mouse events handlers
  mousedownHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    this.pointerDown = true;
    this.drag.start = e.pageX;
  }


  mouseupHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.sliderFrame.style.cursor = '-webkit-grab';
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
    if (this.drag.end) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  mousemoveHandler(e) {
    e.preventDefault();
    if (this.pointerDown) {
      this.drag.end = e.pageX;
      this.sliderFrame.style.cursor = '-webkit-grabbing';
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
    }
  }


  mouseleaveHandler(e) {
    if (this.pointerDown) {
      this.pointerDown = false;
      this.sliderFrame.style.cursor = '-webkit-grab';
      this.drag.end = e.pageX;
      this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
      this.updateAfterDrag();
      this.clearDrag();
    }
  }


  // Destroy - remove listeners to prevent from memory leak (keeps the markup)
  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
    this.selector.removeEventListener('touchstart', this.touchstartHandler);
    this.selector.removeEventListener('touchend', this.touchendHandler);
    this.selector.removeEventListener('touchmove', this.touchmoveHandler);
    this.selector.removeEventListener('mousedown', this.mousedownHandler);
    this.selector.removeEventListener('mouseup', this.mouseupHandler);
    this.selector.removeEventListener('mouseleave', this.mouseleaveHandler);
    this.selector.removeEventListener('mousemove', this.mousemoveHandler);
  }
}
