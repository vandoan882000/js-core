import { objectParse } from '../../utils/objectParse';
import { Component, createPortal, html, render } from '../../utils/csr';
import { $$ } from '../../utils/VQuery';

class VedaSelect {
  static defaultOptions = {
    onChange: () => {},
  };

  constructor(options) {
    this.options = { ...VedaSelect.defaultOptions, ...options };
    this.el = this.options.el;
    this.init();
  }

  handleOptionClick(event) {
    const { onChange } = this.options;
    const $$current = $$(event.currentTarget);
    const label = $$current.text();
    const value = $$current.attr('value');
    const $$select = $$current.closest('.veda-select');
    $$select.find('.veda-select__label').text(label);
    onChange(value);
  }

  handleViewClick(event) {
    const $$select = $$(event.currentTarget).closest('.veda-select');
    if ($$select.hasClass('veda-select--opened')) {
      $$select.removeClass('veda-select--opened');
    } else {
      $$('.veda-select', this.el).removeClass('veda-select--opened');
      $$select.addClass('veda-select--opened');
    }
  }

  handleWindowClick(event) {
    if (!$$('.veda-select__view', this.el).contains(event.target)) {
      $$(this.el).removeClass('veda-select--opened');
    }
  }

  init() {
    const { value } = this.options;
    const $$selected = $$('.veda-select__option[selected]', this.el);
    if (value) {
      $$selected.removeAttr('selected');
      const $$selected2 = $$(`.veda-select__option[value="${value}"]`, this.el);
      $$selected2.attr('selected', 'selected');
      const label = $$selected2.text();
      $$('.veda-select__label', this.el).text(label);
    } else if ($$selected.getElements().length) {
      const label = $$selected.text();
      $$('.veda-select__label', this.el).text(label);
    } else {
      const $$option = $$('.veda-select__option', this.el);
      $$('.veda-select__option', this.el).getElements()[0].setAttribute('selected', 'selected');
      const label = $$option.text();
      $$('.veda-select__label', this.el).text(label);
    }
    $$('.veda-select__option', this.el).on('click', this.handleOptionClick.bind(this));
    $$('.veda-select__view', this.el).on('click', this.handleViewClick.bind(this));
    $$(window).on('click', this.handleWindowClick.bind(this));
  }

  destroy() {
    $$('.veda-select__option', this.el).off('click', this.handleOptionClick.bind(this));
    $$('.veda-select__view', this.el).off('click', this.handleViewClick.bind(this));
    $$(window).off('click', this.handleWindowClick.bind(this));
    $$('.veda-select__label', this.el).text('');
  }

  reset() {
    const $$selected = $$('.veda-select__option[selected]', this.el);
    $$selected.removeAttr('selected');
    const $$current = $$('.veda-select__option', this.el);
    const label = $$current.text();
    const $$select = $$current.closest('.veda-select');
    $$select.find('.veda-select__label').text(label);
  }
}

export function select(options) {
  const vedaSelect = new VedaSelect(options);
  return {
    destroy: vedaSelect.destroy.bind(vedaSelect),
    reset: vedaSelect.reset.bind(vedaSelect),
  };
}
