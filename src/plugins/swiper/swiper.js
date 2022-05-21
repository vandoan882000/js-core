import { objectParse } from '../../utils/objectParse';

class VedaSwiper {
  constructor(containerEl) {
    this.els = containerEl.querySelectorAll('.veda-swiper');
    this.init();
  }

  handleSwiper(el) {
    const defaultOptions = {
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev'),
      },
      spaceBetween: 30,
    };
    const options = objectParse(el.getAttribute('data-options'));
    const swiper = new Swiper(el.querySelector('.swiper'), { ...defaultOptions, ...options });
    swiper.update();
    this.handleThumbSwiper(el.nextElementSibling, swiper);
  }

  handleThumbSwiper(thumbEl, swiper) {
    if (thumbEl?.className === 'veda-swiper-thumbnails') {
      const options = objectParse(thumbEl.getAttribute('data-options'));
      const defaultOptions = {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 5,
        touchRatio: 0.3,
        slideToClickedSlide: true,
        pagination: {
          el: thumbEl.querySelector('.swiper-pagination'),
        },
        navigation: {
          nextEl: thumbEl.querySelector('.swiper-button-next'),
          prevEl: thumbEl.querySelector('.swiper-button-prev'),
        },
      };
      var thumbSwiper = new Swiper(thumbEl.querySelector('.swiper'), {
        ...defaultOptions,
        ...options,
      });
      swiper.controller.control = thumbSwiper;
      thumbSwiper.controller.control = swiper;
    }
  }

  init() {
    this.els.forEach(this.handleSwiper.bind(this));
  }
}

export function swiper(containerEl) {
  new VedaSwiper(containerEl);
}
