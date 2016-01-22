'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metadata = require('./metadata.js');
const artifacts = require('./artifacts.js');
const labtests = require('./labtests.js');

// TODO: perhaps load this as another metadata reference instead?
const WORKFLOW_STAGES = [
  'spickup',
  'sarrival',
  'labstatus',
  'rpickup',
  'rarrival'
];

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
          values: WORKFLOW_STAGES
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
          references: metadataKeyCol
        },
        person: {
          type: DataTypes.STRING,
          allowNull: true,
          references: metadataKeyCol
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          references: metadataKeyCol
        },
        labRejection: {
          type: DataTypes.STRING,
          allowNull: true,
          references: metadataKeyCol,
          validate: {is: /[A-Za-z]{5}/}
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

            // changes.model.belongsTo(Metadata, {
            //   as: 'FacilityMeta',
            //   targetKey: 'key',
            //   foreignKey: 'facility',
            //   scope: {
            //     type: 'facility'
            //   }
            // });

            // changes.model.belongsTo(Metadata, {
            //   as: 'PersonMeta',
            //   targetKey: 'key',
            //   foreignKey: 'person',
            //   scope: {
            //     type: 'person'
            //   }
            // });

            // changes.model.belongsTo(Metadata, {
            //   as: 'StatusMeta',
            //   targetKey: 'key',
            //   foreignKey: 'status',
            //   scope: {
            //     type: 'status'
            //   }
            // });

            // changes.model.belongsTo(Metadata, {
            //   as: 'RejectionMeta',
            //   targetKey: 'key',
            //   foreignKey: 'labRejection',
            //   scope: {
            //     type: 'rejection'
            //   }
            // });

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
