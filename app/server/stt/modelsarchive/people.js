'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

/**
 * @typedef {Person}
 * @property {string} name - The person key/Id
 */

/**
 * @typedef {PersonModel}
 * @extends {Sequelize.Model}
 * @property {Person}
 */

const modelName = 'People';

const people = modelwrapper({

  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define('People',
        {
          name: {
            type: DataTypes.STRING,
            field: 'name'
          },
          type: {
            type: DataTypes.STRING,
            field: 'type',
            defaultValue: 'rider'
          }
        },
        {
          tableName: 'people'
        });
    };
  }

});

module.exports = people;
