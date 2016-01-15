'use strict';

/**
 * The xml2js XML parser always adds text nodes in an array. Given an object
 * and a property name, this simply returns the first element for the property's
 * Array value, if the property exists and the property contains an Array.
 * Otherwise, this function returns null.
 *
 * @param  {Object} obj   [description]
 * @param  {string} propName [description]
 * @return {string|null}          [description]
 */
function firstText(obj, propName) {
  return obj[propName] ? obj[propName][0] : null;
}

module.exports = {
  firstText
};
