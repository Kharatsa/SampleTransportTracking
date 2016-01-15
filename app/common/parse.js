'use strict';

// via MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#A_stricter_parse_function
function filterInt(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
    return Number(value).valueOf();
  }
  return NaN;
}

// via MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat#A_stricter_parse_function
function filterFloat(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}

/**
 * Converts a String value to its underlying primitive type.
 *
 * @param  {string} text [description]
 * @return {number|boolean|string|Date|null|undefined}
 */
function parseText(text) {
  // undefined conversion
  if (typeof text === 'undefined' || text === 'undefined') {
    return undefined;
  }

  // null conversion
  if (text === null || text.toLowerCase() === 'null') {
    return null;
  }

  // Number (Integer) conversion
  var tmp = filterInt(text);
  if (!isNaN(tmp)) {
    return tmp;
  }

  tmp = filterFloat(text);
  if (!isNaN(tmp)) {
    return tmp;
  }

  tmp = Date.parse(text);
  if (!isNaN(tmp)) {
    return new Date(text);
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
  parseText,
  filterInt,
  filterFloat
};
