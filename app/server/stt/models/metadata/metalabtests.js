'use strict';

const modelwrapper = require('app/server/storage/modelwrapper.js');
const metamodeltemplate = require('./metamodeltemplate.js');

const modelName = 'MetaLabTests';

const keyValidate = {is: /[A-Z0-9]{1,5}/};

const model = modelwrapper({
  name: modelName,
  import: metamodeltemplate({modelName, keyValidate})
});

module.exports = model;
