class AnimateScroll {
  constructor() {
    this.observer = null;
    this.timeoutId = -1;
    this.init();
    this.checkForBuilder();
  }

  handler(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        const el = entry.target;
        const animateClasses = el.getAttribute("data-veda-animate");
        el.classList.add(...animateClasses.trim().split(" "));
      }
    });
  }

  checkForBuilder() {
    if (window.BUILDER) {
      window.addEventListener("message", (event) => {
        if (event?.data?.type === "@animate") {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.timeoutId = setTimeout(() => {
            this.init();
          }, 1000);
        }
      });
    }
  }

  init() {
    const els = document.querySelectorAll("[data-veda-animate]");
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    clearTimeout(this.timeoutId);
    this.observer = new IntersectionObserver(this.handler, options);
    els.forEach((el) => {
      const animateClasses = el.getAttribute("data-veda-animate");
      if (animateClasses.includes("animate__animated-scroll")) {
        this.observer.observe(el);
      } else {
        el.classList.add(...animateClasses.trim().split(" "));
      }
    });
  }
}

export function callAnimationScroll() {
  if (document.getElementById("_______veda-preview_______")) {
    const timeoutId = setTimeout(() => {
      new AnimateScroll();
      clearTimeout(timeoutId);
    }, 0);
  } else {
    new AnimateScroll();
  }
}
