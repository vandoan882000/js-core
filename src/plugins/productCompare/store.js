import { createPortal } from 'preact/compat';
import { renderWithElement } from '../../utils/csr';
import { VedaStore } from '../../utils/store';
import { PopUp } from './components/PopUp/popUp';
import { html } from "htm/preact";


const ACTION_TYPE = 'productCompare';
export const store = new VedaStore({
  logger: false,
});

let initialized = false;


store.create(ACTION_TYPE, {
  initialState: [],
  useStorage: true,
});

store.create("visibleCompare", {
  initialState: false,
});
export function getData() {
  return store.get(ACTION_TYPE);
}
export function getDataVisible() {
  return store.get("visibleCompare");
}
export function subscribe(listener) {
  return store.subscribe(ACTION_TYPE, listener);
}
export function subscribeVisible(listener) {
  return store.subscribe("visibleCompare", listener);
}

export function addToCompare(product) {
  store.set(ACTION_TYPE, items => {
    return [...items, product];
  });
}
export function removeFromCompare(product) {
  if( typeof product === 'string' ) {
    store.set(ACTION_TYPE, items => {
      return [...items.filter(item => item.id !== product)]
    });
  } else {
    store.set(ACTION_TYPE, items => {
      return [...items.filter(item => item.id !== product.id)]
    });
  }

}
export function toggleCompare(product) {
  const id = typeof product === "object" ? product.id : product;
  const hasProduct = store.get(ACTION_TYPE).some(item => item.id === id);
  if (hasProduct) {
    removeFromCompare(product);
  } else {
    addToCompare(product);
  }
}

export function togglePopup(props) {
  const { content } = props;
  const nextVisible = !getDataVisible();
  store.set("visibleCompare", nextVisible);
  if (!initialized) {
    renderWithElement(createPortal(html`<${PopUp} defaultProps=${props} visible=${nextVisible} />`, document.body), 'veda-product-compare-popup');
    initialized = true;
  }





}
