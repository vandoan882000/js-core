function parse(queryString, isObject = false) {
  const result = isObject ? {} : [];
  const params = new URLSearchParams(queryString);
  for (let pair of params.entries()) {
    if (isObject) {
      result[pair[0]] = pair[1];
    } else {
      result.push([pair[0], pair[1]]);
    }
  }
  return result;
}

function stringify(obj) {
  const params = new URLSearchParams(obj);
  return params
    .toString()
    .replace(/&/g, '&\n')
    .replace(/\w.*=&?$/gm, '')
    .replace(/\n+/g, '')
    .replace(/&$/g, '');
}

export const queryString = {
  parse,
  stringify,
};
