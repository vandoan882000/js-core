class CoreMasonryEvent {
  constructor() {
    this.events = {};
    this.mounted = false;
  }
  emit(eventType) {
    if (this.events[eventType]) {
      this.events[eventType].forEach(listener => {
        listener();
      });
    }
  }
  on(eventType, listener) {
    this.events = Object.assign(Object.assign({}, this.events), {
      [eventType]: [...(this.events[eventType] || []), listener],
    });
    if (this.eventMount && !this.mounted) {
      this.eventMount();
      this.mounted = true;
    }
  }
}
class CoreMasonry extends CoreMasonryEvent {
  constructor(selector, options) {
    super();
    this.selector = selector;
    this.options = options;
    const defaultOptions = {
      defaultColumn: 3,
      gap: 10,
      columnClassName: 'veda-masonry__item',
      responsive: [],
    };
    this.els = Array.from(document.querySelectorAll(selector));
    this.opts = Object.assign(Object.assign({}, defaultOptions), options);
    this.resized = false;
    this.heights = Array(this.getColumn()).fill(0);
    this.debounceId = 0;
    this.init();
  }
  getColumn() {
    const { responsive, defaultColumn } = this.opts;
    const windowWidth = window.innerWidth;
    if (!responsive.length) {
      return defaultColumn;
    }
    let nextIndex = 0;
    let columnResponsive = defaultColumn;
    responsive.forEach(({ breakpoint, column }, index) => {
      nextIndex = Math.min(index + 1, responsive.length);
      const nextBreakpoint = responsive[nextIndex] ? responsive[nextIndex].breakpoint : Infinity;
      if (breakpoint <= windowWidth && nextBreakpoint - 1 >= windowWidth) {
        columnResponsive = column;
      }
    });
    return columnResponsive;
  }
  getMinHeight() {
    return Math.min(...this.heights);
  }
  getMaxHeight() {
    return Math.max(...this.heights);
  }
  getIndexSelected() {
    return this.heights.findIndex(item => item === this.getMinHeight());
  }
  setItemStyles(columnElement) {
    const { gap } = this.opts;
    const column = this.getColumn();
    const indexSelected = this.getIndexSelected();
    columnElement.style.position = 'absolute';
    columnElement.style.width = `${100 / column}%`;
    columnElement.style.left = `${(100 / column) * indexSelected}%`;
    columnElement.style.top = `${this.getMinHeight()}px`;
    columnElement.style.padding = `${gap / 2}px`;
    if (this.resized) {
      columnElement.style.transition = 'all 0.4s ease';
    }
  }
  handleColumnElement(columnElement) {
    const indexSelected = this.getIndexSelected();
    this.setItemStyles(columnElement);
    this.heights[indexSelected] += columnElement.offsetHeight;
  }
  handleMasonryElement(el) {
    const { columnClassName, gap } = this.opts;
    const itemElements = Array.from(el.querySelectorAll(`.${columnClassName}`));
    itemElements.forEach(this.handleColumnElement.bind(this));
    el.style.position = 'relative';
    el.style.height = `${this.getMaxHeight()}px`;
    el.style.margin = `-${gap / 2}`;
    // debounce remove transition
    if (this.debounceId) {
      clearTimeout(this.debounceId);
    }
    this.debounceId = setTimeout(() => {
      itemElements.forEach(columnElement => {
        columnElement.style.removeProperty('transition');
      });
    }, 500);
  }
  handleWindowResize() {
    this.resized = true;
    this.update();
    this.emit('resize');
  }
  eventMount() {
    this.init();
  }
  init() {
    this.update();
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    this.emit('load');
  }
  update() {
    this.heights = Array(this.getColumn()).fill(0);
    this.els.forEach(this.handleMasonryElement.bind(this));
    this.emit('update');
  }
}
export function masonry(selector, options) {
  return new CoreMasonry(selector, options);
}
