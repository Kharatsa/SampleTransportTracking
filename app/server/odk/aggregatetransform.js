'use strict';

const BPromise = require('bluebird');
const log = require('app/server/util/log.js');

/**
 * Produces an array of strings representing the formID values from the
 * /formList ODK Aggregate endpoint.
 *
 * @param  {Object} formList      A JSON translation of the XML formList data
 * @return {Array}                Array of Objects containing formID and formName
 *                                      {String} form.formID
 *                                      {String} form.name
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
exports.getFormIds = getFormIds;
