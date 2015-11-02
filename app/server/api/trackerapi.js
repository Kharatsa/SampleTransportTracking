'use strict';

const log = require('app/server/util/log.js');

function TrackerClient(dbClient) {
  log.debug('Creating TrackerClient');
  this.dbClient = dbClient;
}

// Resources
//  Samples
//  Events

// Event endpoints
//  params:
//    * last location
//    * origin location
//    * created location
//    * created time
//    * updated time
//    * last status
//    * complete/incomplete/rejected
//  * Oldest incomplete (created time)
//  * Newest (created time)
//  * Rejected
// Samples
//  * All events

TrackerClient.prototype.mostReventEvents = function(id) {
  log.info('Fetching events for id', id);
  // TODO
};

module.exports = TrackerClient;
