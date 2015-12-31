'use strict';

const BPromise = require('bluebird');
const Sequelize = require('sequelize');
const log = require('app/server/util/log.js');

/**
 * PublishClient handles data delivered by the ODK Aggregate "Simple JSON
 * publisher."
 *
 * https://github.com/opendatakit/opendatakit/wiki/Aggregate-Publishers-Implementation-Details
 *
 * @param {Object} options
 * @param {Object} options.db   An reference to the DataStorage object
 */
function PublishClient(options) {
  log.debug('Creating PublishClient');
  if (!options.db) {
    throw new Error('PublishClient requires options.db');
  }

  this.db = options.db;
}

/**
 * Stores the latest form list from ODK in the local DB.
 *
 * @param  {Object}   forms The parsed /formList object from ODK
 * @return {Promise}        Resolved on successful sync
 */
PublishClient.prototype.saveFormList = function(forms) {
  var FormsModel = this.db.models.Forms;

  return this.db.transaction(function(tran) {
    return BPromise.map(forms, function(form) {
      return {formId: form.formId, formName: form.name};
    })
    .bind(this)
    .map(function(form) {
      return FormsModel.findOrCreate({
        where: {formId: form.formId},
        defaults: {formName: form.name},
        transaction: tran
      });
    })
    .then(function(forms) {
      log.info('Successfully processed ' + forms.length + ' forms');
    });
  });
};

/**
 * Persists the component pieces of a submission to various local database
 * tables. These components are:
 *   * Samples (sample and lab IDs, sample type)
 *   * Submission (form Id, instance/submission Id)
 *   * Updates
 *   * Facilities
 *
 * @param  {Object} submission  A form submission from ODK Aggregate's Simple
 *                              JSON publisher.
 * @return {Promise}            Resolved when the data is all committed to the
 *                                       database, and otherwise rejected.
 */
PublishClient.prototype.save = function(submission) {
  var formId = submission[formFields.FORM_ID];
  log.info('New `' + formId + '` form submission', submission);
  log.debug('Data', submission.data);

  var self = this;
  return this.db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  }, function(tran) {
    log.debug('Opening new transaction');
    return BPromise.map(submission.data, function(entry) {
      log.debug('ENTRY', entry);
      return BPromise.props({
        samples: parseSamples(entry),
        submission: parseSubmission(formId, entry),
        facility: parseFacility(entry),
        updates: parseUpdates(entry)
      });
    })
    .each(function(parsed, index, len) {
      log.debug('PublishClient parsed result ' + (index + 1) + ' of ' + len);
      log.debug(parsed);
      return self._saveFacility(parsed.facility, tran)
      .then(function() {
        log.debug('PublishClient completed facility insert');
        return self._saveSubmission(formId, parsed.submission, tran);
      })
      .then(function() {
        log.debug('PublishClient completed submission insert');
        return self._saveSamples(parsed.samples, tran);
      })
      .then(function() {
        var submissionId = parsed.submission.submissionId || null;
        log.debug('PublishClient completed samples insert');
        return self._saveUpdates(submissionId, parsed.updates, tran);
      })
      .then(function() {
        log.debug('PublishClient completed updates insert');
        log.debug('PublishClient result ' + (index + 1) + ' of ' + len);
      });
    });
  })
  .then(function(result) {
    log.info('Finished COMMITTING form complete submission', result);
  });
};

// TODO: refactor
var maybeUpdateSamples = BPromise.method(function(newId, localId, tran) {
  log.info('Maybe update local Sample', localId.get({plain: true}));

  if (localId.stId !== newId.stId || localId.labId !== newId.labId) {
    log.info('Updating Sample');
    localId.stId = newId.stId;
    localId.labId = newId.labId;
    return localId.save({
      transaction: tran
    });
  } else {
    log.info('Sample does not require update');
  }
  return localId;
});

/**
 * Persists the sample identifiers to the database. Submission data should
 * always include at least one sample ID field. Some forms may include only one
 * sample ID, while others might include all.
 *
 * @param  {Object} samples              A single parsed object parsed from
 *                                        submission data containing the sample
 *                                        ID values (i.e., the samples object
 *                                        may contain 1 or more "ids" that can
 *                                        identify a sample.
 * @param  {Object}   tran                Sequelize transaction
 * @return {Promise.<Instance, created>}  Whether the row was created or updated.
 */
PublishClient.prototype._saveSamples = function(samples, tran) {
  log.info('Saving ' + samples.length + ' submission SAMPLES', samples);
  var SamplesModel = this.db.models.Samples;

  return BPromise.map(samples, function(sample) {
    return SamplesModel.findOrCreate({
      where: {$or: [
        {$and: [{stId: sample.stId}, {stId: {ne: null}}]},
        {$and: [{labId: sample.labId}, {labId: {ne: null}}]}
      ]},
      defaults: sample,
      transaction: tran
    })
    .then(function(result) {
      var samplesInstance = result[0];
      var created = result[1];
      if (!created) {
        // The sample record already existed. It might require an update.
        return maybeUpdateSamples(sample, samplesInstance, tran);
      }
      log.info('Created new Sample', samplesInstance.get({plain: true}));
    });
  });
};

/**
 * TODO
 *
 * @param  {Object} facility [description]
 * @param  {Object} tran     [description]
 * @return {Promise}          [description]
 */
PublishClient.prototype._saveFacility = function(facility, tran) {
  log.info('Saving FACILITY from submission', facility);

  var FacilitiesModel = this.db.models.Facilities;

  return FacilitiesModel.findOrCreate({
    where: {name: facility.name},
    defaults: facility,
    transaction: tran
  })
  .spread(function(instance, created) {
    if (created) {
      log.debug('Created new facility');
    } else {
      log.debug('Skipping facility insert');
    }
  });
};

PublishClient.prototype._saveSubmission = function(formId, submission, tran) {
  log.debug('Saving form submission', submission);

  var SubmissionsModel = this.db.models.Submissions;
  return SubmissionsModel.findOrCreate({
    where: {$and: [
      {submissionId: submission.submissionId},
      {submissionId: {ne: null}}
    ]},
    defaults: submission,
    transaction: tran
  });
};


/**
 * Persists the sample, form, and submission IDs for a submission to the
 * database.
 *
 * @param  {string}   submissionId
 * @param  {Object[]} updates         A parsed collection of ST Updates from a
 *                                    single submission.
 * @param  {Object}   tran            Sequelize transaction
 * @return {Promise.<Instance,Boolean>}         [description]
 */
PublishClient.prototype._saveUpdates = function(submissionId, updates, tran) {
  log.info('Saving EVENTS from submission', updates);

  var UpdatesModel = this.db.models.Updates;

  return UpdatesModel.findOne({
    where: {$and: [
      {submissionId: submissionId},
      {submissionId: {ne: null}}
    ]},
    transaction: tran
  })
  .then(function(result) {
    // Only insert the field data when the instance id (i.e., form submission)
    // is not already present in the submission data table.
    if (!result) {
      log.debug('Inserting sample updates');
      return UpdatesModel.bulkCreate(updates, {transaction: tran});
    }
    log.debug('Skipping insert for existing sample updates');
  });
};

exports.create = function(options) {
  return new PublishClient(options);
};
