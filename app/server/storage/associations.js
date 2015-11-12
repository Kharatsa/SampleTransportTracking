'use strict';

const log = require('app/server/util/log.js');

/**
 * Creates the associations (e.g., foreign keys) for models in the Sample
 * Tracking database. Associations in Sequelize may only be created on Models
 * attached to a Sequelize instance, so this functions requires an existing
 * database instance, with the models already attached/imported.
 *
 * @param  {Object} db A sequelize database instance
 */
const makeAssociations = function makeAssociationsFunc(db) {
  var Forms = db.models.Forms;
  var SubmissionData = db.models.SubmissionData;
  var TrackerEvents = db.models.TrackerEvents;
  var SampleIds = db.models.SampleIds;

  TrackerEvents.belongsTo(SampleIds, {
    as: 'SampleStId', targetKey: 'stId', foreignKey: 'stId'
  });
  TrackerEvents.belongsTo(SampleIds, {
    as: 'SampleIdLabId', targetKey: 'labId', foreignKey: 'labId'
  });
  TrackerEvents.belongsTo(Forms, {
    as: 'TrackerEventForm', targetKey: 'formId', foreignKey: 'formId'
  });

  SubmissionData.belongsTo(TrackerEvents, {
    as: 'TrackerEvent', targetKey: 'instanceId', foreignKey: 'instanceId'
  });
  SubmissionData.belongsTo(Forms, {
    as: 'SubmissionForm', targetKey: 'formId', foreignKey: 'formId'
  });

  log.debug('Finished making associations');
};

module.exports = makeAssociations;
