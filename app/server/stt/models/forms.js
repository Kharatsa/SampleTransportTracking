'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

/**
 * @typedef {Form}
 * @property {string} formId Unique ODK Aggregate form Id
 * @property {string} formName Name for the form
 */

/**
 * @typedef {FormModel}
 * @extends {Sequelize.Model}
 * @property {Form}
 */

const modelName = 'Forms';

const forms = modelwrapper({

  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          formId: {
            type: DataTypes.STRING,
            field: 'form_id',
            unique: true
          },
          formName: {
            type: DataTypes.STRING,
            field: 'form_name'
          }
        },
        {
          tableName: 'forms'
        });
    };
  }

});

module.exports = forms;
