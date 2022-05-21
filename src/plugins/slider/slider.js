import { debounce } from '../../utils/debounce';
import { objectParse } from '../../utils/objectParse';
import { offset } from '../../utils/offset';

class VedaSlider {
  static defaultOptions = {
    value: [0, 200],
    range: false,
    min: 0,
    max: 300,
    step: 1,
    onChange: () => {},
    onChanged: () => {},
  };

  constructor(el, options) {
    this.el = el;
    this.thumb1El = this.el.querySelector('.veda-slider__thumb[data-index="0"]');
    this.thumb2El = this.el.querySelector('.veda-slider__thumb[data-index="1"]');
    this.trackedEl = this.el.querySelector('.veda-slider__tracked');
    this.opts = {
      ...VedaSlider.defaultOptions,
      ...options,
    };
    this.step = this.getValue(this.opts.step);
    const { value } = this.opts;
    const [value0, value1] = typeof value === 'number' ? [value, 0] : value;
    this.state = {
      value0: this.getValue(value0 - this.opts.min),
      value1: this.getValue(value1 - this.opts.min),
      activeValue: 'value0',
      isDragging: false,
    };

    this.init();
  }

  setState(state) {
    this.state = {
      ...this.state,
      ...state,
    };
    this.update();
  }

  getValue(value) {
    const { max, min } = this.opts;
    const realMax = max - min;
    const elWidth = this.el.offsetWidth;
    return (elWidth * value) / realMax;
  }

  getValueForResult(value) {
    const { max, min } = this.opts;
    const elWidth = this.el.offsetWidth;
    return (((max - min) * value) / elWidth + min).toFixed(2);
  }

  getValueInRange(value) {
    return Math.min(Math.max(value, 0), this.el.offsetWidth);
  }

  domDataBinding() {
    const { range } = this.opts;
    const { value0, value1 } = this.state;
    const val1 = range ? value1 : 0;
    const thumb1Width = this.thumb1El.offsetWidth;
    this.thumb1El.style.left = `-${thumb1Width / 2}px`;
    this.thumb1El.style.transform = `translate(${value0}px, -50%)`;
    if (range && this.thumb2El) {
      this.thumb2El.style.left = `-${thumb1Width / 2}px`;
      this.thumb2El.style.transform = `translate(${val1}px, -50%)`;
    }
    this.trackedEl.style.transform = `translateX(${Math.min(value0, val1)}px)`;
    this.trackedEl.style.width = `${Math.abs(value0 - val1)}px`;
  }

  getIndex(event) {
    if (event.target.classList.contains('veda-slider__thumb')) {
      return Number(event.target.getAttribute('data-index'));
    }
    return 0;
  }

  getResult() {
    const { range } = this.opts;
    const { value0, value1 } = this.state;
    const val0 = this.getValueForResult(value0);
    const val1 = this.getValueForResult(value1);
    const min = Math.min(val0, val1);
    const max = Math.max(val0, val1);
    if (range) {
      return [min, max];
    }
    return val0;
  }

  handleDragStart = event => {
    if (this.el.contains(event.target)) {
      const index = this.getIndex(event);
      this.setState({
        isDragging: true,
        activeValue: index === 0 ? 'value0' : 'value1',
      });
    }
  };

  handleDragging = event => {
    const { pageX } = event.touches ? event.touches[0] : event;
    const { onChange } = this.opts;
    const { isDragging, activeValue } = this.state;
    if (isDragging) {
      const value = pageX - offset(this.el).left;
      const valueStep = Math.round(value / this.step) * this.step;
      const valueInRange = this.getValueInRange(valueStep);
      this.setState({
        [activeValue]: valueInRange,
      });
      onChange(this.getResult());
    }
  };

  handleDragEnd = () => {
    const { onChanged } = this.opts;
    const { isDragging } = this.state;
    if (isDragging) {
      onChanged(this.getResult());
    }
    this.setState({
      isDragging: false,
    });
  };

  handleDrag() {
    window.addEventListener('mousedown', this.handleDragStart);
    window.addEventListener('touchstart', this.handleDragStart);
    window.addEventListener('mousemove', this.handleDragging);
    window.addEventListener('touchmove', this.handleDragging);
    window.addEventListener('mouseup', this.handleDragEnd);
    window.addEventListener('touchend', this.handleDragEnd);
  }

  destroy() {
    const { range } = this.opts;
    window.removeEventListener('mousedown', this.handleDragStart);
    window.removeEventListener('touchstart', this.handleDragStart);
    window.removeEventListener('mousemove', this.handleDragging);
    window.removeEventListener('touchmove', this.handleDragging);
    window.removeEventListener('mouseup', this.handleDragEnd);
    window.removeEventListener('touchend', this.handleDragEnd);
    this.thumb1El.style.removeProperty('left');
    this.thumb1El.style.removeProperty('transform');
    if (range && this.thumb2El) {
      this.thumb2El.style.removeProperty('left');
      this.thumb2El.style.removeProperty('transform');
    }
    this.trackedEl.style.removeProperty('transform');
    this.trackedEl.style.removeProperty('width');
  }

  setValue(value) {
    const { range } = this.opts;
    const [value0, value1] = typeof value === 'number' ? [value, 0] : value;
    this.setState({
      value0: this.getValue(value0 - this.opts.min),
      value1: this.getValue(value1 - this.opts.min),
    });
    this.domDataBinding();
  }

  update() {
    this.domDataBinding();
  }

  init() {
    if (!this.opts.range && this.thumb2El) {
      this.thumb2El.remove();
    }
    if (!this.thumb1El) {
      throw new Error(
        'You need add a `<div class="veda-slider__thumb" data-index="0"></div>` element inside the `<div class="veda-slider"></div>` element.',
      );
    }
    this.domDataBinding();
    this.handleDrag();
  }
}

export function slider(options = {}) {
  const { onChange, onChanged, ...dataOpts } = objectParse(options.el.getAttribute('data-options') || '{}');
  let slider = new VedaSlider(options.el, {
    ...options,
    ...dataOpts,
  });

  const handleResize = () => {
    slider.destroy();
    slider = new VedaSlider(options.el, {
      ...options,
      ...dataOpts,
    });
  };

  window.addEventListener('resize', debounce(handleResize, 300));

  return {
    destroy: slider.destroy.bind(slider),
    setValue: slider.setValue.bind(slider),
  };
}
