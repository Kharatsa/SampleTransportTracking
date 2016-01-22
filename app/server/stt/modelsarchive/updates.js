'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const submissions = require('./submissions.js');
const samples = require('./samples.js');

/**
 * A sample update event derived from a form submission.
 *
 * @typedef {Update}
 * @property {string} submissionId - The form submission Id
 * @property {number} submissionNumber - An index/counter for this individual
 *                                     data from the repeating section of a
 *                                     single submission.
 * @property {?string} stId - The sample tracking Id
 * @property {?string} labId - The lab Id
 * @property {string} sampleStatus - Status code of the sample
 *
 */

/**
 * @typedef {UpdateModel}
 * @extends {Sequelize.Model}
 * @property {Update} update {@link Update} object properties
 */

const modelName = 'Updates';

const updates = modelwrapper({

  name: modelName,

  references: [submissions, samples],

  import: function(Submissions, Samples) {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          submissionId: {
            type: DataTypes.STRING,
            field: 'submission_id',
            allowNull: false,
            references: {
              model: Submissions,
              key: 'submission_id'
            }
          },
          submissionNumber: {
            type: DataTypes.INTEGER,
            field: 'submission_num',
            allowNull: false
          },
          stId: {
            type: DataTypes.STRING,
            field: 'st_id',
            references: {
              model: Samples,
              key: 'st_id'
            }
          },
          labId: {
            type: DataTypes.STRING,
            field: 'lab_id',
            references: {
              model: Samples,
              key: 'lab_id'
            }
          },
          sampleStatus: {
            type: DataTypes.STRING,
            field: 'sample_status'
          }
        },
        {
          tableName: 'tracker_updates',

          classMethods: {
            associate: function() {

              updates.model.belongsTo(Submissions, {
                as: 'formSubmission',
                targetKey: 'submissionId',
                foreignKey: 'submissionId'
              });

              updates.model.belongsTo(Samples, {
                as: 'sampleStId',
                targetKey: 'stId',
                foreignKey: 'stId'
              });

              updates.model.belongsTo(Samples, {
                as: 'sampleLabId',
                targetKey: 'labId',
                foreignKey: 'labId'
              });

            }
          },

          indexes: [
            {
              name: 'sample_submission',
              unique: true,
              fields: [
                'submission_id', //'submission_num'
                {attribute: 'submission_num', order: 'ASC'}
              ]
            },
            {name: 'sample_ids', fields: ['st_id', 'lab_id']},
            {name: 'form_submission', fields: ['submission_id']}
          ],

          validate: {
            requireSampleId: function() {
              if (this.stId === null && this.labId === null) {
                throw new Error('Either stId or labId must be included with ' +
                  'submissions');
              }
            }
          }

        });
    };
  }

});

module.exports = updates;
