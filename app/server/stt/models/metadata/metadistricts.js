'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metaModelTemplate = require('./metamodeltemplate.js');

const modelName = 'MetaDistricts';

const keyValidate = {is: /[A-Z]{1,5}/};

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
