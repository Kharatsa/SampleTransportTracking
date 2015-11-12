'use strict';

const util = require('util');
const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/log.js');

function SampleTracker(dbClient) {
  log.debug('Creating SampleTracker');
  this.dbClient = dbClient;
}

// Resources
//  Samples
//  Events

// Event endpoints
//  params:
//    * last location
//    * origin location
//    * created location
//    * created time
//    * updated time
//    * last status
//    * complete/incomplete/rejected
//  * Oldest incomplete (created time)
//  * Newest (created time)
//  * Rejected
// Samples
//  * All events

SampleTracker.prototype.allIds = function() {
  var SampleIdsModel = this.dbClient.SampleIds;

  return SampleIdsModel.findAll({attributes: {exclude: ['id']}})
  .catch(function(err) {
    log.warn('Error fetching all Ids', err, err.stack);
    return [];
  });
};

function makeSampleWhere(stId, labId) {
  return {$or: [
    {$and: [{stId: stId}, {stId: {ne: null}}]},
    {$and: [{labId: labId}, {labId: {ne: null}}]}
  ]}
}

function getSimpleInstance(sequelizeInstance) {
  return sequelizeInstance.get({simple: true});
}

function getSampleIds(id, sampleIdsModel) {
  return sampleIdsModel.findOne({
    attributes: {exclude: ['id']},
    where: makeSampleWhere(id)
  })
  .then(getSimpleInstance);
}

function getSampleEvents(sampleId, stEventsModel) {
 return stEventsModel.findAll({
    attributes: {exclude: ['id']},
    where: {$or: [
      {$and: [{sampleId: sampleId.stId}, {sampleId: {ne: null}}]},
      {$and: [{sampleId: sampleId.labId}, {sampleId: {ne: null}}]}
    ]}
  })
 .map(getSimpleInstance);
}

function reassembleFields(submissionData) {
  log.debug('Reassembling %d form data fields', submissionData.length);
  var result = {};
  return BPromise.each(submissionData, function(data) {
    if (data.fieldLabel) {
      result[data.fieldLabel] = data.fieldValue || null;
    }
  })
  .then(function() {
    return result;
  });
}

function getSubmissionData(stEvent, submissionDataModel) {
  return submissionDataModel.findAll({
    attributes: {exclude: ['id']},
    where: {instanceId: stEvent.instanceId}
  })
  .map(getSimpleInstance)
  .then(reassembleFields)
  .then(function(formFields) {
    return _.assign(stEvent, {'data': formFields});
  });
}

SampleTracker.prototype.allSampleEvents = function(id) {
  log.info('Fetching all sample events for Id "' + id + '"');
  var SampleIdsModel = this.dbClient.SampleIds;
  var STEventsModel = this.dbClient.STEvents;
  var SubmissionDataModel = this.dbClient.SubmissionData;

  return getSampleIds(id, SampleIdsModel)
  .then(function(sampleId) {
    if (sampleId) {
      log.debug('Retrieved sampleId', util.inspect(sampleId, {depth: 1}));
      return getSampleEvents(sampleId, STEventsModel);
    }
    log.info('Could not locate Id "' + id + '"');
    return [];
  })
  .map(function(stEvent) {
    log.debug('Retrieved event', util.inspect(stEvent, {depth: 1}));
    console.dir
    return getSubmissionData(stEvent, SubmissionDataModel);
  })
  .error(function(err) {
    log.warn('Error fetching sample events for id ' + id, err, err.stack);
    return [];
  });
};

module.exports = SampleTracker;
