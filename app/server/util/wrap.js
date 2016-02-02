'use strict';

/**
 * [description]
 * @param  {Object} obj [description]
 * @param  {Function} wrapper   [description]
 * @param  {Array.<string>} methods   [description]
 */
const classMethods = (obj, wrapFunc, methods) => {
  for (let method of methods) {
    const original = obj[method].bind(obj);
    if (typeof original === 'function') {
      obj[method] = wrapFunc(original);
    } else {
      throw new Error(`Method "${method}" is not a function`);
    }
  }
};

/**
 * [description]
 * @param  {Object} obj      [description]
 * @param  {Function} wrapFunc [description]
 */
const allClassMethods = (obj, wrapFunc) => {
  let methodNames = [];
  for (let name in obj) {
    if (typeof obj[name] === 'function') {
      methodNames.push(name);
    }
  }
  classMethods(obj, wrapFunc, methodNames);
};

module.exports = {
  classMethods,
  allClassMethods
};
