'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metadata = require('./metadata.js');
const artifacts = require('./artifacts.js');
const labtests = require('./labtests.js');

// TODO: perhaps load this as another metadata reference instead?
const WORKFLOW_STAGES = {
  sdepart: 'Sample Pickup',
  sarrive: 'Sample Delivery',
  labstatus: 'Lab Status',
  rdepart: 'Results Pickup',
  rarrive: 'Results Delivery'
};

const WORKFLOW_STAGE_KEYS = Object.keys(WORKFLOW_STAGES);

const modelName = 'Changes';

const changes = modelwrapper({
  name: modelName,

  references: [metadata, artifacts, labtests],

  import: function(Metadata, Artifacts, LabTests) {
    const metadataKeyCol = {
      model: Metadata,
      key: 'key'
    };

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
          type:   DataTypes.ENUM,
          allowNull: false,
          values: WORKFLOW_STAGE_KEYS,
          get: function() {
            // Return a readable version of the form/stage name from the database
            const stageKey = this.getDataValue('stage');
            return WORKFLOW_STAGES[stageKey];
          }
        },
        artifact: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: Artifacts,
            key: 'uuid'
          }
        },
        labTest: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: LabTests,
            key: 'uuid'
          }
        },
        facility: {
          type: DataTypes.STRING,
          allowNull: true,
          references: metadataKeyCol,
          set: function(val) {
            this.setDataValue('facility', val ? val.toUpperCase() : val);
          }
        },
        person: {
          type: DataTypes.STRING,
          allowNull: true,
          references: metadataKeyCol,
          set: function(val) {
            this.setDataValue('person', val ? val.toUpperCase() : val);
          }
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          references: metadataKeyCol,
          set: function(val) {
            this.setDataValue('status', val ? val.toUpperCase() : val);
          }
        },
        labRejection: {
          type: DataTypes.STRING,
          allowNull: true,
          references: metadataKeyCol,
          set: function(val) {
            this.setDataValue('labRejection', val ? val.toUpperCase() : val);
          },
          validate: {is: /[A-Z]{5}/}
        }
      }, {

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
          artifactChanges: {
            where: {
              artifact: {$not: null}
            }
          },

          labTestChanges: {
            where: {
              labTest: {$not: null}
            }
          }
        }

      });
    };
  }
});

module.exports = changes;
