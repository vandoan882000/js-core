import { $$ } from '../../utils/VQuery';
import { objectParse } from '../../utils/objectParse';

class VedaCounter {
  static defaultOptions = {
    value: 0,
    min: 0,
    max: Infinity,
    step: 1,
    onChange: () => {},
  };

  constructor($$el, options) {
    this.$$vedaCounterIncrement = $$el.find('.veda-counter__increment');
    this.$$vedaCounterDecrement = $$el.find('.veda-counter__decrement');
    this.$$vedaCounterInput = $$el.find('.veda-counter__input');
    const { onChange, ...dataOpts } = objectParse($$el.attr('data-options') || '{}');
    this.opts = { ...VedaCounter.defaultOptions, ...options, ...dataOpts };
    this.$$vedaCounterInput.val(this.opts.value);
    this.$$vedaCounterInput.html(this.opts.value);
    this.state = {
      value: this.opts.value,
    };

    this.init();
  }

  handleIncrement = event => {
    event.preventDefault();
    const { onChange, step, max } = this.opts;
    const { value } = this.state;
    const newValue = Math.min(value + step, max);
    this.state.value = newValue;
    this.$$vedaCounterInput.val(newValue);
    this.$$vedaCounterInput.html(newValue);
    onChange(newValue);
  };

  handleDecrement = event => {
    event.preventDefault();
    const { onChange, step, min } = this.opts;
    const { value } = this.state;
    const newValue = Math.max(value - step, min);
    this.state.value = newValue;
    this.$$vedaCounterInput.val(newValue);
    this.$$vedaCounterInput.html(newValue);
    onChange(newValue);
  };

  handleChange = event => {
    const { onChange } = this.opts;
    const { value } = this.state;
    const newValue = Number(event.target.value.replace(/\D*/g, ''));
    this.state.value = newValue;
    onChange(newValue);
  };

  destroy() {
    this.$$vedaCounterIncrement.off('click', this.handleIncrement);
    this.$$vedaCounterDecrement.off('click', this.handleDecrement);
  }

  init() {
    this.$$vedaCounterIncrement.on('click', this.handleIncrement);
    this.$$vedaCounterDecrement.on('click', this.handleDecrement);
    this.$$vedaCounterInput.on('change', this.handleChange);
  }
}

export function counter(containerEl, options = {}) {
  const $$vedaCounter = $$(containerEl).find('.veda-counter');
  const destroyArr = [];
  $$vedaCounter.each($$el => {
    const vedaCounter = new VedaCounter($$el, options);
    destroyArr.push(vedaCounter.destroy.bind(vedaCounter));
  });

  const destroy = () => {
    destroyArr.forEach(fn => fn());
  };

  return destroy;
}
