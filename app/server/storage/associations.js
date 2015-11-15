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
  var Facilities = db.models.Facilities;
  var Samples = db.models.Samples;
  var Submissions = db.models.Submissions;
  var TrackerEvents = db.models.TrackerEvents;

  Submissions.belongsTo(Forms, {
    as: 'submissionForm',
    targetKey: 'formId',
    foreignKey: 'form',
  });
  Submissions.belongsTo(Facilities, {
    as: 'submissionFacility',
    targetKey: 'name',
    foreignKey: 'facility',
  });

  TrackerEvents.belongsTo(Samples, {
    as: 'sampleStId',
    targetKey: 'stId',
    foreignKey: 'stId',
  });
  TrackerEvents.belongsTo(Samples, {
    as: 'sampleLabId',
    targetKey: 'labId',
    foreignKey: 'labId',
  });
  TrackerEvents.belongsTo(Submissions, {
    as: 'formSubmission',
    targetKey: 'submissionId',
    foreignKey: 'submissionId',
  });

  log.info('Finished loading associations');
};

module.exports = makeAssociations;
