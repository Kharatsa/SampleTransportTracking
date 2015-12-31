'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/log.js');
const clientutils = require('app/server/storage/clientutils.js');

/** @module stt/sttclient */

/**
 * Creates a new Sample Transport Tracking client.
 * @class
 *
 * @param {!Object} options [description]
 * @param {!Database} options.db [description]
 * @param {!Object} options.models [description]
 * @param {!Sequelize.Model} options.models.Samples [description]
 * @param {!Sequelize.Model} options.models.Submissions [description]
 * @param {!Sequelize.Model} options.models.Facilities [description]
 * @param {!Sequelize.Model} options.models.People [description]
 * @param {!Sequelize.Model} options.models.Updates [description]
 */
function STTClient(options) {
  log.debug('Creating STTClient');

  if (!options.db) {
    throw new Error('Database is a required parameter');
  }
  this.db = options.db;

  if (!options.models.Samples) {
    throw new Error('Samples model is a required parameter');
  }
  if (!options.models.Submissions) {
    throw new Error('Submissions model is a required parameter');
  }
  if (!options.models.Facilities) {
    throw new Error('Facilities model is a required parameter');
  }
  if (!options.models.People) {
    throw new Error('People model is a required parameter');
  }
  if (!options.models.Updates) {
    throw new Error('Updates model is a required parameter');
  }
  this.models = options.models || {};
}

/**
 * [prepareSamplesWhere description]
 *
 * @param  {SampleIds} sampleIds [description]
 * @return {Object}           [description]
 */
function prepareSamplesWhere(sampleIds) {
  var stIds = sampleIds.stId.length ? sampleIds.stId : [];
  var labIds = sampleIds.labId.length ? sampleIds.labId : [];
  var anyIds = sampleIds.anyId.length ? sampleIds.anyId : [];

  // Include `anyId` values in `stId` and `labId` statements
  stIds = stIds.concat(anyIds);
  labIds = labIds.concat(anyIds);
  var orStatement = [];
  if (stIds.length !== 0) {
    orStatement.push({stId: {in: stIds}});
  }
  if (labIds.length !== 0) {
    orStatement.push({labId: {in: labIds}});
  }

  return {$or: orStatement};
}

/**
 * An Object containing a submission Id and submission number
 * @typedef {Object} SampleIds
 * @property {Array.<string>} stId  A sample Sample Tracking Id
 * @property {Array.<string>} labId A sample lab Id
 * @property {Array.<string>} anyId An Id value that may be a Sample Id or Lab Id
 */

/**
 * [getSamples description]
 *
 * @method
 * @param {Object} options
 * @param {SampleIds} options.sampleIds A sam
 * @param {boolean} [options.simple=true] When simple is true, the method
 *                                        returns plain objects. Otherwise,
 *                                        Sequelize Instance objects are
 *                                        returned.
 * @return {Promise.<Array.<Sample|Sequelize.Instance>>} {@link Sample} objects
 *                                                              matching the ids
 * @throws {Error} If [!sampleIds.stId.length && !sampleIds.labId.length &&
 *                     !sampleIds.anyId.length]
 */
STTClient.prototype.getSamples = BPromise.method(function(options) {
  var SamplesModel = this.models.Samples;

  options = _.defaultsDeep(options || {}, {
    sampleIds: {stId: [], labId: [], anyId: []},
    simple: true
  });
  var sampleIds = options.sampleIds;
  log.debug('getSamples with sampleIds', sampleIds);

  if (sampleIds.stId.length === 0 &&
      sampleIds.labId.length === 0 &&
      sampleIds.anyId.length === 0) {
    throw new Error('Requires one or both of stId, labId, or anyId');
  }

  var samplesWhere = prepareSamplesWhere(sampleIds);

  return SamplesModel.findAll({
    where: samplesWhere
  })
  .then(results => {
    if (options.simple) {
      return results.map(clientutils.getSimpleInstance);
    }
    return results;
  });
});

/**
 * Equivalent to getSubmissions({
 *   sampleIds: {
 *     stId: options.stId,
 *     labId: options.labId,
 *     anyId: options.anyId
 * }})[0]
 *
 * @param {Object} options [description]
 * @param {string} [options.stId] - The sample tracking Id
 * @param {string} [options.labId] - The lab Id
 * @param {string} [options.anyId] - The sample or lab Id
 * @param {boolean} [options.simple=true] [description]
 * @return {Sample|Sequelize.Instance}         [description]
 * @throws {Error} If [!options.stId && !options.labId && !options.anyId]
 */
STTClient.prototype.getSample = function(options) {
  return this.getSamples({
    sampleIds: {
      stId: options.stId ? [options.stId] : [],
      labId: options.labId ? [options.labId] : [],
      anyId: options.anyId ? [options.anyId] : []
    },
    simple: options.simple
  })
  .then(clientutils.getOneResult);
};

/**
 * [_saveSamples description]
 *
 * @param  {Array.<Sample>} samples [description]
 * @param  {Sequelize.Transaction} tran    [description]
 * @return {Promise.<Array.<Sequelize.Instance>>}
 */
STTClient.prototype.saveSamples = function(samples, tran) {
  log.info('CREATING ' + samples.length + ' samples\n\t' + samples);
  return clientutils.saveBulk(this.models.Samples, samples, tran);
};

/**
 * [updateSamples description]
 *
 * @param  {Array.<Sample>} samples [description]
 * @param  {Sequelize.Transaction} tran    [description]
 * @return {Promise.<Array.<affectedCount, affectedRows>>}
 */
STTClient.prototype.updateSamples = function(samples, tran) {
  // var SamplesModel = this.models.Samples;

  log.info('UPDATING ' + samples.length + ' samples\n\t', samples);
  return clientutils.updateBulk(this.models.Samples, samples, tran);
  // return BPromise.map(samples, sample => {
  //   return SamplesModel.update(sample, {
  //     where: {id: sample.id},
  //     transaction: tran
  //   });
  // });
};

/**
 * [getSubmissions description]
 *
 * @method
 * @param {Object} options
 * @param {Array.<string>}  options.submissionIds - Form submission Ids
 * @param {Array} [options.order=[['completed_date', 'DESC']]]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Array.<Submission|Sequelize.Instance>>}
 * @throws {Error} If [!options.submissionIds.length]
 */
STTClient.prototype.getSubmissions = BPromise.method(function(options) {
  var SubmissionsModel = this.models.Submissions;

  options = _.defaultsDeep(options || {}, {
    submissionIds: [],
    // Return results by default sorted by completed_date in descending order
    order: [['completed_date', 'DESC']],
    simple: true
  });
  log.debug('getSubmissions with submissionIds', options.submissionIds);

  var submissionsWhere;
  if (options.submissionIds && options.submissionIds.length) {
    submissionsWhere = {submissionId: {in: options.submissionIds}};
  } else {
    throw new Error('Requires at least 1 submission Id');
  }

  return SubmissionsModel.findAll({
    where: submissionsWhere,
    order: options.order
  })
  .then(results => {
    if (options.simple) {
      return results.map(clientutils.getSimpleInstance);
    }
    return results;
  });
});

/**
 * Equivalent to getSubmissions({submissionIds: options.submissionId})[0]
 *
 * @param {Object} options [description]
 * @param  {string} options.submissionId
 * @param  {string|Array}   [options.order=[['completed_date', 'DESC']]]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Submission|Sequelize.Instance>}
 */
STTClient.prototype.getSubmission = function(options) {
  return this.getSubmissions({
    submissionIds: options.submissionId ? [options.submissionId] : [],
    order: options.order,
    simple: options.simple
  })
  .then(clientutils.getOneResult);
};

/**
 * [saveSubmission description]
 *
 * @param  {Array.<Submission>} submissions - [description]
 * @param  {Sequelize.Transaction} tran - [description]
 * @return {Promise.<Array.<Sequelize.Instance>>}
 */
STTClient.prototype.saveSubmission = function(submissions, tran) {
  log.info('CREATING ' + submissions.length + ' submissions\n\t' + submissions);
  return clientutils.saveBulk(this.models.Submissions, submissions, tran);
};

/**
 * [updateSubmission description]
 *
 * @param  {[type]} submissions - [description]
 * @param  {Sequelize.Transaction} tran - [description]
 * @return {[type]}             [description]
 */
STTClient.prototype.updateSubmission = function(submissions, tran) {
  // TODO
  console.log('tran', tran);
};

/**
 * [getFacilities description]
 *
 * @param {Object} options [description]
 * @param  {Array.<string>} [options.facilityKeys]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Array.<Facility|Sequelize.Instance>>}
 */
STTClient.prototype.getFacilities = function(options) {
  var FacilitiesModel = this.models.Facilities;

  options = _.defaultsDeep(options || {}, {
    facilityKeys: [],
    simple: true
  });
  log.debug('getFacilities with facilityKeys', options.facilityKeys);

  var facilityWhere = {};
  if (options.facilityKeys.length > 0) {
    facilityWhere = {name: {in: options.facilityKeys}};
  }

  return FacilitiesModel.findAll({
    where: facilityWhere
  })
  .then(results => {
    if (options.simple) {
      return results.map(clientutils.getSimpleInstance);
    }
    return results;
  });
};

/**
 * Equivalent to getFacilities({facilityKeys: [options.facilityKey]})[0]
 *
 * @param {Object} [options] [description]
 * @param {string} [options.facilityKey] [description]
 * @param {boolean} [options.simple=true]
 * @return {Promise.<Facility|Sequelize.Instance>}
 */
STTClient.prototype.getFacility = function(options) {
  return this.getFacilities({
    facilityKeys: options.facilityKey ? [options.facilityKey] : [],
    simple: options.simple
  })
  .then(clientutils.getOneResult);
};

/**
 * [getPeople description]
 *
 * @param {Object} [options] [description]
 * @param {Array.<string>} [options.peopleKeys] [description]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Array.<Person|Sequelize.Instance>>}
 */
STTClient.prototype.getPeople = function(options) {
  var PeopleModel = this.models.People;

  options = _.defaultsDeep(options || {}, {
    peopleKeys: [],
    simple: true
  });
  log.debug('getPeople with peopleKeys', options.peopleKeys);

  var peopleWhere = {};
  if (options.peopleKeys.length > 0) {
    peopleWhere = {name: {in: options.peopleKeys}};
  }

  return PeopleModel.findAll({
    where: peopleWhere
  })
  .then(results => {
    if (options.simple) {
      return results.map(clientutils.getSimpleInstance);
    }
    return results;
  });
};

/**
 * Equivalent to getPeople({peopleKeys: [options.personKey]})[0]
 *
 * @param {Object} [options] [description]
 * @param {string} [options.personKey]   [description]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Person>}
 */
STTClient.prototype.getPerson = function(options) {
  return this.getPeople({
    peopleKeys: options.personKey ? [options.personKey] : [],
    simple: options.simple
  })
  .then(clientutils.getOneResult);
};

/**
 * An Object containing a submission Id and submission number
 * @typedef {Object} UpdateId
 * @property {string} submissionId - The source form submission Id
 * @property {string|number} submissionNumber - The update index or number of
 *                                              the submission in the source
 *                                              form submission.
 */

/**
 * [getUpdates description]
 *
 * @method
 * @param {Object} options [description]
 * @param {Array.<UpdateId>} options.updateIds [description]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Array.<Update|Sequelize.Instance>>}
 * @throws {Error} If [updateIds.length === 0]
 */
STTClient.prototype.getUpdates = BPromise.method(function(options) {
  var UpdatesModel = this.models.Updates;

  options = _.defaultsDeep(options || {}, {
    updateIds: [],
    simple: true
  });
  log.debug('getUpdates with updateIds', options.updateIds);

  if (options.updateIds.length < 1) {
    throw new Error('getUpdates requires at least 1 update Id');
  }

  return BPromise.map(options.updateIds, function(ids) {
    // Add each id pair to a SQL "AND" statement
    return {$and: [
      {submissionId: ids.submissionId},
      {submissionNumber: ids.submissionNumber}
    ]};
  })
  .then(function(idPairs) {
    log.debug('getUpdates idPairs', idPairs);

    // Match any of the id pairs
    return UpdatesModel.findAll({
      where: {$or: idPairs}
    });
  })
  .then(results => {
    if (options.simple) {
      return results.map(clientutils.getSimpleInstance);
    }
    return results;
  });
});

/**
 Equivalent to getUpdates({updateIds: [updateId]})[0]
 *
 * @param {Object} options [description]
 * @param {UpdateId} options.updateId [description]
 * @param {boolean} [options.simple=true] [description]
 * @return {Promise.<Update|Sequelize.Instance>}
 */
STTClient.prototype.getUpdate = function(options) {
  return this.getUpdates({
    updateIds: options.updateId ? [options.updateId] : [],
    simple: options.simple
  })
  .then(clientutils.getOneResult);
};

/*
 * One Submission includes many Updates. This function combines the
 * Submission data into each of the its TrackerEvent objects.
 */
// function submissionEventCombine(stEvent) {
//   var submissionAttribs = Object.keys(
//     clientutils.getSimpleInstance(stEvent.formSubmission)
//   );

//   return BPromise.each(submissionAttribs, function(key) {
//     stEvent[key] = stEvent.formSubmission[key];
//   })
//   .then(function() {
//     return _.omit(stEvent, 'formSubmission');
//   });
// }

// const DEFAULT_PAGE_LIMIT = 5;
// const SUBMISSION_FIELDS_EXCLUDE = [
//   'id', 'created_at', 'updated_at'
// ];

// function maybeCombineWhere(oldWhere, newWhere) {
//   return {};
// }

// function parseUpdatesOptions(options) {
//   var maybeUpdatesWhere = {};

//   if (options.afterDate) {
//     // TODO
//   }
//   if (options.beforeDate) {
//     // TODO
//   }
//   if (options.maxId) {
//     // maxId is not combined with any other filters
//     return {id: {lte: maxId}};
//   }
//   if (options.location) {
//     return maybeCombineWhere(maybeUpdatesWhere, {});
//   }
//   if (options.person) {
//     return maybeCombineWhere(maybeUpdatesWhere, {});
//   }

//   return maybeUpdatesWhere;
// }

/**
 * Retrieve a list of sample tracking updates
 *
 * @param  {Object} options   Event record filter options
 *                    options.maxId
 *                    options.location
 *                    options.person
 *                    options.afterDate
 *                    options.beforeDate
 * @return {Promise.<Array<Object>>}
 */
// STTClient.prototype.listUpdates = function() {
//   // TODO: RE-ADD OPTIONS param
//   //
//   // var maxId = _maxId || null;
//   // If maxId is provided, find records where ids <= maxId
//   // var pageWhere = maxId === null ? {} : {id: {lte: maxId}};
//   var pageWhere = {};

//   var UpdatesModel = this.models.Updates;
//   var SubmissionsModel = this.models.Submissions;

//   return UpdatesModel.findAll({
//     limit: DEFAULT_PAGE_LIMIT,
//     where: pageWhere,
//     include: [{
//       model: SubmissionsModel,
//       as: 'formSubmission',
//       attributes: {exclude: SUBMISSION_FIELDS_EXCLUDE}
//     }],
//     // Order updates by the containing form submission completed dates, then by
//     // the form submission event number.
//     order: [
//       [
//         {model: SubmissionsModel, as: 'formSubmission'},
//         'completed_date',
//         'DESC'
//       ],
//       ['submission_num', 'DESC']
//     ]
//   })
//   .map(clientutils.getSimpleInstance)
//   .map(submissionEventCombine);
// };

// STTClient.prototype.listSampleIds = function() {
//   var SamplesModel = this.models.Samples;

//   return SamplesModel.findAll({
//     // attributes: {exclude: ['id']}
//   })
//   .catch(function(err) {
//     log.warn('Error fetching all Ids', err, err.stack);
//     return [];
//   });
// };

// function makeSampleWhere(stId, labId) {
//   return {$or: [
//     {$and: [{stId: stId}, {stId: {ne: null}}]},
//     {$and: [{labId: labId}, {labId: {ne: null}}]}
//   ]};
// }

// function getSamples(id, samplesModel) {
//   return samplesModel.findOne({
//     attributes: {exclude: ['id']},
//     where: makeSampleWhere(id)
//   })
//   .then(clientutils.getSimpleInstance);
// }

// function getSampleUpdates(sampleId, updatesModel, submissionModel) {
//   return updatesModel.findAll({
//     // attributes: {exclude: ['id']},
//     where: {$or: [
//       {$and: [{stId: sampleId.stId}, {stId: {ne: null}}]},
//       {$and: [{labId: sampleId.labId}, {labId: {ne: null}}]}
//     ]},
//     include: [{
//       model: submissionModel,
//       as: 'formSubmission',
//       attributes: {exclude: SUBMISSION_FIELDS_EXCLUDE}
//     }]
//   })
//   .map(clientutils.getSimpleInstance)
//   .map(submissionEventCombine);
// }

// STTClient.prototype.allSampleUpdates = function(id) {
//   log.info('Fetching all sample updates for Id "' + id + '"');
//   var SamplesModel = this.models.Samples;
//   var UpdatesModel = this.models.Updates;
//   var SubmissionsModel = this.models.Submissions;

//   return getSamples(id, SamplesModel)
//   .then(function(sampleId) {
//     if (sampleId) {
//       log.debug('Retrieved sampleId', sampleId);
//       return getSampleUpdates(sampleId, UpdatesModel, SubmissionsModel);
//     }
//     log.info('Could not locate Id "' + id + '"');
//     return [];
//   })
//   .error(function(err) {
//     log.warn('Error fetching sample updates for id ' + id, err, err.stack);
//     return [];
//   });
// };

module.exports = {
  create: function(options) {
    return new STTClient(options);
  }
};
