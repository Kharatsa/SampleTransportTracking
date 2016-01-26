'use strict';

const _ = require('lodash');

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
const firstText = (obj, propName) => {
  return obj[propName] ? obj[propName][0] : null;
};

/**
 * [oneMeta description]
 * @param  {Object} parentElem [description]
 * @param  {string} metaType   [description]
 * @param  {Array.<string|number>} keyPath    [description]
 * @param  {Array.<string|number>} descPath   [description]
 * @return {Object}            [description]
 */
function oneMeta(parentElem, metaType, keyPath, descPath) {
  const metaKey = _.get(parentElem, keyPath);

  if (metaKey) {
    return {
      type: metaType,
      key: metaKey,
      value: descPath ? _.get(parentElem, descPath) : null,
      valueType: 'string'
    };
  }
  return null;
}

module.exports = {
  firstText,
  oneMeta
};
