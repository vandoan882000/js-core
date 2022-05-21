import { isMobile } from '../../utils/isMobile';

class VedaImageZoom {
  constructor(el) {
    this.el = el;
    this.imgEl = this.el.querySelector('img');
    this.zoom = this.el.getAttribute('data-image-zoom') || 3;
    this.imageZoomItemEl = this.createZoomItemEl();
    this.init();
  }

  createZoomItemEl() {
    const el = document.createElement('div');
    el.src = this.srcZoom;
    el.className = 'veda-image-zoom__zoom-item';
    this.el.appendChild(el);
    return el;
  }

  handleMouseMove(event) {
    const { offsetX, offsetY } = event;
    const { offsetWidth, offsetHeight } = event.currentTarget;
    const x = Math.min(Math.max((offsetX / offsetWidth) * 100, 0), 100) * (this.zoom - 1) * -1;
    const y = Math.min(Math.max((offsetY / offsetHeight) * 100, 0), 100) * (this.zoom - 1) * -1;
    const srcZoom = this.el.getAttribute('data-image-zoom-src') || this.imgEl.src;
    this.el.classList.add('veda-image-zoom--active');
    this.imageZoomItemEl.style.backgroundImage = `url('${srcZoom}')`;
    this.imageZoomItemEl.style.transform = `scale(${this.zoom})`;
    this.imageZoomItemEl.style.top = `${y}%`;
    this.imageZoomItemEl.style.left = `${x}%`;
  }

  handleMouseLeave() {
    this.el.classList.remove('veda-image-zoom--active');
  }

  init() {
    if (!isMobile.any) {
      this.el.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
  }
}

export function imageZoom(containerEl) {
  const els = containerEl.querySelectorAll('.veda-image-zoom');
  els.forEach(el => {
    new VedaImageZoom(el);
  });
}
