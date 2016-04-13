'use strict';

/*eslint-disable no-console */

/**
 * Utility to log the ODK collect parser results to the console for debugging
 * purposes
 */

const path = require('path');
const fs = require('fs');
const Bluebird = require('bluebird');
const readFileAsync = Bluebird.promisify(fs.readFile);
const transform = require('server/odk/collect/collecttransform.js');

const basePath = path.join(__dirname, '..', 'data');
const filenames = [
  'sdepart1.xml',
  'sdepart2.xml',
  'sarrive1.xml',
  'rdepart1.xml',
  'rarrive1.xml',
  'rarrive2.xml'
];

const resultLog = result => console.dir(result, {depth: 5});

Bluebird.each(filenames, filename => {
  const filePath = path.join(basePath, filename);
  console.log(`\n\n${filePath}\n\n`);
  return readFileAsync(filePath, 'utf-8')
  .then(transform.collectSubmission)
  .tap(parsed => {
    return transform.sampleIds(parsed)
    .then(resultLog);
  })
  .tap(parsed => {
    return transform.artifacts(parsed)
    .then(resultLog);
  })
  .tap(parsed => {
    return transform.changes(parsed)
    .then(resultLog);
  })
  .then(() => console.log('DONE\n\n'));
});
