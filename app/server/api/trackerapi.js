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
  var SamplesModel = this.dbClient.Samples;

  return SamplesModel.findAll({attributes: {exclude: ['id']}})
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

function getSamples(id, samplesModel) {
  return samplesModel.findOne({
    attributes: {exclude: ['id']},
    where: makeSampleWhere(id)
  })
  .then(getSimpleInstance);
}

function getSampleEvents(sampleId, trackerEventsModel, submissionModel) {
 return trackerEventsModel.findAll({
    attributes: {exclude: ['id']},
    where: {$or: [
      {$and: [{stId: sampleId.stId}, {stId: {ne: null}}]},
      {$and: [{labId: sampleId.labId}, {labId: {ne: null}}]}
    ]},
    include: [{
      model: submissionModel,
      as: 'formSubmission',
      attributes: {exclude: ['submissionId', 'id', 'created_at', 'updated_at']}
    }]
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
  var SamplesModel = this.dbClient.Samples;
  var TrackerEventsModel = this.dbClient.TrackerEvents;
  var SubmissionsModel = this.dbClient.Submissions;

  return getSamples(id, SamplesModel)
  .then(function(sampleId) {
    if (sampleId) {
      log.debug('Retrieved sampleId', sampleId);
      return getSampleEvents(sampleId, TrackerEventsModel, SubmissionsModel);
    }
    log.info('Could not locate Id "' + id + '"');
    return [];
  })
  .error(function(err) {
    log.warn('Error fetching sample events for id ' + id, err, err.stack);
    return [];
  });
};

module.exports = SampleTracker;
