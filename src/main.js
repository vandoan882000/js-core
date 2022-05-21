import { countdown } from './plugins/countDown/countDown';
import { imageZoom } from './plugins/imageZoom/imageZoom';
import { mobileMenu } from './plugins/mobileMenu/mobileMenu';
import { swiper } from './plugins/swiper/swiper';
import { tabs } from './plugins/tabs/tabs';
import { themeToggle } from './plugins/themeToggle/themeToggle';
import { message } from './plugins/message/message';
import { notification } from './plugins/notification/notification';
import { select } from './plugins/select/select';
import { slider } from './plugins/slider/slider';
import { callAnimationScroll } from './utils/animateScroll';
import { getColorNames } from './utils/getColorNames';
import { isMobile } from './utils/isMobile';
import { map } from './utils/map';
import { objectParse } from './utils/objectParse';
import { storage } from './utils/storage';
import { store } from './utils/store';
import * as csr from './utils/csr';
import { $$ } from './utils/VQuery';
import { offset } from './utils/offset';
import { delay } from './utils/delay';
import { createRootElement } from './utils/createRootElement';
import './main.scss';
import { debounce } from './utils/debounce';
import { queryString } from './utils/queryString';
import { counter } from './plugins/counter/counter';
import { collectionsFilters } from './plugins/collectionsFilters/collectionsFilters';
import { formatMoney } from './utils/formatMoney';
import { productCompare } from './plugins/productCompare/productCompare';

window.veda = window.veda || {};
window.veda.plugins = window.veda.plugins || {};
window.veda.utils = window.veda.utils || {};
window.veda.init = function () {
  callAnimationScroll();
  window.veda = {
    utils: {
      isMobile,
      objectParse,
      getColorNames,
      storage,
      store,
      map,
      csr,
      offset,
      VQuery: $$,
      delay,
      createRootElement,
      debounce,
      queryString,
      formatMoney,
    },
    plugins: {
      countdown,
      imageZoom,
      mobileMenu,
      swiper,
      tabs,
      themeToggle,
      message,
      notification,
      select,
      slider,
      counter,
      collectionsFilters,
      productCompare
    },
  };
};

window.veda.init();
