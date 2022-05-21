type Logger = (actionName: string) => void;
type Unsubscibe = () => void;
type VNode = any;
type Colors = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"];

type ComponentChild = VNode | object | string | number | bigint | boolean | null | undefined;
type ComponentChildren = ComponentChild[] | ComponentChild;
type Key = string | number | any;
type RefObject<T> = { current: T | null };
type RefCallback<T> = (instance: T | null) => void;
type Ref<T> = RefObject<T> | RefCallback<T>;
interface Attributes {
  key?: Key;
  jsx?: boolean;
}
interface ErrorInfo {
  componentStack?: string;
}
type RenderableProps<P, RefType = any> = P &
	Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>;
interface Comp<P = {}, S = {}> {
	componentWillMount?(): void;
	componentDidMount?(): void;
	componentWillUnmount?(): void;
	getChildContext?(): object;
	componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
	shouldComponentUpdate?(
		nextProps: Readonly<P>,
		nextState: Readonly<S>,
		nextContext: any
	): boolean;
	componentWillUpdate?(
		nextProps: Readonly<P>,
		nextState: Readonly<S>,
		nextContext: any
	): void;
	getSnapshotBeforeUpdate?(oldProps: Readonly<P>, oldState: Readonly<S>): any;
	componentDidUpdate?(
		previousProps: Readonly<P>,
		previousState: Readonly<S>,
		snapshot: any
	): void;
	componentDidCatch?(error: any, errorInfo: ErrorInfo): void;
}

declare abstract class Comp<P, S> {
	constructor(props?: P, context?: any);
	static displayName?: string;
	static defaultProps?: any;
	static contextType?: any;
	static getDerivedStateFromProps?(
		props: Readonly<object>,
		state: Readonly<object>
	): object | null;
	static getDerivedStateFromError?(error: any): object | null;
	state: Readonly<S>;
	props: RenderableProps<P>;
	context: any;
	base?: Element | Text;
	setState<K extends keyof S>(
		state:
			| ((
					prevState: Readonly<S>,
					props: Readonly<P>
			  ) => Pick<S, K> | Partial<S> | null)
			| (Pick<S, K> | Partial<S> | null),
		callback?: () => void
	): void;
	forceUpdate(callback?: () => void): void;
	abstract render(
		props?: RenderableProps<P>,
		state?: Readonly<S>,
		context?: any
	): ComponentChild;
}
declare abstract class PureComp<P = {}, S = {}> extends Comp<P,S> {
  isPureReactComponent: boolean;
}
interface OffsetReturn {
  top: number;
  left: number;
}

interface SliderOptions {
  value: number | [number, number];
  min: number;
  max: number;
  step?: number;
  range?: boolean;
  onChange?: (value: number | [number, number]) => void;
  onChanged?: (value: number | [number, number]) => void;

}
interface VQueryReturn<T extends HTMLElement> {
  attr(attrName: string): string;
  attr(attrName: string, value: string): VQueryReturn<T>;
  removeAttr(attrName: string): VQueryReturn<T>;
  css(styles: CSSStyleDeclaration): VQueryReturn<T>
  removeCss(property: keyof CSSStyleDeclaration): VQueryReturn<T>;
  hasClass(className: string): boolean;
  getClass(): string[];
  addClass(className: string): VQueryReturn<T>;
  toggleClass(className: string): VQueryReturn<T>;
  removeClass(className: string): VQueryReturn<T>;
  html(): string;
  html(value: string): VQueryReturn<T>;
  text(): string;
  text(value: string): VQueryReturn<T>;
  on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): VQueryReturn<T>;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): VQueryReturn<T>;
  off<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): VQueryReturn<T>;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): VQueryReturn<T>;
  val(): string;
  val(value: string): VQueryReturn<T>;
  width(): number;
  width(value: string | number): VQueryReturn<T>;
  height(): number;
  height(value: string | number): VQueryReturn<T>;
  getBoundingClientRect(): DOMRect;
  offset(): OffsetReturn;
  insert(where: InsertPosition, element: Element | string): VQueryReturn<T>;
  append(node: Node): VQueryReturn<T>;
  next(): Element;
  prev(): Element;
  parent(): ParentNode;
  children(): VQueryReturn<T>;
  children(index: number): VQueryReturn<T>;
  childNodes(): NodeListOf<ChildNode>;
  before(...nodes: (string | Node)[]): VQueryReturn<T>;
  after(...nodes: (string | Node)[]): VQueryReturn<T>;
  closest(selector: string): VQueryReturn<T>;
  find(selector: string): VQueryReturn<T>;
  each(callback: (el: VQueryReturn<T>, index: number, els: HTMLElement[]) => void): VQueryReturn<T>;
  contains(selector: string): boolean;
}

interface MobileMenuOptions {
  width?: number;
  duration?: number;
  navSelector?: string;
  menuSelector?: string;
  linkSelector?: string;
  subMenuSelector?: string;
  backClassName?: string;
  closeClassName?: string;
  hamburgerButtonPosition?: string;
  renderHamburgerButton?: (className: string) => string;
  renderBackButton?: (className: string) => string;
  renderCloseButton?: (className: string) => string;
}
interface MobileMenuReturn {
  init(): void;
  destroy(): void;
}
interface MessageOptions {
  content: string;
  icon?: string;
  duration?: number;
  delay?: number;
  className?: string;
  style?: CSSStyleDeclaration,
  onShow?: () => void;
  onHide?: () => void;
}
interface NotificationOptions {
  placement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  content: string | VNode;
  closeButton: string | VNode;
  duration?: number;
  delay?: number;
  className?: string;
  style?: CSSStyleDeclaration,
  onShow?: () => void;
  onHide?: () => void;
}
type SelectDestroy = () => void;

declare interface Veda {
  utils: {
    objStrParse(value: string): Record<string, any>;
    isMobile: {
      android: boolean;
      blackBerry: boolean;
      ipad: boolean;
      iOS: boolean;
      opera: boolean;
      windows: boolean;
      any: boolean;
    };
    storage: Storage;
    store: {
      get(stateName?: string): Record<string, any>;
      create<T extends any>(stateName: string, options: { initialState: T, useStorage: boolean }): void;
      set<T extends any>(stateName: string, state: T): Logger;
      subscribe<T extends any>(stateName: string, listener: (state: T) => void): Unsubscibe;
    },
    getColorNames(): Colors;
    map<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): string;
    csr: {
      withStore(stateNames: string | string[]): (Component: any) => void;
      html(template: TemplateStringsArray, ...values: any[]): VNode;
      render(tree: VNode, parent: HTMLElement): void;
      renderWithElement(tree: VNode, className: string): void;
      createPortal(vnode: VNode, container: Element): VNode;
      Component: typeof Comp;
      PureComponent: typeof PureComp;
    },
    offset(element: Element): OffsetReturn;
    VQuery: <T extends HTMLElement>(selector: string | T, context: T | VQueryReturn<T>) => VQueryReturn<T>;
    delay(ms?: number): Promise<undefined>;
    createRootElement<T extends HTMLElement>(className: string): T;
  }
  plugins: {
    /** Masonry
     * ```js
     * const masonry = veda.plugins.masonry('.masonry', {
     *  defaultColumn: 3,
     *  gap: 10,
     *  columnClassName: "masonry__item",
     *  responsive: [
     *    { breakpoint: 480, column: 2 },
     *    { breakpoint: 768, column: 3 },
     *    { breakpoint: 992, column: 4 }
     *  ]
     * });
     * masonry.on("load", () => {
     *  console.log("load");
     * });
     * masonry.on("resize", () => {
     *  console.log("resize");
     * });
     *```
     */
     masonry(selector: string, options: {
      defaultColumn?: number;
      gap?: number;
      columnClassName?: string;
      responsive?: ({
        breakpoint: number;
        column: number;
      })[];
     }): void;

    /** Theme toggle
     * ```html
     * // Liquid Example
     * <button class="veda-toggle-theme">Theme light | dark</button>
     * ```
     * ```js
     * // Javascript Example
     * veda.plugins.themeToggle(container);
     * ```
     */
    themeToggle(container: HTMLElement): void;

    /** Countdown
     * ```html
     * // Liquid Example
     * <div class="veda-countdown" data-options="{ timestamp: {{countdown}} }">
     *   <div>Days</div>
     *   <div class="veda-countdown__days"></div>
     *   <div>Hours</div>
     *   <div class="veda-countdown__hours"></div>
     *   <div>Minutes</div>
     *   <div class="veda-countdown__minutes"></div>
     *   <div>Seconds</div>
     *   <div class="veda-countdown__seconds"></div>
     * </div>
     * ```
     * ```js
     * // Javascript Example
     * veda.plugins.countdown(container);
     * ```
     */
    countdown(container: HTMLElement): void;

    /** Swiper
     * ```html
     * // Liquid Example
     * <div
     *   class="veda-swiper"
     *   data-options="{
     *     speed: 400,
     *     spaceBetween: 30
     *   }"
     * >
     *   <div className="swiper">
     *     <div class="veda-swiper-wrapper swiper-wrapper">
     *       {% for swiper in swipers %}
     *         <div component="swipers" class="swiper-slide">{{swiper.text}}</div>
     *       {% endfor %}
     *     </div>
     *   </div>
     *   <div class="swiper-button-prev"></div>
     *   <div class="swiper-button-next"></div>
     *   <div class="swiper-pagination"></div>
     * </div>
     * ```
     * ```js
     * // Javascript Example
     * veda.plugins.swiper(container);
     * ```
     */
    swiper(container: HTMLElement): void;

    /** Tabs
     * ```html
     * // Liquid Example
     * <div component="tabs" class="veda-tabs {{variant}}">
     *   <div class="veda-tabs__nav">
     *     {% for tab in tabs %}
     *       <div class="veda-tabs__link {{tab.active ? 'veda-tabs__link--active' : ''}}">{{tab.label}}</div>
     *     {% endfor %}
     *   </div>
     *   <div class="veda-tabs__content">
     *     {% for tab in tabs %}
     *       <div class="veda-tabs__pane">{{tab.text}}</div>
     *     {% endfor %}
     *   </div>
     * </div>
     * ```
     * ```js
     * // Javscript
     * veda.plugins.tabs(container);
     * ```
     */
    tabs(container: HTMLElement): void;

    /** Collapse
     * ```js
     * // Javascript Example
     * veda.plugins.collapse(container);
     * ```
     */
    collapse(container: HTMLElement): void;

    /** Image Zoom
     * ```html
     * // Liquid Example
     * <div
     *   class="veda-image-zoom"
     *   data-image-zoom-src="{{ image.src }}"
     *   data-image-zoom="6"
     * >
     *   <img
     *     src="{{ image.src }}"
     *     alt=""
     *   />
     * </div>
     * ```
     * ```js
     * // Javascript Example
     * veda.plugins.imageZoom(container);
     * ```
     */
    imageZoom(container: HTMLElement): void;

    /** Mobile Menu
     * ```js
     * // Javascript Example
     * veda.plugins.mobileMenu(container, {
     *   navSelector: ".veda-nav",
     *   menuSelector: ".veda-nav__menu",
     *   linkSelector: ".veda-nav__link",
     *   subMenuSelector: ".veda-nav__sub-list",
     *   backClassName: "veda-nav__list-item-back p:15px c:color-gray9 bdb:1px_solid_color-gray2",
     *   closeClassName: "veda-nav__close p:8px_15px c:color-gray9 bdb:1px_solid_color-gray2",
     * });
     * function checkResponsive() {
     *   if (window.innerWidth > 992) {
     *     menu.destroy();
     *   } else {
     *     menu.init();
     *   }
     * }
     * checkResponsive();
     * window.addEventListener("resize", checkResponsive);
     * ```
     */
    mobileMenu(container: HTMLElement, options: MobileMenuOptions): MobileMenuReturn;

    /** Create Message
     * ```js
     * const { VQuery: $$ } = veda.utils;
     * const { createMessage } = veda.plugins;
     * const message = createMessage();
     *
     * $$(".button1").on("click", () => {
     *   message.info("Lorem ipsum dolor sit amet");
     * });
     *
     * $$(".button2").on("click", () => {
     *   message.error({
     *     content: "Test full options",
     *     duration: 100,
     *     delay: 3000,
     *     icon: '<i class="fas fa-times"></i>',
     *     onShow() {
     *       console.log("show");
     *     },
     *     onHide() {
     *       console.log("hide");
     *     }
     *   });
     * });
     * ```
     */
    createMessage(): {
      info(content: string | MessageOptions): void;
      success(content: string | MessageOptions): void;
      warning(content: string | MessageOptions): void;
      error(content: string | MessageOptions): void;
    };

    /** Create Notification
     * ```js
     * const { VQuery: $$ } = veda.utils;
     * const { createNotification } = veda.plugins;
     * const notification = createNotification();
     *
     * $$(".button1").on("click", () => {
     *   notification.push("Lorem ipsum dolor sit amet");
     * });
     *
     * $$(".button2").on("click", () => {
     *   notification.push({
     *     placement: "top-right",
     *     content: "Test full options",
     *     duration: 100,
     *     delay: 3000,
     *     onShow() {
     *       console.log("show");
     *     },
     *     onHide() {
     *       console.log("hide");
     *     }
     *   });
     * });
     * ```
     */
    createNotification(): {
      push(content: string | NotificationOptions): void;
    };


    /** Select
     * ```html
     * // Liquid Example
     * <div class="veda-select">
     *   <div class="veda-select__view">
     *     <div class="veda-select__label"></div>
     *   </div>
    *    <div class="veda-select__options">
     *     <div class="veda-select__option" value="html" selected>Html</div>
     *     <div class="veda-select__option" value="photoshop">Photoshop</div>
     *   </div>
     * </div>
     * ```
     * ```js
     * // Javascript Example
     * veda.plugins.select(container, {
     *   onChange: value => {
     *     console.log(value);
     *   }
     * });
     * // Or
     * const destroy = veda.plugins.select(container);
     * ```
     */
    select(container: HTMLElement, options: { onChange: (value: string) => void }): SelectDestroy;

    /** Slider
     * ```html
     * // Liquid Example
     * <div class="veda-slider" data-options="{ min: 100 }">
     *    <div class="veda-slider__thumb" data-index="0"></div>
     *    <div class="veda-slider__thumb" data-index="1"></div>
     *    <div class="veda-slider__track"></div>
     *    <div class="veda-slider__tracked"></div>
      </div>
     * ```
     * ```js
     * // Javascript Example
     * veda.plugins.slider(container, {
     *   min: 0,
     *   max: 100,
     *   step: 1,
     *   range: true,
     *   value: [0, 80],
     *   onChange: value => {
     *     console.log(value);
     *   }
     *   onChanged: value => {
     *     console.log(value);
     *   }
     * });
     * ```
     */
     slider(container: HTMLElement, options: SliderOptions): void;
  }
}

declare const veda: Veda;
