'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metamodeltemplate = require('./metamodeltemplate.js');

const modelName = 'MetaPeople';

const model = modelwrapper({
  name: modelName,
  import: metamodeltemplate({modelName})
});

module.exports = model;
