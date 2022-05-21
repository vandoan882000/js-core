import { debounce } from '../../utils/debounce';
import { queryString } from '../../utils/queryString';
import { select } from '../select/select';
import { slider } from '../slider/slider';
import { VedaStore } from '../../utils/store';
import { Component, html, render } from '../../utils/csr';

const store = new VedaStore({
  logger: false,
});
const STATE_NAME = '$refineState';

export function collectionsFilters(container, options) {
  store.create(STATE_NAME, {
    initialState: [],
  });

  const defaultOptions = {
    priceStep: 1,
    renderRefineItem: () => {},
    renderClearAllButton: () => {},
    onChangePrice: () => {},
  };
  const {
    priceStep,
    refineRootSelector,
    formSelector,
    clearAllRootSelector,
    sortBySelector,
    renderRefineItem,
    renderClearAllButton,
    onChange,
    onChangePrice,
  } = Object.assign({}, defaultOptions, options);

  const formElement = document.querySelector(formSelector);
  const sortByElement = container.querySelector(sortBySelector);
  const refineRootElement = container.querySelector(refineRootSelector);
  const clearAllRootElement = container.querySelector(clearAllRootSelector);

  if (!formElement) {
    throw new Error('You need to pass a `formSelector` to the collectionsFilters plugin');
  }
  if (!sortByElement) {
    throw new Error('You need to pass a `sortBySelector` to the collectionsFilters plugin');
  }
  if (!refineRootElement) {
    throw new Error('You need to pass a `refineRootSelector` to the collectionsFilters plugin');
  }
  if (!clearAllRootElement) {
    throw new Error('You need to pass a `clearAllRootSelector` to the collectionsFilters plugin');
  }
  const formEl = formElement;
  const sortByEl = sortByElement;
  const inputEls = Array.from(formEl.querySelectorAll('input'));
  const sortByName = 'sort_by';
  const minName = 'filter.v.price.gte';
  const maxName = 'filter.v.price.lte';
  const categoryName = 'filter.v.category';
  const minPriceEl = container.querySelector(`[name='${minName}']`);
  const maxPriceEl = container.querySelector(`[name='${maxName}']`);
  let params = queryString.parse(window.location.search);
  const paramsObj = queryString.parse(window.location.search, true);
  let sortByValue = paramsObj[sortByName] || '';
  const range = createRange();
  const selectInstance = createSelect();
  init();

  function getParamsKeys() {
    return params.map(([key]) => key);
  }

  function getMoney(label, value) {
    return label.replace(/[\d.,]+/g, value);
  }

  function changePrice(min, max) {
    if (minPriceEl && maxPriceEl) {
      onChangePrice({
        min: getMoney(minPriceEl.getAttribute('data-label'), min),
        max: getMoney(maxPriceEl.getAttribute('data-label'), max),
      });
    }
  }

  /**
   *
   * @returns {FormData}
   */
  function getFormData() {
    const formData = new FormData(formEl);
    formData.set(sortByName, sortByValue);
    if (formData.get(minName) === minPriceEl?.min && formData.get(maxName) === maxPriceEl?.max) {
      formData.delete(minName);
      formData.delete(maxName);
    }
    return formData;
  }

  function handleSliderChange(value) {
    if (minPriceEl && maxPriceEl) {
      minPriceEl.value = value[0];
      maxPriceEl.value = value[1];
      changePrice(value[0], value[1]);
    }
  }

  function pushToRefineState(label, name, value) {
    store.set(STATE_NAME, state => [
      ...state,
      {
        label: /filter\.v\.price\.[gl]te/g.test(name) ? getMoney(label, value) : label,
        name,
        value,
      },
    ]);
  }

  function setRefineState() {
    const formData = getFormData();
    store.set(STATE_NAME, state => {
      return Array.from(formData).reduce((arr, [name, value]) => {
        const inputEl = container.querySelector(`[name='${name}']`);
        if (inputEl) {
          const label = inputEl.getAttribute('data-label');
          if (/checkbox|radio/g.test(inputEl.type)) {
            const inputEl = container.querySelector(`[name='${name}'][value='${value}']`);
            const label = inputEl.getAttribute('data-label');
            if (value === inputEl.value) {
              return [...arr, { label, name, value }];
            }
          }
          if (/filter\.v\.price\.[gl]te/g.test(name)) {
            return [...arr, { label: getMoney(label, value), name, value }];
          }
          return [...arr, { label, name, value }];
        }
        return arr;
      }, []);
    });
  }

  function setParams(name, value) {
    if (getParamsKeys().includes(name)) {
      params = params.reduce((arr, [key, val]) => {
        return [...arr, key === name ? [name, value] : [key, val]];
      }, []);
    } else {
      params.push([name, value]);
    }
  }

  function handleSliderChanged(value) {
    const [minValue, maxValue] = value;
    setParams(minName, minValue);
    setParams(maxName, maxValue);
    handleRequest();
  }

  function createRange() {
    if (minPriceEl && maxPriceEl) {
      const range = slider({
        el: container.querySelector('.petify-price-range'),
        value: [paramsObj[minName] || minPriceEl.min, paramsObj[maxName] || maxPriceEl.max],
        range: true,
        step: priceStep,
        onChange: handleSliderChange,
        onChanged: handleSliderChanged,
      });
      changePrice(paramsObj[minName] || minPriceEl.min, paramsObj[maxName] || maxPriceEl.max);
      return range;
    }
  }

  function selectChange(value) {
    sortByValue = value;
    if (sortByName) {
      const name = sortByName;
      setParams(name, value);
      const selectViewEl = container.querySelector('.veda-select__label');
      setRefineState();
      handleRequest();
    }
  }

  function createSelect() {
    if (sortByEl) {
      return select({
        el: sortByEl,
        value: paramsObj[sortByName],
        onChange: selectChange,
      });
    }
  }

  function handleInput(event) {
    const { name, value, type } = event.target;
    const label = event.target.getAttribute('data-label');
    const formData = getFormData();
    if (/filter\.v\.price\.[gl]te/g.test(name)) {
      const minValue = formData.get(minName) || minPriceEl.min;
      const maxValue = formData.get(maxName) || maxPriceEl.max;
      range.setValue([minValue, maxValue]);
      changePrice(minValue, maxValue);
    }
    handleRequest();
  }

  function setDefaultFieldsFromParams() {
    params.forEach(([name, value]) => {
      const inputEl = container.querySelector(`[name='${name}']`);
      if (inputEl) {
        const label = inputEl.getAttribute('data-label');
        if (name === inputEl.name) {
          if (/checkbox|radio/g.test(inputEl.type)) {
            const inputEl = container.querySelector(`[name='${name}'][value='${value}']`);
            const label = inputEl.getAttribute('data-label');
            if (value === inputEl.value) {
              pushToRefineState(label, name, value);
              inputEl.setAttribute('checked', 'checked');
            }
          } else {
            pushToRefineState(label, name, value);
            inputEl.value = value;
          }
        }
      }
    });
  }

  function handleRequest(reset = false) {
    const formData = getFormData();
    const search = queryString.stringify(formData);
    const url = new URL(window.location.href.replace(window.location.seach, ''));
    url.search = reset ? '' : search;
    function done() {
      window.history.pushState(null, null, url.href);
      params = queryString.parse(window.location.search);
      setRefineState();
    }
    if (!!onChange) {
      const formDataForChange = getFormData();
      const category = formDataForChange.get(categoryName);
      formDataForChange.delete(categoryName);
      const urlForChange = new URL(window.location.href.replace(window.location.seach, ''));
      const search = queryString.stringify(formDataForChange);
      urlForChange.search = reset ? '' : search;
      onChange({ url: urlForChange, category, done });
    } else {
      done();
    }
  }

  function removeItem({ label, name, value }) {
    store.set(STATE_NAME, state => {
      return state
        .filter(item => {
          return !(item.name === name && item.value === value && item.label === label);
        })
        .filter(item => {
          return !(item.name === maxName || item.name === minName);
        });
    });
    const inputEl = container.querySelector(`[name='${name}']`);
    if (inputEl) {
      if (/checkbox|radio/g.test(inputEl.type)) {
        const inputEl = container.querySelector(`[name='${name}'][value='${value}']`);
        inputEl.removeAttribute('checked');
        inputEl.checked = false;
      }
      if (/filter\.v\.price\.[gl]te/g.test(name) && minPriceEl && maxPriceEl) {
        minPriceEl.value = minPriceEl.min;
        maxPriceEl.value = maxPriceEl.max;
        range.setValue([minPriceEl.min, maxPriceEl.max]);
        changePrice(minPriceEl.min, maxPriceEl.max);
      }
    }
    handleRequest();
  }

  function removeAll(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (selectInstance) {
      selectInstance.reset();
    }
    store.set(STATE_NAME, state => {
      return [];
    });
    const inputEls = container.querySelectorAll('input');
    inputEls.forEach(inputEl => {
      inputEl.removeAttribute('checked');
      inputEl.checked = false;
    });
    if (minPriceEl && maxPriceEl) {
      minPriceEl.value = minPriceEl.min;
      maxPriceEl.value = maxPriceEl.max;
      range.setValue([minPriceEl.min, maxPriceEl.max]);
      changePrice(minPriceEl.min, maxPriceEl.max);
    }
    handleRequest(true);
  }

  function init() {
    formEl.addEventListener('submit', event => {
      event.preventDefault();
    });
    setDefaultFieldsFromParams();
    window.addEventListener('popstate', event => {
      event.preventDefault();
      window.location.reload();
    });
    inputEls.forEach(inputEl => {
      const regexp = /text|number|email|phone/g;
      const delay = regexp.test(inputEl.type) ? 400 : 0;
      inputEl.addEventListener('input', debounce(handleInput, delay));
    });
  }

  class Refine extends Component {
    constructor(props) {
      super(props);
      this.state = {
        refineState: store.get(STATE_NAME) || [],
      };
    }

    componentDidMount() {
      store.subscribe(STATE_NAME, state => {
        this.setState({
          refineState: state,
        });
      });
    }

    handleRemove(item) {
      return function () {
        removeItem(item);
      };
    }

    renderItem(item) {
      const { refineState } = this.state;
      if (item.name === minName) {
        return html``;
      }
      const minLabel = refineState.find(item => item.name === minName)?.label;
      return renderRefineItem({
        item:
          item.name === maxName && minLabel
            ? {
                ...item,
                label: `${minLabel} - ${item.label}`,
              }
            : item,
        onRemove: this.handleRemove(item),
      });
    }

    render() {
      const { refineState } = this.state;
      return refineState.map(this.renderItem.bind(this));
    }
  }

  class ClearAll extends Component {
    constructor(props) {
      super(props);
      this.state = {
        refineState: store.get(STATE_NAME) || [],
      };
    }

    componentDidMount() {
      store.subscribe(STATE_NAME, state => {
        this.setState({
          refineState: state,
        });
      });
    }

    render() {
      const { refineState } = this.state;
      if (refineState.length > 0) {
        return renderClearAllButton({ onClear: removeAll });
      }
      return html``;
    }
  }

  render(html`<${Refine} />`, refineRootElement);
  render(html`<${ClearAll} />`, clearAllRootElement);
}
