// eslint-disable-next-line wrap-iife, func-names
(function(global) {
  function Siema(selector, options) {
    // Default the settings
    this.defaults = {
      duration: 300,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      threshold: 20
    };

    // Merge defaults with user config
    this.config = Object.assign(this.defaults, options);

    // reference to wrapper and inner elements
    this.selector = document.querySelector(selector);

    if (this.selector === null) {
      throw new Error('Something wrong with your Yolo sleector 😭');
    }

    this.elementsCount = document.querySelector(selector).childElementCount;
    this.currentSlide = this.config.startIndex;

    // Hide all elements that are outside of slider div
    this.selector.style.overflowX = 'hidden';

    // // Create inner div that holds all slides and apply their position
    this.sliderFrame = document.createElement('div');
    this.sliderFrame.style.width = `${(100 / this.config.perPage) * this.elementsCount}%`;
    this.sliderFrame.style.transitionDuration = `${this.config.duration}ms`;
    this.sliderFrame.style.transitionTimingFunction = this.config.easing;
    this.sliderFrame.style.transform = `translate3d(-${this.currentSlide * (100 / this.elementsCount)}%, 0, 0)`;
    if (this.config.draggable) {
      this.sliderFrame.style.cursor = '-webkit-grab';
    }

    this.drag = {
      start: 0,
      end: 0,
    };

    this.updateAfterDrag = () => {
      const move = this.drag.end - this.drag.start;
      if (move > 0 && Math.abs(move) > this.config.threshold) {
        this.prev();
      }
      else if (move < 0 && Math.abs(move) > this.config.threshold) {
        this.next();
      }
    };

    this.sliderFrame.addEventListener('touchstart', (e) => {
      this.drag.start = e.pageX;
    });
    this.sliderFrame.addEventListener('touchend', (e) => {
      this.drag.end = e.pageX;
      this.updateAfterDrag();
    });
    if (this.config.draggable) {
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

    // Add styles to slides and add them to frame
    for (let i = 0; i < this.elementsCount; i++) {
      this.selector.children[0].style.float = 'left';
      this.selector.children[0].style.width = `${100 / this.elementsCount}%`;
      this.sliderFrame.appendChild(this.selector.children[0]);
    }

    // // Print frame
    this.selector.appendChild(this.sliderFrame);

    // slide to surrent slide
    this.slideToCurrent = () => {
      this.sliderFrame.style.transform = `translate3d(-${this.currentSlide * (100 / this.elementsCount)}%, 0, 0)`;
    };

    // go to prev slide
    this.prev = () => {
      if (this.currentSlide === 0) {
        this.currentSlide = this.elementsCount - this.config.perPage;
      }
      else {
        this.currentSlide--;
      }
      this.slideToCurrent();
    };

    // go to next slide
    this.next = () => {
      if (this.currentSlide === this.elementsCount - this.config.perPage) {
        this.currentSlide = 0;
      }
      else {
        this.currentSlide++;
      }
      this.slideToCurrent();
    };

    // to to index
    this.goTo = (index) => {
      this.currentSlide = Math.min(Math.max(index, 0), this.elementsCount - 1);
      this.slideToCurrent();
    };
  }

  // Exports to node & browser
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Siema;
  }
  else {
    // eslint-disable-next-line dot-notation
    global['Siema'] = Siema;
  }
}(this));
