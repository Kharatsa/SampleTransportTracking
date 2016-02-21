'use strict';
const crypto = require('crypto');
const BPromise = require('bluebird');

// via https://gist.github.com/LinusU/9a9fd1aff7efb129e513#file-uuid-v5-js-L3
const uuidV5 = data => {
  return new BPromise(resolve => {
    let out = crypto.createHash('sha1').update(data).digest();

    out[8] = out[8] & 0x3f | 0xa0; // set variant
    out[6] = out[6] & 0x0f | 0x50; // set version

    const hex = out.toString('hex', 0, 16);

    return resolve([
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-'));
  });
};

module.exports = {
  uuidV5
};
