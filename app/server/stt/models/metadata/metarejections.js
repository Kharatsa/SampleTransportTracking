'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');

const modelName = 'MetaRejections';

const model = modelwrapper({
  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(
        modelName,
        metaModelTemplate(DataTypes),
        {tableName: modelName});
    };
  }
});

module.exports = model;
