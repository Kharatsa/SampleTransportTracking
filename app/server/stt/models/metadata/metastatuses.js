'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metamodeltemplate = require('./metamodeltemplate.js');

const modelName = 'MetaStatuses';

const model = modelwrapper({
  name: modelName,
  import: metamodeltemplate({modelName})
});

module.exports = model;
