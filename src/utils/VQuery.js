import { offset } from './offset';

export class VQuery {
  constructor(selector, context = document) {
    this._els = VQuery.getElements(selector, context);
  }

  /**
   * @static
   * @param {HTMLElement | string} selector
   * @returns {HTMLElement[]}
   */
  static getElements(selector, context) {
    if (context instanceof VQuery) {
      context = context._els[0];
    }
    if (Array.isArray(context)) {
      return context.flatMap(el => VQuery.getElements(selector, el));
    }
    return typeof selector === 'string' ? Array.from(context.querySelectorAll(selector)) : [selector];
  }

  static getClasses(className) {
    return className.trim().replace(/\s+/g, ' ').split(' ');
  }

  /**
   *
   * @param {(value: HTMLElement, index: number, array: HTMLElement[]) => void} callback
   */
  _each = callback => {
    for (let i = 0; i < this._els.length; i++) {
      callback(this._els[i], i, this._els);
    }
  };

  attr = (qualifiedName, value) => {
    if (value !== undefined) {
      this._each(el => {
        el.setAttribute(qualifiedName, value);
      });
      return this;
    }
    return this._els[0].getAttribute(qualifiedName);
  };

  removeAttr = qualifiedName => {
    this._each(el => {
      el.removeAttribute(qualifiedName);
    });
    return this;
  };

  css = styles => {
    this._each(el => {
      Object.entries(styles).forEach(([key, val]) => {
        el.style[key] = val;
      });
    });
    return this;
  };

  removeCss = property => {
    this._each(el => {
      el.style.removeProperty(property);
    });
    return this;
  };

  hasClass = className => {
    return this._els.some(el => Array.from(el.classList).includes(className));
  };

  getClass = () => {
    return Array.from(this._els[0].classList);
  };

  addClass = className => {
    const classes = VQuery.getClasses(className);
    this._each(el => {
      el.classList.add(...classes);
    });
    return this;
  };

  toggleClass = className => {
    const classes = VQuery.getClasses(className);
    this._each(el => {
      el.classList.toggle(...classes);
    });
    return this;
  };

  removeClass = className => {
    const classes = VQuery.getClasses(className);
    this._each(el => {
      el.classList.remove(...classes);
    });
    return this;
  };

  html(value) {
    if (value !== undefined) {
      this._each(el => {
        el.innerHTML = value;
      });
      return this;
    }
    return this._els[0].innerHTML;
  }

  text(value) {
    if (value !== undefined) {
      this._each(el => {
        el.innerText = value;
      });
      return this;
    }
    return this._els[0].innerText;
  }

  on = (...args) => {
    this._each(el => {
      el.addEventListener(...args);
    });
    return this;
  };

  off = (...args) => {
    this._each(el => {
      el.removeEventListener(...args);
    });
    return this;
  };

  val(value) {
    if (value !== undefined) {
      this._each(el => {
        el.value = value;
      });
      return this;
    }
    return this._els[0].value;
  }

  width(value) {
    if (value !== undefined) {
      this._each(el => {
        el.width = typeof value === 'string' ? value : `${value}px`;
      });
      return this;
    }
    return this._els[0].offsetWidth;
  }

  height(value) {
    if (value !== undefined) {
      this._each(el => {
        el.height = typeof value === 'string' ? value : `${value}px`;
      });
      return this;
    }
    return this._els[0].offsetHeight;
  }

  getBoundingClientRect() {
    return this._els[0].getBoundingClientRect();
  }

  offset() {
    return offset(this._els[0]);
  }

  insert(where, element) {
    this._each(el => {
      if (typeof element === 'string') {
        el.insertAdjacentHTML(where, element);
      } else {
        el.insertAdjacentElement(where, element);
      }
    });
    return this;
  }

  append(node) {
    this._each(el => {
      el.appendChild(node);
    });
    return this;
  }

  next() {
    return new VQuery(this._els[0].nextElementSibling);
  }

  prev() {
    return new VQuery(this._els[0].previousElementSibling);
  }

  parent() {
    return new VQuery(this._els[0].parentNode);
  }

  children(index) {
    if (index !== undefined) {
      return new VQuery(this._els[0].children[index]);
    }
    return new VQuery(this._els[0].children);
  }

  childNodes() {
    return this._els[0].childNodes;
  }

  before(...nodes) {
    return new VQuery(this._els[0].before(...nodes));
  }

  after(...nodes) {
    return new VQuery(this._els[0].after(...nodes));
  }

  closest(selector) {
    return new VQuery(this._els[0].closest(selector));
  }

  find(selector) {
    return new VQuery(selector, this._els);
  }

  each(callback) {
    for (let i = 0; i < this._els.length; i++) {
      callback(new VQuery(this._els[i]), i, this._els);
    }
    return this;
  }

  contains(selector) {
    return this._els.some(el => el.contains(selector));
  }

  getElements() {
    return this._els;
  }

  getElement() {
    return this._els[0];
  }
}

export function $$(selector, context) {
  return new VQuery(selector, context);
}
