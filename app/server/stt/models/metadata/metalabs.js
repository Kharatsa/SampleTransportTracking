'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');
const districts = require('./metadistricts.js');

const modelName = 'MetaLabs';

const labs = modelwrapper({
  name: modelName,

  references: [districts],

  import: function(Districts) {
    return function(sequelize, DataTypes) {
      const template = Object.assign({}, metaModelTemplate(DataTypes));

      // Labs belong to a district
      template.key.unique = 'districtLab';

      template.district = {
        type: DataTypes.STRING,
        allowNull: true,
        unique: 'districtLab',
        references: {
          model: Districts,
          key: 'key'
        },
        set: function(val) {
          this.setDataValue('district', val ? val.toUpperCase().trim() : val);
        }
      };

      return sequelize.define(
        modelName,
        template,
        {
          tableName: modelName,

          classMethods: {
            associate: function() {
              labs.model.belongsTo(Districts, {foreignKey: 'district'});
              Districts.hasMany(labs.model, {foreignKey: 'district'});
            }
          }
        }
      );
    };
  }
});

module.exports = labs;
