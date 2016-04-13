'use strict';

const BPromise = require('bluebird');
const queryutils = require('server/storage/queryutils.js');

/**
 * [description]
 * @method artfactsTypes
 * @param  {Array.<Object>} artifacts [description]
 * @return {Promise.<Object>}           [description]
 */
const typesAndSampleIds = queryutils.requireProps(['artifactType', 'sampleId'],
  artifacts => BPromise.map(artifacts, item =>
    ({$and: [{artifactType: item.artifactType}, {sampleId: item.sampleId}]})
  )
  .then(queryutils.wrapOr)
);

module.exports = {
  typesAndSampleIds
};
