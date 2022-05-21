function getWindow(el) {
  return el.nodeType === 9 && el.defaultView;
}

export function offset(el) {
  const doc = el?.ownerDocument;
  const docElem = doc.documentElement;
  const win = getWindow(doc);
  let box = { top: 0, left: 0 };

  if (!doc) {
    return {
      top: 0,
      left: 0,
    };
  }

  if (typeof el.getBoundingClientRect !== typeof undefined) {
    box = el.getBoundingClientRect();
  }

  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft,
  };
}
