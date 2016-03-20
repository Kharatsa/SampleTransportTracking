'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const regions = require('./metaregions.js');

const modelName = 'MetaFacilities';

const facilities = modelwrapper({
  name: modelName,

  references: [regions],

  import: function(Regions) {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName, {
        key: {
          type: DataTypes.STRING,
          primaryKey: true,
          unique: 'facilityRegion'
        },
        value: {
          type: DataTypes.STRING,
          allowNull: true,
          get: function() {
            const val = this.getDataValue('value');
            // Metadata values should return something more than null,
            // since they are intended for user-facing display.
            return val !== null ? val : this.getDataValue('key');
          }
        },
        region: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: 'facilityRegion',
          references: {
            model: Regions,
            key: 'key'
          }
        }
      }, {
        tableName: modelName,

        classMethods: {
          associate: function() {
            facilities.model.belongsTo(Regions, {
              foreignKey: 'region'
            });

            Regions.hasMany(facilities.model, {
              foreignKey: 'region'
            });

          }
        }
      });
    };
  }
});

module.exports = facilities;
