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
  if (sequelizeInstance) {
    return sequelizeInstance.get({simple: true});
  }
  return {};
}

function getSampleIds(id, sampleIdsModel) {
  return sampleIdsModel.findOne({
    attributes: {exclude: ['id']},
    where: makeSampleWhere(id)
  })
  .then(getSimpleInstance);
}

function getSampleEvents(sampleId, trackerEventsModel) {
 return trackerEventsModel.findAll({
    attributes: {exclude: ['id']},
    where: {$or: [
      {$and: [{stId: sampleId.stId}, {stId: {ne: null}}]},
      {$and: [{labId: sampleId.labId}, {labId: {ne: null}}]}
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
  var TrackerEventsModel = this.dbClient.TrackerEvents;
  var SubmissionDataModel = this.dbClient.SubmissionData;

  return getSampleIds(id, SampleIdsModel)
  .then(function(sampleId) {
    if (sampleId) {
      log.debug('Retrieved sampleId', sampleId);
      return getSampleEvents(sampleId, TrackerEventsModel);
    }
    log.info('Could not locate Id "' + id + '"');
    return [];
  })
  .map(function(stEvent) {
    log.debug('Retrieved event', stEvent);
    return getSubmissionData(stEvent, SubmissionDataModel);
  })
  .error(function(err) {
    log.warn('Error fetching sample events for id ' + id, err, err.stack);
    return [];
  });
};

module.exports = SampleTracker;
