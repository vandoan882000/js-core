class VedaCountdown {
  constructor(el) {
    this.el = el;
    this.deadline = Number(veda.utils.objectParse(el.getAttribute('data-options')).timestamp);
    this.daysEl = el.querySelector('.veda-countdown__days');
    this.hoursEl = el.querySelector('.veda-countdown__hours');
    this.minutesEl = el.querySelector('.veda-countdown__minutes');
    this.secondsEl = el.querySelector('.veda-countdown__seconds');
    this.intervalId = -1;
    this.oneSecond = 1000;
    this.mount();
    this.init();
  }

  mount() {
    this.daysEl.innerText = '';
    this.hoursEl.innerText = '';
    this.minutesEl.innerText = '';
    this.secondsEl.innerText = '';
  }

  getDays(distance) {
    return Math.floor(distance / (1000 * 60 * 60 * 24));
  }

  getHours(distance) {
    return Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  }

  getMinutes(distance) {
    return Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  }

  getSeconds(distance) {
    return Math.floor((distance % (1000 * 60)) / 1000);
  }

  handleCountdown() {
    const distance = this.deadline - Date.now();
    if (distance > 0) {
      const days = this.getDays(distance);
      const hours = this.getHours(distance);
      const minutes = this.getMinutes(distance);
      const seconds = this.getSeconds(distance);
      if (Number(this.daysEl.innerText) !== days) {
        this.daysEl.innerText = days;
      }
      if (Number(this.hoursEl.innerText) !== hours) {
        this.hoursEl.innerText = hours;
      }
      if (Number(this.minutesEl.innerText) !== minutes) {
        this.minutesEl.innerText = minutes;
      }
      if (Number(this.secondsEl.innerText) !== minutes) {
        this.secondsEl.innerText = seconds;
      }
    } else {
      clearInterval(this.intervalId);
    }
  }

  init() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.handleCountdown.bind(this), this.oneSecond);
  }
}

export function countdown(containerEl) {
  const els = containerEl.querySelectorAll('.veda-countdown');
  els.forEach(el => {
    new VedaCountdown(el);
  });
}
