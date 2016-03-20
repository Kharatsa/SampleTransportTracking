'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const modelutils = require('./modelutils.js');
const sampleids = require('./sampleids.js');
const metadata = require('./metadata');

const modelName = 'Artifacts';

const artifacts = modelwrapper({
  name: modelName,

  references: [sampleids, metadata.artifacts],

  import: function(SampleIds, MetaArtifacts) {
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
        artifactType: {
          type: DataTypes.STRING,
          allowNull: false,
          references: modelutils.keyReference(MetaArtifacts),
          set: function(val) {
            this.setDataValue('artifactType', val ? val.toUpperCase() : val);
          }
        }
      }, {

        classMethods: {
          associate: function() {

            SampleIds.hasMany(artifacts.model, {
              foreignKey: 'sampleId'
            });

            artifacts.model.belongsTo(SampleIds, {
              foreignKey: 'sampleId'
            });

          }
        }
      });
    };
  }
});

module.exports = artifacts;
