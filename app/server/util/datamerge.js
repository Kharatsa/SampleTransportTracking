'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const dbresult = require('server/storage/dbresult.js');

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
const wrapObjOwnProps = (source, propNames) => {
  let result = source;
  const lastPropIndex = propNames.length - 1;
  for (let i = lastPropIndex; i > -1; i--) {
    let wrapper = {};
    let value = source[propNames[i]];
    if (value) {
      // don't wrap in falsy values (e.g., null, undefined)
      wrapper[value] = result;
      result = wrapper;
    }
  }
  return result;
};

const setWithPath = (target, path, val) => {
  let key = null;
  let nestedParent = null;
  let nested = target;
  const lastIndex = path.length - 1;

  for (let i = 0; i < path.length; i++) {
    key = path[i];
    if (typeof nested[key] === 'undefined' && i < lastIndex) {
      nested[key] = {};
    } else if (typeof nested[key] === 'undefined') {
      nested[key] = [];
    }
    nestedParent = nested;
    nested = nested[key];
  }

  nestedParent[key].push(val);
  return target;
};

const getKeyPath = (item, numProps) => {
  let nested = item;
  let path = [];
  for (let i = 0; i < numProps; i++) {
    const key = Object.keys(nested)[0];
    nested = nested[key];
    path.push(key);
  }
  return path;
};

const mergeOneItem = (reduced, item, numProps) => {
  const path = getKeyPath(item, numProps);
  const value = _.get(item, path);
  return setWithPath(reduced, path, value);
};

const mergeMany = (items, propNames) => {
  const numProps = propNames.length;
  return BPromise.reduce(items, (reduced, item) => {
    return mergeOneItem(reduced, item, numProps);
  }, {});
};

const mergeWrapped = (items, propNames, many) => {
  if (many) {
    return mergeMany(items, propNames);
  }
  const source = [{}].concat(items);
  return BPromise.resolve(_.merge.apply(null, source));
};

/**
 * Build a single, reduced object from the Array of input objects. This
 * reduced object will be arranged with keys extracted from the properties
 * specified in propNames.
 *
 * When "many" is true, the Objects nested beneath propNames values will be
 * contained in an Array. When "many" is false (the default), a single Object
 * is nested beneath the specified propNames values.
 *
 * Examples:
 *   let example = [{a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}, {a: 2, b: 2, c: 4}]
 *
 *   propKeyReduce(example, ['a'])
 *   // {'1': {a: 1, b: 2, c: 4}, '2': {a: 2, b: 2, c: 4}
 *
 *   propKeyReduce(example, ['a'], true)
 *   // {
 *   //   '1': [{a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}],
 *   //   '2': [{a: 2, b: 2, c: 4}]
 *   // }
 *
 *   propKeyReduce(example, ['a', 'c'])
 *   // {
 *   //   '1': {
 *   //      '3': {a: 1, b: 2, c: 3},
 *   //      '4': {a: 1, b: 2, c: 4}
 *   //   },
 *   //   '2': {'4': {a: 2, b: 2, c: 4}}
 *   // }
 *
 * @param  {Array.<Object>} items
 * @param  {Array.<string>} propNames
 * @param {boolean} [many=false]
 * @return {Promise.<Object>}
 */
const propKeyReduce = (options) => {
  options = options || {};
  const items = options.items;
  const propNames = options.propNames;
  const many = options.many || false;
  return BPromise.map(items, item => wrapObjOwnProps(item, propNames, many))
  .then(wrapped => mergeWrapped(wrapped, propNames, many));
};

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
const pairOne = (target, reduced, propNames) => {
  const lookupKeys = propNames.map(name => target[name]);
  const local = _.get(reduced, lookupKeys, null);
  return {incoming: target, local};
};

/**
 * [pairReduced description]
 *
 * @param  {Array.<Object>} incoming     [description]
 * @param  {Object} localReduced [description]
 * @param  {Array.<string>} propNames    [description]
 * @return {Promise.<Array.<MergedData>>}
 */
const pairReduced = (sources, localReduced, propNames) => {
  return BPromise.map(sources, item => pairOne(item, localReduced, propNames));
};

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
const pairByProps = (sources, targets, propNames) => {
  if (targets === null) {
    return BPromise.resolve({incoming: sources, targets: []});
  } else if (!(Array.isArray(sources) && Array.isArray(targets))) {
    return BPromise.reject(new Error('Cannot merge Array with non-Array'));
  }

  if (!(propNames && propNames.length)) {
    return BPromise.reject(new Error('Missing required parameter propNames'));
  }

  return BPromise.join(
    sources, propKeyReduce({items: targets, propNames}), propNames,
    pairReduced
  );
};

/**
 * Returns a collection of Objects from merged that should be updated in the
 * database. In these cases, there is a value present in the local property of
 * the merged object, but the values props do not match the value props in the
 * merged incoming object.
 *
 * @param  {Array.<MergedData>} merged
 * @param  {Array.<string>} [compareProps]
 * @return {Promise.<Array.<MergedData>>}
 */
const updates = (merged, compareProps) => {
  // A local object that requires update must be present
  return BPromise.filter(merged, item => !!item.local)
  .filter(item => {
    try {
      if (typeof compareProps === 'undefined') {
        return !dbresult.commonPropsEqual(item.incoming, item.local);
      }
      return !dbresult.enumeratedPropsEqual(
        item.incoming, item.local, compareProps
      );
    } catch (e) {
      return BPromise.reject(e);
    }
  });
};

/**
 * Returns a collection of Objects from merged that should be inserted in the
 * database, given that the paired/merged local parameter is falsy. The absense
 * of a value in the local property indicates that the object in incoming has
 * no version already present in the local database.
 *
 * @param  {Array.<MergedData>} merged [description]
 * @return {Promise.<Array.<Object>>}        [description]
 */
const inserts = merged => {
  return BPromise.filter(merged, item => !item.local)
  .map(item => item.incoming);
};

/**
 * [description]
 * @param  {Array.<MergedData>} merged [description]
 * @return {Promise.<Array.<Object>>}        [description]
 */
const skips = merged => {
  return BPromise.filter(merged, item => !!item.local)
  .filter(item => dbresult.commonPropsEqual(item.incoming, item.local))
  .map(item => item.local);
};

module.exports = {
  pairByProps,
  propKeyReduce,
  updates,
  inserts,
  skips
};
