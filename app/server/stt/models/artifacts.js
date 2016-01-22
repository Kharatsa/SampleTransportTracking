'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const sampleids = require('./sampleids');
const metadata = require('./metadata');

const modelName = 'Artifacts';

// const ARTIFACT_TYPES = ['form', 'blood', 'sputum', 'urine', 'dbs', 'other'];

const artifacts = modelwrapper({
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
        artifactType: {
          type: DataTypes.STRING,
          // type: DataTypes.ENUM,
          // values: ARTIFACT_TYPES,
          allowNull: false,
          references: {
            model: Metadata,
            key: 'key'
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

            Metadata.hasMany(artifacts.model, {
              foreignKey: 'artifactType',
              scope: {
                type: 'artifact'
              }
            });

            artifacts.model.belongsTo(Metadata, {
              // as: 'ArtifactTypeMeta',
              targetKey: 'key',
              foreignKey: 'artifactType',
              scope: {
                type: 'artifact'
              }
            });
          }
        }
      });
    };
  }
});

module.exports = artifacts;