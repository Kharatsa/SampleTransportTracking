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
module.exports = (options) => {
  options = options || {};
  if (!options.modelName) {
    throw new Error('Missing required parameter modelName');
  }

  return function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(options.modelName, {
        key: {
          type: DataTypes.STRING,
          primaryKey: true,
          set: function(val) {
            this.setDataValue('key', val ? val.toUpperCase() : val);
          },
          validate: options.keyValidate
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
        }
      },
      {tableName: options.modelName});
    };
  };
};
