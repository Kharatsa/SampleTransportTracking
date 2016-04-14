'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const modelutils = require('./modelutils.js');
const sampleids = require('./sampleids.js');
const artifacts = require('./artifacts.js');
const labtests = require('./labtests.js');
const metadata = require('./metadata');

const modelName = 'Changes';

const changes = modelwrapper({
  name: modelName,

  references: [
    sampleids,
    artifacts,
    labtests,
    metadata.facilities,
    metadata.people,
    metadata.statuses,
    metadata.rejections,
    metadata.stages
  ],

  import: function(SampleIds, Artifacts, LabTests, MetaFacilities, MetaPeople,
                   MetaStatuses, MetaRejections, MetaStages) {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName, {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        statusDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        stage: {
          type: DataTypes.STRING,
          allowNull: false,
          references: modelutils.keyReference(MetaStages)
        },
        artifact: {
          type: DataTypes.UUID,
          allowNull: true,
          references: modelutils.uuidReference(Artifacts)
        },
        labTest: {
          type: DataTypes.UUID,
          allowNull: true,
          references: modelutils.uuidReference(LabTests)
        },
        facility: {
          type: DataTypes.STRING,
          allowNull: true,
          references: modelutils.keyReference(MetaFacilities)
        },
        person: {
          type: DataTypes.STRING,
          allowNull: true,
          references: modelutils.keyReference(MetaPeople)
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          references: modelutils.keyReference(MetaStatuses)
        },
        labRejection: {
          type: DataTypes.STRING,
          allowNull: true,
          references: modelutils.keyReference(MetaRejections)
        }
      }, {

        indexes: [
          {fields: ['facility']}, {fields: ['artifact']}, {fields: ['labTest']}
        ],

        classMethods: {
          associate: function() {

            Artifacts.hasMany(changes.model, {
              foreignKey: 'artifact'
            });
            changes.model.belongsTo(Artifacts, {
              foreignKey: 'artifact'
            });

            LabTests.hasMany(changes.model, {
              foreignKey: 'labTest'
            });
            changes.model.belongsTo(LabTests, {
              foreignKey: 'labTest'
            });

            changes.model.belongsTo(MetaFacilities, {
              foreignKey: 'facility'
            });
            MetaFacilities.hasMany(changes.model, {
              foreignKey: 'facility'
            });

          }
        },

        validate: {
          oneOfArtifactOrLabTest: function() {
            if ((this.artifact === null) && (this.labTest === null)) {
              throw new Error(`Either an artifact or lab test is
                required`);
            }
          }
        },

        scopes: {
          artifactsChangesInDateRange: function(range) {
            return {
              where: {artifact: {$not: null}},
              include: [{
                model: Artifacts,
                include: [{
                  model: SampleIds.scope({method: ['inDateRange', range]})
                }]
              }]
            };
          },
          labTestChangesInDateRange: function(range) {
            return {
              where: {labTest: {$not: null}},
              include: [{
                model: LabTests,
                include: [{
                  model: SampleIds.scope({method: ['inDateRange', range]})
                }]
              }]
            };
          }
        }

      });
    };
  }
});

module.exports = changes;
