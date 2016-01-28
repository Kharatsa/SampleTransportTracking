'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const dbresult = require('app/server/storage/dbresult.js');

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
  for (let i = (propNames.length - 1); i > -1; i--) {
    let wrapper = {};
    let value = source[propNames[i]];
    wrapper[value] = result;
    result = wrapper;
  }
  return result;
};

/**
 * Build a single, reduced object from the Array of input objects. This
 * reduced object will be arranged with keys extracted from the properties
 * specified in propNames.
 *
 * @param  {Array.<Object>} items
 * @param  {Array.<string>} propNames
 * @return {Promise.<Object>}
 */
const propKeyReduce = (items, propNames) => {
  return BPromise.map(items, item => wrapObjOwnProps(item, propNames))
  .then(wrapped => _.merge.apply(null, [{}].concat(wrapped)));
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
    console.log(`null pairByProps targets`);
    console.dir(targets, {depth: 10});
    BPromise.resolve({incoming: sources, targets: []});
  } else if (!(Array.isArray(sources) && Array.isArray(targets))) {
    console.log('sources');
    console.dir(sources, {depth: 10});
    console.log('targets');
    console.dir(targets, {depth: 10});
    return BPromise.reject(new Error('Cannot merge Array with non-Array'));
  }

  if (!(propNames && propNames.length)) {
    return BPromise.reject(new Error('Missing required parameter propNames'));
  }

  return BPromise.join(
    sources, propKeyReduce(targets, propNames), propNames,
    pairReduced
  );
};

/**
 * Returns a collection of Objects from merged that should be updated in the
 * database. In these cases, there is a value present in the local property of
 * the merged object, but the values props do not match the value props in the
 * merged incoming object.
 *
 * @param  {Array.<MergedData>} merged [description]
 * @return {Promise.<Array.<MergedData>>}        [description]
 */
const updates = merged => {
  return BPromise.filter(merged, item => !!item.local)
  .filter(item => !dbresult.commonPropsEqual(item.incoming, item.local));
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
