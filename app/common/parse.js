'use strict';

// via MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#A_stricter_parse_function
function filterInt(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
    return Number(value).valueOf();
  }
  return NaN;
}

/**
 * Converts a String value to its underlying primitive type.
 *
 * @param  {String} text [description]
 * @return {Number|Boolean|String|null|undefined}
 */
function parseText(text) {
  // TODO: maybe support floats

  var tmp;
  // undefined conversion
  if (typeof text === 'undefined' || text === 'undefined') {
    return undefined;
  }

  // null conversion
  if (text === null) {
    return null;
  }
  tmp = text.toLowerCase();
  if (tmp === 'null') {
    return null;
  }

  // Number (Integer) conversion
  tmp = filterInt(text);
  if (!isNaN(tmp)) {
    return tmp;
  }

  // Boolean conversion
  tmp = text.toLowerCase();
  if (tmp === 'true') {
    return true;
  }
  if (tmp === 'false') {
    return false;
  }

  return text;
}

module.exports = {
  parseText: parseText,
  filterInt: filterInt
};
