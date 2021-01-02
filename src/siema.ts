export interface SiemaOptions {
    selector: HTMLElement|string;
    duration: number;
    easing: string;
    perPage: number|{[width: number]: number};
    startIndex: number;
    draggable: boolean;
    multipleDrag: boolean;
    threshold: number;
    loop: boolean;
    rtl: boolean;
    onInit?: () => void;
    onChange?: () => void;
}

/**
 * Hi :-) This is a class representing a Siema.
 */
export default class Siema {

    /** Config used for this instace of Siema */
    public config: SiemaOptions;

    /** Variable to track if mouse is pressed */
    private pointerDown: boolean;

    /** Variable to track mouse track */
    private drag: {
        startX: number;
        endX: number;
        startY: number;
        letItGo: boolean;
        preventClick: boolean;
    };

    /** Reference to the Siema element */
    public selector: HTMLElement;

    /** The width of the Siema element  */
    private selectorWidth: number;

    /** How many items to show per page */
    private perPage: number;

    /** Variable to keep track of the actual items */
    private innerElements: Element[];

    /** Zero based index of the current slide */
    private currentSlide: number;

    /** Variable to keeo track of wether to use standard or webkit compaotible transforms */
    private transformProperty: 'transform'|'webkitTransform';

    /** Reference to the the sliding wrapper for all items */
    private sliderFrame: HTMLDivElement;

    /**
     * Create a Siema.
     */
    constructor(options: Partial<SiemaOptions>) {

        // Merge defaults with user's settings
        this.config = Siema.mergeSettings(options);

        // Resolve selector's type
        this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;

        // Early throw if selector doesn't exists
        if (this.selector === null) {
            throw new Error('Something is wrong with your selector');
        }

        // update perPage number dependable of user value
        this.resolveSlidesNumber();

        // Create global references
        this.selectorWidth = this.selector.offsetWidth;
        this.innerElements = Array.from(this.selector.children);
        this.currentSlide = this.config.loop ?
            this.config.startIndex % this.innerElements.length :
            Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage));
        this.transformProperty = Siema.webkitOrNot();

        // Build markup and apply required styling to elements
        this.init();
    }

    /**
     * Merge default settings with custom ones.
     */
    static mergeSettings(options: Partial<SiemaOptions>): SiemaOptions {
        const defaultOptions: SiemaOptions = {
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
            onInit: Function,
            onChange: Function,
        };

        return Object.assign(defaultOptions, options);
    }

    /**
     * Determine if browser supports unprefixed transform property.
     * Google Chrome since version 26 supports prefix-less transform
     */
    static webkitOrNot(): 'transform'|'webkitTransform' {
        const style = document.documentElement.style;
        if (typeof style.transform === 'string') {
            return 'transform';
        }
        return 'webkitTransform';
    }

    /**
     * Attaches listeners to required events.
     */
    private attachEvents(): void {
        // Resize element on window resize
        window.addEventListener('resize', this.resizeHandler);

        // If element is draggable / swipable, add event handlers
        if (this.config.draggable) {
            // Keep track pointer hold and dragging distance
            this.pointerDown = false;
            this.drag = {
                startX: 0,
                endX: 0,
                startY: 0,
                letItGo: null,
                preventClick: false,
            };

            // Touch events
            this.selector.addEventListener('touchstart', this.touchstartHandler);
            this.selector.addEventListener('touchend', this.touchendHandler);
            this.selector.addEventListener('touchmove', this.touchmoveHandler);

            // Mouse events
            this.selector.addEventListener('mousedown', this.mousedownHandler);
            this.selector.addEventListener('mouseup', this.mouseupHandler);
            this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
            this.selector.addEventListener('mousemove', this.mousemoveHandler);

            // Click
            this.selector.addEventListener('click', this.clickHandler);
        }
    }

    /**
     * Detaches listeners from required events.
     */
    private detachEvents(): void {
        window.removeEventListener('resize', this.resizeHandler);
        this.selector.removeEventListener('touchstart', this.touchstartHandler);
        this.selector.removeEventListener('touchend', this.touchendHandler);
        this.selector.removeEventListener('touchmove', this.touchmoveHandler);
        this.selector.removeEventListener('mousedown', this.mousedownHandler);
        this.selector.removeEventListener('mouseup', this.mouseupHandler);
        this.selector.removeEventListener('mouseleave', this.mouseleaveHandler);
        this.selector.removeEventListener('mousemove', this.mousemoveHandler);
        this.selector.removeEventListener('click', this.clickHandler);
    }

    /**
     * Builds the markup and attaches listeners to required events.
     */
    private init(): void {
        this.attachEvents();

        // hide everything out of selector's boundaries
        this.selector.style.overflow = 'hidden';

        // rtl or ltr
        this.selector.style.direction = this.config.rtl ? 'rtl' : 'ltr';

        // build a frame and slide to a currentSlide
        this.buildSliderFrame();

        this.config.onInit.call(this);
    }

    /**
     * Build a sliderFrame and slide to a current item.
     */
    private buildSliderFrame(): void {
        const widthItem = this.selectorWidth / this.perPage;
        const itemsToBuild = this.config.loop ? this.innerElements.length + (2 * this.perPage) : this.innerElements.length;

        // Create frame and apply styling
        this.sliderFrame = document.createElement('div');
        this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`;
        this.enableTransition();

        if (this.config.draggable) {
            this.selector.style.cursor = '-webkit-grab';
        }

        // Create a document fragment to put slides into it
        const docFragment = document.createDocumentFragment();

        // Loop through the slides, add styling and add them to document fragment
        if (this.config.loop) {
            for (let i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
                const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true) as HTMLElement);
                docFragment.appendChild(element);
            }
        }
        for (let i = 0; i < this.innerElements.length; i++) {
            const element = this.buildSliderFrameItem(this.innerElements[i] as HTMLElement);
            docFragment.appendChild(element);
        }
        if (this.config.loop) {
            for (let i = 0; i < this.perPage; i++) {
                const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true) as HTMLElement);
                docFragment.appendChild(element);
            }
        }

        // Add fragment to the frame
        this.sliderFrame.appendChild(docFragment);

        // Clear selector (just in case something is there) and insert a frame
        this.selector.innerHTML = '';
        this.selector.appendChild(this.sliderFrame);

        // Go to currently active slide after initial build
        this.slideToCurrent();
    }

    private buildSliderFrameItem(elm: HTMLElement): HTMLDivElement {
        const elementContainer = document.createElement('div');
        elementContainer.style.cssFloat = this.config.rtl ? 'right' : 'left';
        elementContainer.style.width = `${this.config.loop ? 100 / (this.innerElements.length + (this.perPage * 2)) : 100 / (this.innerElements.length)}%`;
        elementContainer.appendChild(elm);
        return elementContainer;
    }

    /**
     * Determinates slides number accordingly to clients viewport.
     */
    private resolveSlidesNumber(): void {
        if (typeof this.config.perPage === 'number') {
            this.perPage = this.config.perPage;

        } else {
            this.perPage = 1;
            for (const key in this.config.perPage) {
                if (window.innerWidth >= this.config.perPage[key]) {
                    this.perPage = this.config.perPage[key];
                }
            }
        }
    }

    /**
     * Go to previous slide.
     */
    public prev(howManySlides = 1, callback?: () => void): void {
        // early return when there is nothing to slide
        if (this.innerElements.length <= this.perPage) {
            return;
        }

        const beforeChange = this.currentSlide;

        if (this.config.loop) {
            const isNewIndexClone = this.currentSlide - howManySlides < 0;
            if (isNewIndexClone) {
                this.disableTransition();

                const mirrorSlideIndex = this.currentSlide + this.innerElements.length;
                const mirrorSlideIndexOffset = this.perPage;
                const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
                const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
                const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

                this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
                this.currentSlide = mirrorSlideIndex - howManySlides;
            } else {
                this.currentSlide = this.currentSlide - howManySlides;
            }
        } else {
            this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
        }

        if (beforeChange !== this.currentSlide) {
            this.slideToCurrent(this.config.loop);
            this.config.onChange.call(this);
            if (callback) {
                callback.call(this);
            }
        }
    }


    /**
     * Go to next slide.
     */
    public next(howManySlides = 1, callback?: () => void): void {
        // early return when there is nothing to slide
        if (this.innerElements.length <= this.perPage) {
            return;
        }

        const beforeChange = this.currentSlide;

        if (this.config.loop) {
            const isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage;
            if (isNewIndexClone) {
                this.disableTransition();

                const mirrorSlideIndex = this.currentSlide - this.innerElements.length;
                const mirrorSlideIndexOffset = this.perPage;
                const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
                const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
                const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

                this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
                this.currentSlide = mirrorSlideIndex + howManySlides;
            } else {
                this.currentSlide = this.currentSlide + howManySlides;
            }
        } else {
            this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
        }
        if (beforeChange !== this.currentSlide) {
            this.slideToCurrent(this.config.loop);
            this.config.onChange.call(this);
            if (callback) {
                callback.call(this);
            }
        }
    }


    /**
     * Disable transition on sliderFrame.
     */
    private disableTransition(): void {
        this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
        this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
    }


    /**
     * Enable transition on sliderFrame.
     */
    private enableTransition(): void {
        this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
        this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
    }

    /**
     * Go to slide with particular index
     */
    public goTo(index: number, callback?: () => void): void {
        if (this.innerElements.length <= this.perPage) {
            return;
        }
        const beforeChange = this.currentSlide;
        this.currentSlide = this.config.loop ?
            index % this.innerElements.length :
            Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
        if (beforeChange !== this.currentSlide) {
            this.slideToCurrent();
            this.config.onChange.call(this);
            if (callback) {
                callback.call(this);
            }
        }
    }

    /**
     * Moves sliders frame to position of currently active slide
     */
    public slideToCurrent(enableTransition?: boolean): void {
        const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
        const offset = (this.config.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage);

        if (enableTransition) {
            // This one is tricky, I know but this is a perfect explanation:
            // https://youtu.be/cCOL7MC4Pl0
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.enableTransition();
                    if (this.transformProperty === 'transform') {
                        this.sliderFrame.style.transform = `translate3d(${offset}px, 0, 0)`;
                    } else {
                        this.sliderFrame.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
                    }
                });
            });
        } else {
            this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
        }
    }


    /**
     * Recalculate drag /swipe event and reposition the frame of a slider
     */
    private updateAfterDrag(): void {
        const movement = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
        const movementDistance = Math.abs(movement);
        const howManySliderToSlide = this.config.multipleDrag ? Math.ceil(movementDistance / (this.selectorWidth / this.perPage)) : 1;

        const slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0;
        const slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage;

        if (movement > 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
            this.prev(howManySliderToSlide);
        } else if (movement < 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
            this.next(howManySliderToSlide);
        }
        this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
    }


    /**
     * When window resizes, resize slider components as well
     */
    private resizeHandler = (): void => {
        // update perPage number dependable of user value
        this.resolveSlidesNumber();

        // relcalculate currentSlide
        // prevent hiding items when browser width increases
        if (this.currentSlide + this.perPage > this.innerElements.length) {
            this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage;
        }

        this.selectorWidth = this.selector.offsetWidth;

        this.buildSliderFrame();
    }

    /**
     * Clear drag after touchend and mouseup event
     */
    private clearDrag(): void {
        this.drag = {
            startX: 0,
            endX: 0,
            startY: 0,
            letItGo: null,
            preventClick: this.drag.preventClick
        };
    }

    /**
     * touchstart event handler
     */
    private touchstartHandler = (e: TouchEvent): void => {
        // Prevent dragging / swiping on inputs, selects and textareas
        const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf((e.target as HTMLElement).nodeName) !== -1;
        if (ignoreSiema) {
            return;
        }

        e.stopPropagation();
        this.pointerDown = true;
        this.drag.startX = e.touches[0].pageX;
        this.drag.startY = e.touches[0].pageY;
    }

    /**
     * touchend event handler
     */
    private touchendHandler = (e: TouchEvent): void => {
        e.stopPropagation();
        this.pointerDown = false;
        this.enableTransition();
        if (this.drag.endX) {
            this.updateAfterDrag();
        }
        this.clearDrag();
    }

    /**
     * touchmove event handler
     */
    private touchmoveHandler = (e: TouchEvent): void=> {
        e.stopPropagation();

        if (this.drag.letItGo === null) {
            this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
        }

        if (this.pointerDown && this.drag.letItGo) {
            e.preventDefault();
            this.drag.endX = e.touches[0].pageX;
            this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
            this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

            const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
            const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
            const dragOffset = (this.drag.endX - this.drag.startX);
            const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
            this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
        }
    }

    /**
     * mousedown event handler
     */
    private mousedownHandler = (e: MouseEvent): void => {
        // Prevent dragging / swiping on inputs, selects and textareas
        const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf((e.target as HTMLElement).nodeName) !== -1;
        if (ignoreSiema) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        this.pointerDown = true;
        this.drag.startX = e.pageX;
    }

    /**
     * mouseup event handler
     */
    private mouseupHandler = (e: MouseEvent): void => {
        e.stopPropagation();
        this.pointerDown = false;
        this.selector.style.cursor = '-webkit-grab';
        this.enableTransition();
        if (this.drag.endX) {
            this.updateAfterDrag();
        }
        this.clearDrag();
    }

    /**
     * mousemove event handler
     */
    private mousemoveHandler = (e: MouseEvent): void => {
        e.preventDefault();
        if (this.pointerDown) {
            // if dragged element is a link
            // mark preventClick prop as a true
            // to detemine about browser redirection later on
            if ((e.target as HTMLElement).nodeName === 'A') {
                this.drag.preventClick = true;
            }

            this.drag.endX = e.pageX;
            this.selector.style.cursor = '-webkit-grabbing';
            this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
            this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

            const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
            const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
            const dragOffset = (this.drag.endX - this.drag.startX);
            const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
            this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
        }
    }

    /**
     * mouseleave event handler
     */
    private mouseleaveHandler = (e: MouseEvent): void => {
        if (this.pointerDown) {
            this.pointerDown = false;
            this.selector.style.cursor = '-webkit-grab';
            this.drag.endX = e.pageX;
            this.drag.preventClick = false;
            this.enableTransition();
            this.updateAfterDrag();
            this.clearDrag();
        }
    }


    /**
     * click event handler
     */
    private clickHandler = (e: Event): void => {
        // if the dragged element is a link
        // prevent browsers from folowing the link
        if (this.drag.preventClick) {
            e.preventDefault();
        }
        this.drag.preventClick = false;
    }


    /**
     * Remove item from carousel.
     */
    public remove(index: number, callback?: () => void): void {
        if (index < 0 || index >= this.innerElements.length) {
            throw new Error('Item to remove doesn\'t exist');
        }

        // Shift sliderFrame back by one item when:
        // 1. Item with lower index than currenSlide is removed.
        // 2. Last item is removed.
        const lowerIndex = index < this.currentSlide;
        const lastItem = this.currentSlide + this.perPage - 1 === index;

        if (lowerIndex || lastItem) {
            this.currentSlide--;
        }

        this.innerElements.splice(index, 1);

        // build a frame and slide to a currentSlide
        this.buildSliderFrame();

        if (callback) {
            callback.call(this);
        }
    }


    /**
     * Insert item to carousel at particular index.
     */
    public insert(item: HTMLElement, index: number, callback?: () => void): void {
        if (index < 0 || index > this.innerElements.length + 1) {
            throw new Error('Unable to inset it at this index 😭');
        }
        if (this.innerElements.indexOf(item) !== -1) {
            throw new Error('The same item in a carousel? Really? Nope 😭');
        }

        // Avoid shifting content
        const shouldItShift = index <= this.currentSlide && this.innerElements.length;
        this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide;

        this.innerElements.splice(index, 0, item);

        // build a frame and slide to a currentSlide
        this.buildSliderFrame();

        if (callback) {
            callback.call(this);
        }
    }

    /**
     * Prepernd item to carousel.
     */
    public prepend(item: HTMLElement, callback?: () => void): void {
        this.insert(item, 0);
        if (callback) {
            callback.call(this);
        }
    }

    /**
     * Append item to carousel.
     */
    public append(item: HTMLElement, callback?: () => void): void {
        this.insert(item, this.innerElements.length + 1);
        if (callback) {
            callback.call(this);
        }
    }

    /**
     * Removes listeners and optionally restores to initial markup
     */
    public destroy(restoreMarkup = false, callback?: () => void): void {
        this.detachEvents();

        this.selector.style.cursor = 'auto';

        if (restoreMarkup) {
            const slides = document.createDocumentFragment();
            for (let i = 0; i < this.innerElements.length; i++) {
                slides.appendChild(this.innerElements[i]);
            }
            this.selector.innerHTML = '';
            this.selector.appendChild(slides);
            this.selector.removeAttribute('style');
        }

        if (callback) {
            callback.call(this);
        }
    }

}
