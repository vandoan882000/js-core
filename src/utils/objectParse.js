export function objectParse(value) {
  const fn = new Function(`return ${value.trim()}`);
  return fn();
}
