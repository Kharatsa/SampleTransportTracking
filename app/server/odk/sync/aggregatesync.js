'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const aggregate = require('app/server/odk/aggregateapi.js');
const xmltransform = require('app/server/odk/xmltransform.js');
const parser = require('app/server/util/xmlconvert.js');
const log = require('app/server/util/log.js');

// fetch XML
// return Objects/JSON
// call publishtransform

/**
 * Produces an array of strings representing the formID values from the
 * /formList ODK Aggregate endpoint.
 *
 * @param  {Object} formList      A JSON translation of the XML formList data
 * @return {Array}                Array of Objects containing formID and formName
 *                                      {string} form.formID
 *                                      {string} form.name
 */
function getFormIds(formList) {
  log.debug('getFormIds for formList', formList);
  log.debug('formList keys', Object.keys(formList));
  log.debug('formList.xforms keys', Object.keys(formList.xforms));
  return BPromise.map(formList.xforms.xform, function(form) {
    return {
      formId: form.formID[0] || '',
      name: form.name[0] || ''
    };
  });
}

/**
 * Enum covering the formIds currently supported by the sample tracking service.
 * @enum {string}
 */
const supportedForms = {
  SAMPLE_DEPARTURE: 'sdepart',
  SAMPLE_ARRIVAL: 'sarrive',
  LAB_LINK: 'link',
  RESULT: 'result'
};

const supportedFormIds = Object.keys(supportedForms).map(function(key) {
  return supportedForms[key];
});

function syncFormList() {
  log.debug('Sychronizing ODK Aggregate form list');
  return aggregate.formList()
  .spread(function(listRes, body) {
    log.debug('Parsing ODK Aggregate forms', body);
    return parser.parseFormList(body);
  })
  .then(xmltransform.parseFormList)
  .then(getFormIds)
  .catch(function(err) {
    log.error('Error parsing ODK Aggregate form listing', err, err.stack);
  })
  .tap(function(forms) {
    log.info('Retrieved ODK Aggregate form list ', forms);

    var serverFormIds = forms.map(function(form, i) {
      return {formId: form.formId, name: form.name, index: i};
    });

    BPromise.each(serverFormIds, function checkForms(form) {
      if (_.indexOf(supportedFormIds, form.formId) === -1) {
        log.warn('Unrecognized ODK Aggregate form ' +
          JSON.stringify(forms[form.index]));
      }
    });
  });
}

module.exports = {
  syncFormList: syncFormList
};
