'use strict';

/**
 * A basic key/value metadata table Sequelize Model template.
 *
 * @param {Object} options [description]
 * @param {string} options.modelName [description]
 * @param {Object} [options.keyValidate] [description]
 * @return {Function} A Sequelize Model import method
 *
 * http://docs.sequelizejs.com/en/latest/docs/models-definition/#import
 */

const metaModelTemplate = (DataTypes, options) => {
  options = options || {};
  return {
    key: {
      type: DataTypes.STRING,
      set: function(val) {
        this.setDataValue('key', val ? val.toUpperCase().trim() : val);
      },
      validate: options.keyValidate
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
      set: function(val) {
        this.setDataValue('value', val ? val.trim() : val);
      },
      get: function() {
        const val = this.getDataValue('value');
        // Metadata values should return something more than null,
        // since they are intended for user-facing display.
        return val !== null ? val : this.getDataValue('key');
      }
    }
  };
};

module.exports = metaModelTemplate;
