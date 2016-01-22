'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

/**
 * An object holding the identifiers for and type of a sample.
 *
 * @typedef {Object} Sample
 * @property {!string} stId - The sample tracking Id
 * @property {?string} labId - The sample lab Id (if available)
 * @property {string} type - The type of sample
 */

/**
 * @typedef {SampleModel}
 * @extends {Sequelize.Model}
 * @property {Sample} sample {@link Sample} object properties
 */

const modelName = 'Samples';

const samples = modelwrapper({

  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          stId: {
            type: DataTypes.STRING,
            field: 'st_id',
            unique: true
          },
          labId: {
            type: DataTypes.STRING,
            field: 'lab_id',
            unique: true
          },
          type: {
            type: DataTypes.STRING,
            field: 'type'
          }
        },
        {
          tableName: 'samples',
          indexes: [
            {name: 'id_pair', unique: true, fields: ['st_id', 'lab_id']}
          ]
        });
    };
  }

});

module.exports = samples;
