'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const modelutils = require('./modelutils.js');
const sampleids = require('./sampleids.js');
const metadata = require('./metadata');

const modelName = 'LabTests';

const labtests = modelwrapper({
  name: modelName,

  references: [sampleids, metadata.labTests],

  import: function(SampleIds, MetaLabTests) {
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
          references: modelutils.uuidReference(SampleIds)
        },
        testType: {
          type: DataTypes.STRING,
          allowNull: false,
          references: modelutils.keyReference(MetaLabTests),
          set: function(val) {
            this.setDataValue('testType', val ? val.toUpperCase() : val);
          }
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

          }
        }
      });
    };
  }
});

module.exports = labtests;
