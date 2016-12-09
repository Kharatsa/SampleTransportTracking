'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const modelutils = require('./modelutils.js');
const metadata = require('./metadata');

const modelName = 'SampleIds';

const dateRange = options => {
  const afterQuery = {$gte: options.afterDate};
  const beforeQuery = (
    typeof options.beforeDate !== 'undefined' ?
    {$lte: options.afterDate} :
    {}
  );

  return {createdAt: Object.assign({}, afterQuery, beforeQuery)};
};

const STT_ID_REGEXP = new RegExp(/[\w\d]{9}\d{3}/);
const LAB_ID_REGEXP = new RegExp(/([a-zA-Z]{3})([0-9]{7})/);

const makePatternValidator = pattern => {
  return value => {
    if (!pattern.test(value)) {
      throw new Error(`"${value}" does not match required pattern`);
    }
  };
};

const sttIdPatternMatch = makePatternValidator(STT_ID_REGEXP);
const labIdPatternMatch = makePatternValidator(LAB_ID_REGEXP);

const sampleids = modelwrapper({
  name: modelName,

  references: [metadata.facilities],

  import: function(MetaFacilities) {
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
          unique: true,
          validate: {sttIdPatternMatch},
        },
        labId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
          validate: {labIdPatternMatch},
        },
        origin: {
          type: DataTypes.STRING,
          allowNull: true,
          references: modelutils.keyReference(MetaFacilities),
          set: function(val) {
            this.setDataValue('origin', val ? val.toUpperCase() : val);
          }
        },
        outstanding: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      }, {
        indexes: [{fields: ['createdAt', 'origin']}],

        classMethods: {
          associate: function() {
            MetaFacilities.hasMany(sampleids.model, {
              foreignKey: 'origin'
            });

            sampleids.model.belongsTo(MetaFacilities, {
              foreignKey: 'origin'
            });
          }
        },

        scopes: {
          inDateRange: function(val) {
            return {where: dateRange(val)};
          }
        },

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
