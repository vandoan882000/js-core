export function createRootElement(className) {
  const vedaCsrRoot = document.querySelector(`.${className}`);
  if (vedaCsrRoot) {
    return vedaCsrRoot;
  }
  const root = document.createElement('div');
  root.classList.add(className);
  document.body.appendChild(root);
  return root;
}
