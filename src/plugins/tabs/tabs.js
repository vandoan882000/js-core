class VedaTabs {
  constructor(el) {
    this.el = el;
    this.linkEls = Array.from(el.querySelectorAll('.veda-tabs__link'));
    this.paneEls = Array.from(el.querySelectorAll('.veda-tabs__pane'));
    this.index = this.linkEls.findIndex(el => el.className.includes('veda-tabs__link--active')) || 0;
    this.init();
  }

  handlePanel() {
    this.paneEls.forEach(paneEl => {
      paneEl?.classList.remove('veda-tabs__pane--active');
    });
    this.paneEls[this.index]?.classList.add('veda-tabs__pane--active');
  }

  handleTabLink(linkEl, index) {
    linkEl.addEventListener('click', event => {
      event.preventDefault();
      this.index = index;
      this.linkEls.forEach(linkEl => {
        linkEl?.classList.remove('veda-tabs__link--active');
      });
      event.currentTarget?.classList.add('veda-tabs__link--active');
      this.handlePanel();
    });
  }

  init() {
    this.handlePanel();
    this.linkEls.forEach(this.handleTabLink.bind(this));
  }
}

export function tabs(containerEl) {
  const tabEls = containerEl.querySelectorAll('.veda-tabs');
  tabEls.forEach(tabEl => {
    new VedaTabs(tabEl);
  });
}
