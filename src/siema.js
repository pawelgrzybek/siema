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
      threshold: 20
    };

    // Merge defaults with user config
    this.config = Object.assign(defaults, options);

    // Create global references
    this.selector = document.querySelector(this.config.selector);
    this.innerElementsCount = this.selector.childElementCount;
    this.currentSlide = this.config.startIndex;
    this.sliderFrame = document.createElement('div');

    // Build markup and apply required styling to elements
    this.init();

    // go to prev slide
    this.prev = () => {
      if (this.currentSlide === 0) {
        this.currentSlide = this.innerElementsCount - this.config.perPage;
      }
      else {
        this.currentSlide--;
      }
      this.slideToCurrent();
    };

    // go to next slide
    this.next = () => {
      if (this.currentSlide === this.innerElementsCount - this.config.perPage) {
        this.currentSlide = 0;
      }
      else {
        this.currentSlide++;
      }
      this.slideToCurrent();
    };

    // to to index
    this.goTo = (index) => {
      this.currentSlide = Math.min(Math.max(index, 0), this.innerElementsCount - 1);
      this.slideToCurrent();
    };

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
        this.drag.start = e.pageX;
      });
      this.sliderFrame.addEventListener('mouseup', (e) => {
        this.drag.end = e.pageX;
        this.sliderFrame.style.cursor = '-webkit-grab';
        this.updateAfterDrag();
      });
      this.sliderFrame.addEventListener('mousemove', (e) => {
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
    this.selector.style.overflowX = 'hidden';
    this.sliderFrame.style.width = `${(100 / this.config.perPage) * this.innerElementsCount}%`;
    this.sliderFrame.style.transitionDuration = `${this.config.duration}ms`;
    this.sliderFrame.style.transitionTimingFunction = this.config.easing;
    this.sliderFrame.style.WebkitTransform = `translate3d(-${this.currentSlide * (100 / this.innerElementsCount)}%, 0, 0)`;
    this.sliderFrame.style.transform = `translate3d(-${this.currentSlide * (100 / this.innerElementsCount)}%, 0, 0)`;
    if (this.config.draggable) {
      this.sliderFrame.style.cursor = '-webkit-grab';
    }
    for (let i = 0; i < this.innerElementsCount; i++) {
      this.selector.children[0].style.float = 'left';
      this.selector.children[0].style.width = `${100 / this.innerElementsCount}%`;
      this.sliderFrame.appendChild(this.selector.children[0]);
    }
    this.selector.appendChild(this.sliderFrame);
  };

  // slide to current slide
  // should be triggered always after changing currentSlide
  Siema.prototype.slideToCurrent = function slideToCurrent() {
    this.sliderFrame.style.WebkitTransform = `translate3d(-${this.currentSlide * (100 / this.innerElementsCount)}%, 0, 0)`;
    this.sliderFrame.style.transform = `translate3d(-${this.currentSlide * (100 / this.innerElementsCount)}%, 0, 0)`;
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
