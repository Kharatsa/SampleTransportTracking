'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');
// const regions = require('./metaregions.js');
const labs = require('./metalabs.js');

const modelName = 'MetaFacilities';

const facilities = modelwrapper({
  name: modelName,

  references: [labs],

  import: function(Labs) {
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
          model: Labs,
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
              facilities.model.belongsTo(Labs, {foreignKey: 'region'});
              Labs.hasMany(facilities.model, {foreignKey: 'region'});
            }
          }
        }
      );
    };
  }
});

module.exports = facilities;
