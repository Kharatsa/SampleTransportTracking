'use strict';

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

function getSimpleInstance(sequelizeInstance) {
  if (sequelizeInstance) {
    return sequelizeInstance.get({simple: true});
  }
  return {};
}

/*
 * One Submission includes many TrackerEvents. This function combines the
 * Submission data into each of the its TrackerEvent objects.
 */
function submissionEventCombine(stEvent) {
  var submissionAttribs = Object.keys(
    getSimpleInstance(stEvent.formSubmission)
  );

  return BPromise.each(submissionAttribs, function(key) {
    stEvent[key] = stEvent.formSubmission[key];
  })
  .then(function() {
    return _.omit(stEvent, 'formSubmission');
  });
}

const DEFAULT_PAGE_LIMIT = 5;
const ST_EVENTS_FIELDS_EXCLUDE = [
  'submissionId', 'id', 'created_at', 'updated_at'
];

SampleTracker.prototype.listEvents = function(_maxId) {
  var maxId = _maxId || null;
  // If maxId is provided, find records where ids <= maxId
  var pageWhere = maxId === null ? {} : {id: {lte: maxId}};

  var TrackerEventsModel = this.dbClient.TrackerEvents;
  var SubmissionsModel = this.dbClient.Submissions;

  return TrackerEventsModel.findAll({
    limit: DEFAULT_PAGE_LIMIT,
    where: pageWhere,
    include: [{
      model: SubmissionsModel,
      as: 'formSubmission',
      attributes: {exclude: ST_EVENTS_FIELDS_EXCLUDE}
    }],
    order: [
      [
        {model: SubmissionsModel, as: 'formSubmission'},
        'completed_date',
        'DESC'
      ],
      ['submission_num', 'DESC']
    ]
  })
  .map(getSimpleInstance)
  .map(submissionEventCombine);
};

SampleTracker.prototype.listSampleIds = function() {
  var SamplesModel = this.dbClient.Samples;

  return SamplesModel.findAll({
    // attributes: {exclude: ['id']}
  })
  .catch(function(err) {
    log.warn('Error fetching all Ids', err, err.stack);
    return [];
  });
};

function makeSampleWhere(stId, labId) {
  return {$or: [
    {$and: [{stId: stId}, {stId: {ne: null}}]},
    {$and: [{labId: labId}, {labId: {ne: null}}]}
  ]};
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
      attributes: {exclude: ST_EVENTS_FIELDS_EXCLUDE}
    }]
  })
  .map(getSimpleInstance)
  .map(submissionEventCombine);
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
