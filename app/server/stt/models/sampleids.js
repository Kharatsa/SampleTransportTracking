'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

// const LAB_ID_REGEXP = new RegExp(/([a-zA-Z]{3})([0-9]{7})/);

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
          allowNull: true,
          unique: true
        },
        labId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true
          // TODO: re-enable when real lab Ids are being scanned
          // validate: {
          //   patternMatch: function(value) {
          //     if (!LAB_ID_REGEXP.test(value)) {
          //       throw new Error(`"${value}" does not match required lab ID
          //                       pattern: ${LAB_ID_REGEXP}`);
          //     }
          //   }
          // }
        },
        outstanding: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      }, {
        // indexes: [{name: 'idPair', unique: true, fields: ['stId', 'labId']}],

        validate: {
          oneIdRequired: function() {
            if (!(this.stId || this.labId)) {
              throw new Error(`Samples require one of stId or labId
                              ${JSON.stringify(this.dataValues)}`);
            }
          }
        }
      });
    };
  }
});

module.exports = sampleids;
