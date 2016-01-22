'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');

/**
 * @typedef {Form}
 * @property {string} formId Unique ODK Aggregate form Id
 * @property {string} formName Name for the form
 * @property {number} majorMinorVersion [description]
 * @property {number} version [description]
 * @property {string} hash [description]
 * @property {string} downloadUrl [description]
 * @property {string} manifestUrl [description]
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
          },
          majorMinorVersion: {
            type: DataTypes.INTEGER,
            field: 'major_minor_version'
          },
          version: {
            type: DataTypes.INTEGER,
            field: 'version'
          },
          hash: {
            type: DataTypes.STRING,
            field: 'hash'
          },
          downloadUrl: {
            type: DataTypes.STRING,
            field: 'download_url'
          },
          manifestUrl: {
            type: DataTypes.STRING,
            field: 'manifest_url'
          }
        },
        {
          tableName: 'forms'
        });
    };
  }

});

module.exports = forms;
