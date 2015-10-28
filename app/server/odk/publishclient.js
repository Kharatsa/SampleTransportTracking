'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const server = require('app/server/server.js');
const log = require('app/server/util/log.js');
const odkAggregate = require('app/server/odk/aggregateapi.js');
const parser = require('app/server/util/xmlconvert.js');
const odkTransform = require('app/server/odk/aggregatetransform.js');

/**
 * @enum {String}
 */
const supportedForms = {
  SAMPLE_ORIGIN: 'sample-origin',
  SAMPLE_DEPARTURE: 'sample-departure',
  SAMPLE_ARRIVAL: 'sample-arrival',
  LAB_LINK: 'lab-link',
  LAB_STATUS: 'lab-status',
  RESULT_DEPARTURE: 'result-departure',
  RESULT_ARRIVAL: 'result-arrival'
};

const supportedFormIds = Object.keys(supportedForms).map(function(key) {
  return supportedForms[key];
});

function syncFormList() {
  log.debug('Sychronizing ODK Aggregate form list');

  return odkAggregate.formList()
  .then(function(xml) {
    return parser.parseXML(xml);
  })
  .then(function(formListObj) {
    return odkTransform.getFormIds(formListObj);
  })
  .tap(function(forms) {
    log.info('Retrieved ODK Aggregate form list ', forms);

    var serverFormIds = forms.map(function(form, i) {
      return {formId: form.formId, name: form.name, index: i};
    });

    Bluebird.each(serverFormIds, function checkForms(form) {
      if (_.indexOf(supportedFormIds, form.formId) === -1) {
        log.error('Unsupported ODK Aggregate form ' +
          JSON.stringify(forms[form.index]));
      }
    });
  });
}

/**
 * PublishClient handles data delivered by the ODK Aggregate "Simple JSON
 * publisher."
 *
 * https://github.com/opendatakit/opendatakit/wiki/Aggregate-Publishers-Implementation-Details
 *
 * @param {Object} dbStorage [description]
 */
function PublishClient(dbStorage) {
  this.dbClient = dbStorage;
  log.debug('Creating PublishClient');

  syncFormList(this.dbClient)
  .bind(this)
  .then(function(forms) {
    return server.dbStorage.saveFormList(forms);
  });

  log.debug('App:');
}

/**
 * Saves the submission data to the local database. The same data might be
 * submitted more than once, so data will only be inserted when the records
 * are unique.
 *
 * @param  {Object} submission The submission object includes all fields
 *                             detailed in the ODK Aggregate "Simple JSON
 *                             Publisher" documentation
 */

PublishClient.prototype.saveSubmission = function(submission) {
  switch (submission.formId) {
    case 'sample-origin':
    case 'yolo':
      break;
  }
};

module.exports = PublishClient;
