'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

/**
 * @typedef {Metadata}
 * @property {string} type [description]
 * @property {string} key [description]
 * @property {string} value [description]
 * @property {string} valueLabel [description]
 * @property {string} valueType [description]
 */

/**
 * @typedef {MetadataModel}
 * @extends {Sequelize.Model}
 * @property {Metadata}
 */

/**
 * Converts a string value to the specified type.
 *
 * @param  {string} value The value as a string
 * @param  {string} type  The data type
 * @return {boolean|string|float|integer|Object|Date} The converted value
 */
function convertFromString(value, type) {
  if (type === 'string') {
    return value;
  } else if (value === 'null') {
    return null;
  } else if (value === 'undefined') {
    return undefined;
  } else if (type === 'integer') {
    return Number.parseInt(value);
  } else if (type === 'float') {
    return Number.parseFloat(value);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'object') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  } else if (type === 'date') {
    return new Date(value);
  }
  return value;
}

function convertToString(value, type) {
  if (type === 'object') {
    return JSON.stringify(value);
  }
  return value + '';
}

const METADATA_TYPES = [
  'artifact',
  'status',
  'person',
  'facility',
  'region',
  'labtest',
  'rejection'
];

const VALUE_DATA_TYPES = [
  'string', 'boolean', 'float', 'integer', 'object', 'date'
];

const modelName = 'Metadata';

const metadata = modelwrapper({

  name: modelName,

  references: [],

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          type: {
            type: DataTypes.ENUM,
            values: METADATA_TYPES,
            allowNull: false
          },
          key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            set: function(val) {this.setDataValue('key', val.toUpperCase());}
          },
          value: {
            type: DataTypes.STRING,
            allowNull: true,
            get: function()  {
              var dataType = this.getDataValue('valueType');
              return convertFromString(this.getDataValue('value'), dataType);
            },
            set: function(val) {
              var dataType = this.getDataValue('valueType');
              this.setDataValue('value',
                convertToString(val, dataType)
              );
            }
          },
          valueType: {
            type: DataTypes.ENUM,
            values: VALUE_DATA_TYPES,
            allowNull: false,
            defaultValue: 'string'
          }
        },
        {
          indexes: [{name: 'metaPair', unique: true, fields: ['type', 'key']}],
          instanceMethods: {
            normalized: function() {
              return {
                id: this.getDataValue('id'),
                type: this.getDataValue('type'),
                key: this.getDataValue('key'),
                value: this.getDataValue('value'),
                createdAt: this.getDataValue('createdAt'),
                updatedAt: this.getDataValue('updatedAt')
              };
            }
          }
        });
    };
  }

});

module.exports = metadata;
