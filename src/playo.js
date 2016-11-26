console.log('test');

// eslint-disable-next-line wrap-iife, func-names
(function(global) {
  function Playo(selector, options) {
    // Default the settings
    this.defaults = {
      transition: 300,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
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
    Object.assign(this.sliderFrame.style, {
      width: `${(100 / this.config.perPage) * this.elementsCount}%`,
      transitionDuration: `${this.config.transition}ms`,
      transitionTimingFunction: this.config.easing,
      transform: `translate3d(-${this.currentSlide * (100 / this.elementsCount)}%, 0, 0)`,
    });

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

  // Exports to multiple environments
  if (typeof module !== 'undefined' && module.exports) {
    // node
    module.exports = Playo;
  }
  else {
    // browser
    // eslint-disable-next-line dot-notation
    global['Playo'] = Playo;
  }
}(this));
