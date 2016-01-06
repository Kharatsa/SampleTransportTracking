'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const samples = require('./samples.js');
const updates = require('./updates.js');

/**
 * A sample tracking test request
 *
 * @typedef {Facility}
 * @property {string} name - The facility key/Id
 * @property {string} region - The region key/Id
 * @property {string} type - The facility type
 */

/**
 * @typedef {FacilityModel}
 * @extends {Sequelize.Model}
 * @property {Facility} facility {@link Facility} object properties
 */

const modelName = 'TestRequests';

const testrequests = modelwrapper({

  name: modelName,

  references: [samples, updates],

  import: function(Samples, Updates) {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName, {
        updateId: {
          type: DataTypes.INTEGER,
          field: 'update_id'
        },
        sampleId: {
          type: DataTypes.INTEGER,
          field: 'sample_id'
        },
        statusCode: {
          type: DataTypes.STRING,
          field: 'status_code'
        },
        testCode: {
          type: DataTypes.STRING,
          field: 'test_code'
        },
        rejectCode: {
          type: DataTypes.STRING,
          field: 'reject_code'
        }
      }, {
        tableName: 'test_requests',

        classMethods: {
          associate: function() {
            testrequests.model.belongsTo(Samples, {
              as: 'testSample',
              targetKey: 'id',
              foreignKey: 'sampleId'
            });

            testrequests.model.belongsTo(Updates, {
              as: 'testUpdate',
              targetKey: 'id',
              foreignKey: 'updateId'
            });
          }
        }

      });
    };
  }

});

module.exports = testrequests;
