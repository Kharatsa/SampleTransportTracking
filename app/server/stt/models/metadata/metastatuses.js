'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');

const modelName = 'MetaStatuses';

const model = modelwrapper({
  name: modelName,

  // import: metamodeltemplate({modelName})
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
