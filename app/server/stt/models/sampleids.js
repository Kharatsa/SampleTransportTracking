'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

const LAB_ID_REGEXP = new RegExp(/([a-zA-Z]{3})([0-9]{7})/);

const modelName = 'SampleIds';

const sampleids = modelwrapper({
  name: modelName,

  references: [],

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName, {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        stId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        labId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
          validate: {
            patternMatch: function(value) {
              if (!LAB_ID_REGEXP.test(value)) {
                throw new Error(`"${value}" does not match required lab ID
                                pattern: ${LAB_ID_REGEXP}`);
              }
            }
          }
        },
        outstanding: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      }, {
        indexes: [{name: 'idPair', unique: true, fields: ['stId', 'labId']}]
      });
    };
  }
});

module.exports = sampleids;