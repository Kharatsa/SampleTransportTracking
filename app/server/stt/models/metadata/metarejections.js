'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metamodeltemplate = require('./metamodeltemplate.js');

const modelName = 'MetaRejections';

const model = modelwrapper({
  name: modelName,
  import: metamodeltemplate({modelName})
});

module.exports = model;
