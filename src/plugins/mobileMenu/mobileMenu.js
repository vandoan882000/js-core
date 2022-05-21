export function mobileMenu(
  containerEl,
  {
    width = 300,
    duration = 200,
    navSelector = '.veda-nav',
    menuSelector = '.veda-nav__menu',
    linkSelector = '.veda-nav__link',
    subMenuSelector = '.veda-nav__sub-list',
    backClassName = 'veda-nav__list-item-back',
    closeClassName = 'veda-nav__list-item-close',
    hamburgerButtonPosition = 'afterbegin',
    renderHamburgerButton = className => `<div class="${className} veda-hamburger-menu-icon"><i class="fal fa-bars"></i></div>`,
    renderBackButton = className => `<div class="${className} veda-nav-back-button"><i class="far fa-arrow-left"></i></div>`,
    renderCloseButton = className => `<div class="${className} veda-nav-close-button"><i class="fal fa-times"></i></div>`,
  },
) {
  /** @type {HTMLElement} */
  const navEl = containerEl.querySelector(navSelector);
  /** @type {HTMLUListElement} */
  const menuEl = navEl.querySelector(menuSelector);
  /** @type {NodeListOf<HTMLLIElement>} */
  const anchorEls = menuEl.querySelectorAll(linkSelector);
  /** @type {NodeListOf<HTMLLIElement>} */
  const submenuEls = menuEl.querySelectorAll(subMenuSelector);
  const hamburgerClassName = 'veda-nav__hamburger';
  const closeBtnClassName = 'veda-nav__close';
  const hamburgerButtonHtml = renderHamburgerButton(hamburgerClassName);
  const closeButtonHtml = renderCloseButton(closeBtnClassName);
  const initialized = false;
  let isActive = false;
  const navMobileClassName = 'veda-nav--mobile';
  const boxShadow = '10px 0 30px 0 rgba(0, 0, 0, 0.1)';
  const transition = `transform ${duration}ms, box-shadow ${duration}ms`;

  function handleNavigation() {
    navEl.insertAdjacentHTML(hamburgerButtonPosition, hamburgerButtonHtml);
  }

  function handleMenu() {
    menuEl.style.width = `${width}px`;
    menuEl.style.left = `-${width}px`;
    menuEl.style.transition = transition;
    const liEl = document.createElement('li');
    liEl.style.textAlign = 'right';
    liEl.className = closeClassName;
    liEl.insertAdjacentHTML('afterbegin', closeButtonHtml);
    menuEl.insertAdjacentElement('afterbegin', liEl);
    const closeButtonEl = menuEl.querySelector(`.${closeBtnClassName}`);
    closeButtonEl.addEventListener('click', toggleMenu);
  }

  function toggleMenu() {
    isActive = !isActive;
    menuEl.style.transform = isActive ? 'translateX(100%)' : 'translateX(0)';
    menuEl.style.boxShadow = isActive ? boxShadow : 'none';
  }

  function handleHamburgerButton() {
    const hamburgerBtnEl = navEl.querySelector(`.${hamburgerClassName}`);
    hamburgerBtnEl.addEventListener('click', toggleMenu);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  function handleAnchorElClick(event) {
    /** @type {HTMLAnchorElement}  */
    const currentAnchorEl = event.currentTarget;
    const submenuEl = currentAnchorEl.nextElementSibling;
    if (!!submenuEl) {
      event.preventDefault();
      submenuEls.forEach(submenuEl => {
        submenuEl.style.overflowY = 'hidden';
        submenuEl.scrollTo({ top: 0 });
      });
      menuEl.style.overflowY = 'hidden';
      menuEl.scrollTo({ top: 0 });
      submenuEl.style.transform = 'translateX(100%)';
      submenuEl.style.overflowY = 'auto';
      submenuEl.style.boxShadow = boxShadow;
    }
  }

  /**
   *
   * @param {MouseEvent} event
   */
  function handleBackButtonClick(event) {
    event.preventDefault();
    /** @type {HTMLElement}  */
    const currentBackButtonEl = event.currentTarget;
    const submenuEl = currentBackButtonEl.parentNode.parentNode;
    const submenuParentEl = currentBackButtonEl.parentNode.parentNode.parentNode.parentNode;
    submenuEl.style.transform = 'translateX(0)';
    submenuEl.style.overflowY = 'hidden';
    submenuEl.style.boxShadow = 'none';
    submenuEl.scrollTo({ top: 0 });
    submenuParentEl.style.overflowY = 'auto';
  }

  /**
   *
   * @param {HTMLAnchorElement} anchorEl
   */
  function handleAnchorEl(anchorEl) {
    anchorEl.addEventListener('click', handleAnchorElClick);
    const submenuEl = anchorEl.nextElementSibling;
    const listEl = document.createElement('li');
    listEl.className = `${backClassName} veda-nav__list-item-back`;
    const backButtonHtml = renderBackButton('veda-nav__back');
    listEl.innerHTML = backButtonHtml;
    if (!!submenuEl) {
      submenuEl.style.left = `-${width}px`;
      submenuEl.style.transition = transition;
      submenuEl.insertAdjacentElement('afterbegin', listEl);
      const backButtonEl = submenuEl.children[0].children[0];
      backButtonEl.addEventListener('click', handleBackButtonClick);
    }
  }

  function handleClickOutside() {
    window.addEventListener('click', event => {
      const hamburgerBtnEl = navEl.querySelector(`.${hamburgerClassName}`);
      if (!menuEl.contains(event.target) && !hamburgerBtnEl.contains(event.target)) {
        if (isActive) {
          toggleMenu();
        }
      }
    });
  }

  function removeProperty(el) {
    el.style.removeProperty('width');
    el.style.removeProperty('left');
    el.style.removeProperty('transform');
    el.style.removeProperty('transition');
    el.style.removeProperty('overflow-y');
    el.style.removeProperty('boxShadow');
  }

  function handleDestroy() {
    const liBackEls = menuEl.querySelectorAll('.veda-nav__list-item-back');
    const hamburgerBtnEl = navEl.querySelector(`.${hamburgerClassName}`);
    const closeBtnEl = menuEl.querySelector(`.${closeBtnClassName}`);
    if (hamburgerBtnEl) {
      hamburgerBtnEl.removeEventListener('click', toggleMenu);
      hamburgerBtnEl.remove();
    }
    navEl.classList.remove(navMobileClassName);
    for (let i = 0; i < anchorEls.length; i++) {
      if (anchorEls[i]) {
        anchorEls[i].removeEventListener('click', handleAnchorElClick);
      }
    }
    for (let i = 0; i < liBackEls.length; i++) {
      if (liBackEls[i]) {
        liBackEls[i].remove();
      }
    }
    if (closeBtnEl) {
      closeBtnEl.parentNode.remove();
    }
    removeProperty(menuEl);
    submenuEls.forEach(submenuEl => {
      removeProperty(submenuEl);
    });

    this.initialized = false;
  }

  function init() {
    if (!this.initialized && !!navEl) {
      navEl.classList.add(navMobileClassName);
      anchorEls.forEach(handleAnchorEl);
      handleNavigation();
      handleMenu();
      handleHamburgerButton();
      handleClickOutside();
      this.initialized = true;
    }
  }

  return {
    destroy: handleDestroy,
    init,
  };
}
