export interface SiemaOptions {
    selector: HTMLElement | string;
    duration: number;
    easing: string;
    perPage: number | {
        [width: number]: number;
    };
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
    config: SiemaOptions;
    /** Variable to track if mouse is pressed */
    private pointerDown;
    /** Variable to track mouse track */
    private drag;
    /** Reference to the Siema element */
    selector: HTMLElement;
    /** The width of the Siema element  */
    private selectorWidth;
    /** How many items to show per page */
    private perPage;
    /** Variable to keep track of the actual items */
    private innerElements;
    /** Zero based index of the current slide */
    private currentSlide;
    /** Variable to keeo track of wether to use standard or webkit compaotible transforms */
    private transformProperty;
    /** Reference to the the sliding wrapper for all items */
    private sliderFrame;
    /**
     * Create a Siema.
     */
    constructor(options: Partial<SiemaOptions>);
    /**
     * Merge default settings with custom ones.
     */
    static mergeSettings(options: Partial<SiemaOptions>): SiemaOptions;
    /**
     * Determine if browser supports unprefixed transform property.
     * Google Chrome since version 26 supports prefix-less transform
     */
    static webkitOrNot(): 'transform' | 'webkitTransform';
    /**
     * Attaches listeners to required events.
     */
    private attachEvents;
    /**
     * Detaches listeners from required events.
     */
    private detachEvents;
    /**
     * Builds the markup and attaches listeners to required events.
     */
    private init;
    /**
     * Build a sliderFrame and slide to a current item.
     */
    private buildSliderFrame;
    private buildSliderFrameItem;
    /**
     * Determinates slides number accordingly to clients viewport.
     */
    private resolveSlidesNumber;
    /**
     * Go to previous slide.
     */
    prev(howManySlides?: number, callback?: () => void): void;
    /**
     * Go to next slide.
     */
    next(howManySlides?: number, callback?: () => void): void;
    /**
     * Disable transition on sliderFrame.
     */
    private disableTransition;
    /**
     * Enable transition on sliderFrame.
     */
    private enableTransition;
    /**
     * Go to slide with particular index
     */
    goTo(index: number, callback?: () => void): void;
    /**
     * Moves sliders frame to position of currently active slide
     */
    slideToCurrent(enableTransition?: boolean): void;
    /**
     * Recalculate drag /swipe event and reposition the frame of a slider
     */
    private updateAfterDrag;
    /**
     * When window resizes, resize slider components as well
     */
    private resizeHandler;
    /**
     * Clear drag after touchend and mouseup event
     */
    private clearDrag;
    /**
     * touchstart event handler
     */
    private touchstartHandler;
    /**
     * touchend event handler
     */
    private touchendHandler;
    /**
     * touchmove event handler
     */
    private touchmoveHandler;
    /**
     * mousedown event handler
     */
    private mousedownHandler;
    /**
     * mouseup event handler
     */
    private mouseupHandler;
    /**
     * mousemove event handler
     */
    private mousemoveHandler;
    /**
     * mouseleave event handler
     */
    private mouseleaveHandler;
    /**
     * click event handler
     */
    private clickHandler;
    /**
     * Remove item from carousel.
     */
    remove(index: number, callback?: () => void): void;
    /**
     * Insert item to carousel at particular index.
     */
    insert(item: HTMLElement, index: number, callback?: () => void): void;
    /**
     * Prepernd item to carousel.
     */
    prepend(item: HTMLElement, callback?: () => void): void;
    /**
     * Append item to carousel.
     */
    append(item: HTMLElement, callback?: () => void): void;
    /**
     * Removes listeners and optionally restores to initial markup
     */
    destroy(restoreMarkup?: boolean, callback?: () => void): void;
}
