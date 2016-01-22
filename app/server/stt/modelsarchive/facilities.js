'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

/**
 * A sample tracking facility
 *
 * @typedef {Facility}
 * @property {string} name - The facility key/Id
 * @property {string} region - The region key/Id
 * @property {string} type - The facility type
 */

/**
 * @typedef {FacilityModel}
 * @extends {Sequelize.Model}
 * @property {Facility} facility {@link Facility} object properties
 */

const modelName = 'Facilities';

const facilities = modelwrapper({

  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          name: {
            type: DataTypes.STRING,
            field: 'name',
            unique: true
          },
          region: {
            type: DataTypes.STRING,
            field: 'region'
          },
          type: {
            type: DataTypes.STRING,
            field: 'type'
          }
        },
        {
          tableName: 'facilities'
        });
    };
  }

});

module.exports = facilities;
