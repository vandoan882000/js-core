export function debounce(fn, timeout = 300) {
  let timeoutId = -1;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
}
