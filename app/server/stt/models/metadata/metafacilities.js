'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');
const regions = require('./metaregions.js');

const modelName = 'MetaFacilities';

const facilities = modelwrapper({
  name: modelName,

  references: [regions],

  import: function(Regions) {
    return function(sequelize, DataTypes) {
      const template = Object.assign({}, metaModelTemplate(DataTypes));

      // Facilities includes some additional fields, so the normal metadata
      // model template must be supplemented
      template.key.unique = 'facilityRegion';
      template.region = {
        type: DataTypes.STRING,
        allowNull: true,
        unique: 'facilityRegion',
        references: {
          model: Regions,
          key: 'key'
        },
        set: function(val) {
          this.setDataValue('region', val ? val.toUpperCase().trim() : val);
        }
      };

      return sequelize.define(
        modelName,
        template,
        {
          tableName: modelName,

          classMethods: {
            associate: function() {
              facilities.model.belongsTo(Regions, {foreignKey: 'region'});
              Regions.hasMany(facilities.model, {foreignKey: 'region'});
            }
          }
        }
      );
    };
  }
});

module.exports = facilities;
