'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const forms = require('./forms.js');
const facilities = require('./facilities.js');

/**
 * Data is submitted to ODK Aggregate in a form submission. This submission
 * may include metadata when it originates from a mobile application. The
 * Submission object encapsulates all this metadata.
 *
 * @typedef {Submission}
 * @property {!string} form - Id for the form in ODK Aggregate
 * @property {!string} submissionId - Id for the individual submission
 * @property {string} facility - The source facility Id
 * @property {string} person - The source person Id
 * @property {string} deviceId - The source device Id
 * @property {string} simSerial - The source SIM serial
 * @property {string} formStartDate - Form submission begin datetime
 * @property {string} formEndDate - Form submission finished datetime
 * @property {!string} completedDate - Form submission marked complete datetime
 */

/**
 * @typedef {SubmissionModel}
 * @extends {Sequelize.Model}
 * @property {Submission} submission {@link Submission} object properties
 */

const modelName = 'Submissions';

const submissions = modelwrapper({

  name: modelName,

  references: [forms, facilities],

  import: function(Forms, Facilities) {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          form: {
            type: DataTypes.STRING,
            field: 'form',
            allowNull: false,
            references: {
              model: Forms,
              key: 'form_id'
            }
          },
          submissionId: {
            type: DataTypes.UUID,
            field: 'submission_id',
            allowNull: false,
            unique: true
          },
          facility: {
            type: DataTypes.STRING,
            field: 'facility',
            references: {
              model: Facilities,
              key: 'name'
            }
          },
          person: {
            type: DataTypes.STRING,
            field: 'rider'
          },
          deviceId: {
            type: DataTypes.STRING,
            field: 'device_id'
          },
          simSerial: {
            type: DataTypes.STRING,
            field: 'sim_serial'
          },
          formStartDate: {
            type: DataTypes.DATE,
            field: 'form_start_date'
          },
          formEndDate: {
            type: DataTypes.DATE,
            field: 'form_end_date'
          },
          completedDate: {
            type: DataTypes.DATE,
            field: 'completed_date'
          }
        },
        {
          tableName: 'submissions',

          classMethods: {
            associate: function() {

              submissions.model.belongsTo(Forms, {
                as: 'submissionForm',
                targetKey: 'formId',
                foreignKey: 'form'
              });

              submissions.model.belongsTo(Facilities, {
                as: 'submissionFacility',
                targetKey: 'name',
                foreignKey: 'facility'
              });

            }
          },

          indexes: [
            {name: 'submission', unique: true, fields: ['submission_id']},
            {name: 'completion_dates', fields: ['completed_date']}
          ]

        });
    };
  }

});

module.exports = submissions;
