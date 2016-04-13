'use strict';

const log = require('server/util/logapp.js');
const aggregate = require('server/odk/aggregateapi.js');

const submit = submission => {
  return aggregate.makeSubmission(submission)
  .spread((odkRes, body) => {
    const resMessage = `${odkRes.statusCode} - ${odkRes.statusMessage}`;
    if (odkRes.statusCode === 201 || odkRes.statusCode === 202) {
      log.info(`Successful ODK lab status submission: ${resMessage}`);
    } else {
      log.error(`Error with ODK lab status submission: ${resMessage}`);
      log.error(body);
    }
    return body;
  })
  .catch(err => {
    log.error(`Aggregate submission failed - ${err.message}\n${err.stack}`);
  });
};

module.exports = {
  submit
};
