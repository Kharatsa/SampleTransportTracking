'use strict';

const path = require('path');
const fs = require('fs');
const BPromise = require('bluebird');
BPromise.promisifyAll(fs);
const log = require('app/server/util/logapp.js');
const csv = require('app/server/util/csv.js');
const storage = require('app/server/storage');
const dbresult = require('app/server/storage/dbresult.js');

const transform = (meta, type, keyProp, valueProp) => {
  return BPromise.map(meta, one => {
    let result = {type, valueType: 'string'};
    result.key = one[keyProp];
    result.value = one[valueProp];
    return result;
  });
};

const maybeCreate = meta => {
  const model = storage.models.Metadata;

  return storage.db.transaction({logging: false})
  .then(tran => {
    return BPromise.map(meta, incoming => {
      return model.findOrCreate({
        where: {type: incoming.type, key: incoming.key},
        defaults: incoming,
        transaction: tran,
        logging: false
      });
    })
    .map(dbresult.plain);
  });
};

const metapath = `${path.join(__dirname,
  '..', '..', 'assets', 'xforms', 'metadata'
)}`;
try {
  fs.statSync(metapath);
} catch (err) {
  log.error(`Cannot locate metadata folder at ${metapath}\n${err}`);
}

/**
 * [description]
 * @param  {!Object} options  [description]
 * @param {!string} options.filename [description]
 * @param {!string} options.key [description]
 * @param {!string} options.value [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
const metadata = BPromise.method((options) => {
  if (!(options && options.filename && options.type && options.key &&
      options.value)) {
    throw new Error('Missing required options parameter');
  }
  return fs.readFileAsync(path.join(metapath, options.filename), 'utf-8')
  .then(csv.parse)
  .then(parsed => transform(parsed, options.type, options.key, options.value))
  .then(maybeCreate);
});

module.exports = {
  metadata
};
