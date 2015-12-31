'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/log.js');

/** @module publiser/publishmerge */

/**
 * Mostly mimics the Sequelize Instance equals method, except this function
 * ignores the database-specific `id` column. This function compares a
 * Sequelize instance (fetched from the local database) to a published Object
 * of the same type.
 *
 * http://docs.sequelizejs.com/en/latest/api/instance/#equalsother-boolean
 *
 * @param  {Sequelize.Model} local
 * @param  {Object} target A plain Object
 * @return {boolean}
 */
function areCommonPropsEqual(local, target) {
  return Object.keys(_.omit(target, 'id')).every(key => {
    if (!local[key]) {
      return false;
    }
    // For Date objects, compare the valueOf to ensure identical values
    // evaluate to true for the equals check.
    return (
      (_.isDate(target[key]) ? target[key].getTime() : target[key]) ===
      (_.isDate(local[key]) ? local[key].getTime() : local[key])
    );
  });
}

/**
 * The PublishMerged objects contains insert, update, and skip buckets, based
 * on the local database state. All the data in these buckets is composed of
 * {@link PublishTransformed} data. The transformed data is all unaltered, with
 * the exception of the data in the update bucket, which includes an additional
 * `id` parameter.
 *
 * @typedef {PublishMerged}
 * @property {Array} insert - Objects that require an insert
 * @property {Array} update - Objects that require an update. These
 * @property {Array} skip - Objects already in the local database
 */

/**
 * Partitions the published samples Objects into buckets for
 * `insert`, `update`, and `skip` (no insert or update needed).
 *
 * @param  {Array.<Sample>} local - [description]
 * @param  {Array.<Sample>} samples - [description]
 * @return {PublishMerged}
 */
function mergeAllSamples(local, samples) {
  var localBySampleId = {};
  var localByLabId = {};

  local.forEach(sample => {
    if (sample.labId) {
      localByLabId[sample.labId] = sample;
    }
    if (sample.stId) {
      localBySampleId[sample.stId] = sample;
    }
  });

  var sampleBySampleId = {};
  return BPromise.reduce(
    samples,
    (result, sample) => {
      return sampleMergeReducer(
        result, localBySampleId, localByLabId, sampleBySampleId, sample
      );
    },
    {insert: [], update: [], skip: []}
  );
}

/**
 * Supplements the target object with the id key for use in an update statement.
 *
 * @param  {number|string} localId [description]
 * @param  {Submission|Facility|Person} target  [description]
 * @return {Submission|Facility|Person}
 */
function addIdForUpdate(local, target) {
  return Object.assign(target, {id: local.id});
}

/**
 * [sampleMergeReducer description]
 *
 * @param  {PublishMerged} result - The merged and partitioned samples
 * @param  {Object} localBySampleId - Local samples matching published samples
 *                                  keyed on sample track Ids
 * @param  {Object} localByLabId - Local samples matching published samples
 *                               keyed on lab Ids
 * @param {Object} sampleBySampleId - Published sample objects keyed on stId.
 *                                  This object prevents the same stIds from
 *                                  being queued for insert/update 2x.
 * @param  {Sample} sample - One sample object
 * @return {PublishMerged}
 */
function sampleMergeReducer(result, localBySampleId, localByLabId,
                            sampleBySampleId, sample) {
  var stId = sample.stId;
  var labId = sample.labId;

  if (stId && !localBySampleId[stId] && !sampleBySampleId[stId]) {
    // Sample record requires an insert
    log.info('NEW sample stId=' + stId);
    result.insert.push(sample);
    // Only add a unique sampleId 1x
    sampleBySampleId[stId] = sample;
  } else if (labId && localBySampleId[stId] && !localBySampleId[labId]) {
    // Sample record requires an update
    log.info('NEW LINK sample ' + stId + ' (stId) <--> ' + labId + ' (labId)');
    result.update.push(addIdForUpdate(localBySampleId[stId], sample));
  } if (sampleBySampleId[stId]) {
    log.debug('SKIP for DUPLICATE sample stId=' + stId + ', labId=' + labId);
    result.skip.push(sample);
  } else {
    // Sample record exists in the local database
    log.debug('SKIP for sample stId=' + stId + ', labId=' + labId);
    result.skip.push(sample);
  }

  return result;
}

function mergeSubmission(local, submission) {
  var merged = {insert: [], update: [], skip: []};
  var submissionId = submission.submissionId;

  if (!local || Object.keys(local).length === 0) {
    log.info('NEW submission submissionId=' + submissionId);
    merged.insert.push(submission);
  } else if (!areCommonPropsEqual(local, submission)) {
    log.info('UPDATE submission submissionId=' + submissionId);
    merged.update.push(addIdForUpdate(local, submission));
  } else {
    log.debug('SKIP for submission submissionId=' + submissionId);
    merged.skip.push(submission);
  }

  return merged;
}

function mergeMetadata(local, metadata) {
  var merged = {insert: [], update: [], skip: []};
  var metaId = metadata.name;

  if (_.isEmpty(local)) {
    log.info('NEW metadata Id=' + metaId);
    merged.insert.push(metadata);
  } else if (!areCommonPropsEqual(local, metadata)) {
    log.info('UPDATE metadata Id=' + metaId);
    merged.update.push(addIdForUpdate(local, metadata));
  } else {
    log.debug('SKIP for metadata Id=' + metaId);
    merged.skip.push(metadata);
  }

  return merged;
}

/**
 * [mergeAllUpdates description]
 *
 * @param  {Array.<Update>} local   [description]
 * @param  {Array.<Update>} updates [description]
 * @return {PublishMerged}
 */
function mergeAllUpdates(local, updates) {
  var localBySubmissionId = {};
  log.debug('local updates');

  // Rearrange the array of Update objects into an Object keyed on submissionId
  // then submissionNumber for easier lookup and comparison.
  local.forEach(update => {
    var subId = update.submissionId;
    if (!localBySubmissionId[subId]) {
      log.debug('Adding subId=' + subId + ' to localBySubmissionId');
      localBySubmissionId[subId] = {};
    }
    var subNum = update.submissionNumber;
    log.debug('Adding subNum=' + subNum + ' to localBySubmissionId');
    localBySubmissionId[subId][subNum] = update;
  });
  log.debug('localBySubmissionId =', localBySubmissionId);

  return BPromise.reduce(
    updates,
    (result, update) => {
      return updateMergeReducer(result, localBySubmissionId, update);
    },
    {insert: [], update: [], skip: []}
  );
}

/**
 * [updateMergeReducer description]
 *
 * @param  {PublishMerged} result
 * @param  {Object} localBySubmissionId - Local updates matching published
 *                                      updates, keyed on submissionId.
 * @param  {Update} update - One update object
 * @return {PublishMerged}
 */
function updateMergeReducer(result, localBySubmissionId, update) {
  var subId = update.submissionId;
  var subNum = update.submissionNumber;

  log.debug('localBySubmissionId', localBySubmissionId);

  // TODO: handle update?
  if (localBySubmissionId[subId] && localBySubmissionId[subId][subNum]) {
    // Update record exists in the local database
    log.debug('SKIP for update submissionId=' + subId + ', subNum=' + subNum);
    result.skip.push(update);
  } else {
    log.info('NEW update submissionId=' + subId + ', subNum=' + subNum);
    result.insert.push(update);
  }

  return result;
}

/**
 *
 * @param {Array.<Object>} local - [description]
 * @param {Array.<PublishTransformed>} published - [description]
 * @return {Array.<Object.<string, PublishMerged>>}
 */
function merge(locals, published) {
  log.debug('Merging local and published data');
  return BPromise.map(published, (data, index) => {
    log.debug('Merging submission %d of %d', index + 1, published.length);
    var local = locals[index];
    return BPromise.props({
      samples: mergeAllSamples(local.samples, data.samples),
      submission: mergeSubmission(local.submission, data.submission),
      facility: mergeMetadata(local.facility, data.facility),
      person: mergeMetadata(local.person, data.person),
      updates: mergeAllUpdates(local.updates, data.updates)
    });
  });
}

module.exports = {
  merge
};
