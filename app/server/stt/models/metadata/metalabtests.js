'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');

const modelName = 'MetaLabTests';

const keyValidate = {is: /[A-Z0-9]{1,5}/};

const model = modelwrapper({
  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(
        modelName,
        metaModelTemplate(DataTypes, {keyValidate}),
        {tableName: modelName});
    };
  }
});

module.exports = model;
