// eslint-disable-next-line wrap-iife, func-names
(function(global) {

  // Define constructor
  function Siema(options) {

    // Default the settings
    const defaults = {
      selector: '.siema',
      duration: 300,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      threshold: 20,
      // loop to add one day
    };

    // Merge defaults with user config
    this.config = Object.assign(defaults, options);

    // Create global references
    this.selector = document.querySelector(this.config.selector);
    this.selectorWidth = this.selector.getBoundingClientRect().width;
    this.innerElements = [].slice.call(this.selector.children);
    this.currentSlide = this.config.startIndex;

    // Build markup and apply required styling to elements
    this.init();

    // if elements is draggable
    if (this.config.draggable) {
      // Keep track of drag distance of sliderFrame
      this.drag = {
        start: 0,
        end: 0,
      };

      // add touch and mouse events
      this.sliderFrame.addEventListener('touchstart', (e) => {
        this.drag.start = e.pageX;
      });
      this.sliderFrame.addEventListener('touchend', (e) => {
        this.drag.end = e.pageX;
        this.updateAfterDrag();
      });
      this.sliderFrame.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.drag.start = e.pageX;
      });
      this.sliderFrame.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.drag.end = e.pageX;
        this.sliderFrame.style.cursor = '-webkit-grab';
        this.updateAfterDrag();
      });
      this.sliderFrame.addEventListener('mousemove', (e) => {
        e.preventDefault();
        if (e.which) {
          this.sliderFrame.style.cursor = '-webkit-grabbing';
        }
      });
    }
  }

  Siema.prototype.init = function init() {
    if (this.selector === null) {
      throw new Error('Something wrong with your Siema sleector 😭');
    }

    // selector should hide everything out of it's bounduries'
    this.selector.style.overflow = 'hidden';

    // create frame and apply styling
    this.sliderFrame = document.createElement('div');
    
    this.sliderFrame.style.width = `${(this.selectorWidth / this.config.perPage) * this.innerElements.length}px`;
    this.sliderFrame.style.transitionDuration = `${this.config.duration}ms`;
    this.sliderFrame.style.transitionTimingFunction = this.config.easing;

    if (this.config.draggable) {
      this.sliderFrame.style.cursor = '-webkit-grab';
    }

    const docFragment = document.createDocumentFragment();

    for (let i = 0; i < this.innerElements.length; i++) {
      this.innerElements[i].style.float = 'left';
      this.innerElements[i].style.width = `${this.selectorWidth / this.config.perPage}px`;
      docFragment.appendChild(this.innerElements[i]);
    }

    this.sliderFrame.appendChild(docFragment);
    this.selector.appendChild(this.sliderFrame);
    this.slideToCurrent();
  };

  // go to prev slide
  Siema.prototype.prev = function prev() {
    if (this.currentSlide === 0) {
      this.currentSlide = this.innerElements.length - this.config.perPage;
    }
    else {
      this.currentSlide--;
    }
    this.slideToCurrent();
  };

  // go to next slide
  Siema.prototype.next = function next() {
    if (this.currentSlide === this.innerElements.length - this.config.perPage) {
      this.currentSlide = 0;
    }
    else {
      this.currentSlide++;
    }
    this.slideToCurrent();
  };

  // to to index
  Siema.prototype.goTo = (index) => {
    this.currentSlide = Math.min(Math.max(index, 0), this.innerElements.length - 1);
    this.slideToCurrent();
  };

  // slide to current slide
  // should be triggered always after changing currentSlide
  Siema.prototype.slideToCurrent = function slideToCurrent() {
    this.sliderFrame.style.WebkitTransform = `translate3d(-${this.currentSlide * (this.selectorWidth / this.config.perPage)}px, 0, 0)`;
    this.sliderFrame.style.transform = `translate3d(-${this.currentSlide * (this.selectorWidth / this.config.perPage)}px, 0, 0)`;
  };

  Siema.prototype.updateAfterDrag = function updateAfterDrag() {
    const move = this.drag.end - this.drag.start;
    if (move > 0 && Math.abs(move) > this.config.threshold) {
      this.prev();
    }
    else if (move < 0 && Math.abs(move) > this.config.threshold) {
      this.next();
    }
  };

  // Exports to node & browser
  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Siema;
  }
  // Browser
  else {
    // eslint-disable-next-line dot-notation
    global['Siema'] = Siema;
  }
}(window));
