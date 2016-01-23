'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');

/**
 * Nest the object beneath new object wrappers. When combined with other wrapped
 * objects, these results allow for easy lookups for objects by their property
 * values.
 *
 * @param  {Object} source  The source object
 * @param  {Array.<string>} propNames Property names whose values will wrap
 *                                    the source object
 * @return {Object}
 */
function wrapObjOwnProps(source, propNames) {
  let result = source;
  for (let i = (propNames.length - 1); i > -1; i--) {
    let wrapper = {};
    let value = source[propNames[i]];
    wrapper[value] = result;
    result = wrapper;
  }
  return result;
}

/**
 * Build a single, reduced object from the Array of input objects. This
 * reduced object will be arranged with keys extracted from the properties
 * specified in propNames.
 *
 * @param  {Array.<Object>} items
 * @param  {Array.<string>} propNames
 * @return {Promise.<Object>}
 */
function propKeyReduce(items, propNames) {
  return BPromise.map(items, item => wrapObjOwnProps(item, propNames))
  .then(wrapped => _.merge.apply(null, [{}].concat(wrapped)));
}

/**
 * @typedef {MergedData}
 * @property {Object} incoming [description]
 * @property {Object|null} local [description]
 */

/**
 *
 * @param  {Object} target    [description]
 * @param  {Object} reduced   [description]
 * @param  {Array.<string>} propNames [description]
 * @return {MergedData}           [description]
 */
function pairOne(target, reduced, propNames) {
  const lookupKeys = propNames.map(name => target[name]);
  const local = _.get(reduced, lookupKeys, null);
  return {incoming: target, local};
}

/**
 * [pairReduced description]
 *
 * @param  {Array.<Object>} incoming     [description]
 * @param  {Object} localReduced [description]
 * @param  {Array.<string>} propNames    [description]
 * @return {Promise.<Array.<MergedData>>}
 */
function pairReduced(sources, localReduced, propNames) {
  return BPromise.map(sources, item => pairOne(item, localReduced, propNames));
}

/**
 * Merge serves to pair individual objects together from 2 separate collections
 * of objects (sources and targets). The objective is to match objects in the
 * sources collection to corresponding objects in the targets collection.
 *
 * This pairing is accomplished by reducing the targets collection into a lookup
 * object, arranged with "keys" consisting of the value of each property from
 * propNames.
 *
 * In effect, the source objects are matched to target objects with the values
 * of the properties specified in propNames, and only the properties in
 * propNames.
 *
 * @param  {Array.<Object>} sources [description]
 * @param  {Array.<Object>} targets [description]
 * @param {Array.<string>} propNames [description]
 * @return {Promise.<Array.<MergedData>>}          [description]
 */
function pairByProps(sources, targets, propNames) {
  if (!(Array.isArray(sources) && Array.isArray(targets))) {
    return BPromise.reject(new Error('Cannot merge Array with non-Array'));
  }
  if (!(propNames && propNames.length)) {
    return BPromise.reject(new Error('Missing required parameter propNames'));
  }

  return BPromise.join(
    sources, propKeyReduce(targets, propNames), propNames,
    pairReduced
  );
}

module.exports = {
  pairByProps,
  propKeyReduce
};
