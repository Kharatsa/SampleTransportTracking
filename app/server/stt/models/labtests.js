'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const sampleids = require('./sampleids.js');
const metadata = require('./metadata.js');

const modelName = 'LabTests';

const labtests = modelwrapper({
  name: modelName,

  references: [sampleids, metadata],

  import: function(SampleIds, Metadata) {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName, {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        sampleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: SampleIds,
            key: 'uuid'
          }
        },
        testType: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: Metadata,
            key: 'key'
          },
          validate: {is: /[A-Za-z]{5}/}
        }
      }, {

        classMethods: {
          associate: function() {
            SampleIds.hasMany(labtests.model, {
              foreignKey: 'sampleId'
            });

            labtests.model.belongsTo(SampleIds, {
              foreignKey: 'sampleId'
            });

            Metadata.hasMany(labtests.model, {
              foreignKey: 'testType',
              scope: {
                type: 'labtest'
              }
            });

            labtests.model.belongsTo(Metadata, {
              targetKey: 'key',
              foreignKey: 'testType',
              scope: {
                type: 'labtest'
              }
            });

          }
        }
      });
    };
  }
});

module.exports = labtests;
