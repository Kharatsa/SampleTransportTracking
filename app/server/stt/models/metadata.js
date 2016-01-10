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
 * @return {boolean|string|float|integer|object|Date} The converted value
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
  } else if ( type === 'date') {
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
  'stype',
  'condition',
  'person',
  'facility',
  'region',
  'labtest',
  'labstatus',
  'labreject'
];

const VALUE_DATA_TYPES = [
  'string', 'boolean', 'float', 'integer', 'object', 'date'
];

const modelName = 'Metadata';

const metadata = modelwrapper({

  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          type: {
            type: DataTypes.ENUM,
            values: METADATA_TYPES,
            allowNull: false,
            unique: 'metadataKey',
            field: 'type'
          },
          key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'metadataKey',
            field: 'key'
          },
          value: {
            type: DataTypes.STRING,
            field: 'value',
            allowNull: false,
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
          valueLabel: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'value_label'
          },
          valueType: {
            type: DataTypes.ENUM,
            values: VALUE_DATA_TYPES,
            allowNull: false,
            field: 'value_type'
          }
        },
        {
          tableName: 'stt_metadata'
        });
    };
  }

});

module.exports = metadata;
