'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');

// Pairs of workflow stages between which turn around time (TAT) should be
// calculated.
const TAT_STAGE_PAIRS = [
  {from: {stage: 'SDEPART'}, to:  {stage: 'SARRIVE'}},
  {from: {stage: 'SARRIVE'}, to:  {stage: 'LABSTATUS', status: 'REQ'}},
  {from: {stage: 'SARRIVE'}, to:  {stage: 'LABSTATUS', status: 'REQ'}},
  {
    from: {stage: 'LABSTATUS', status: 'REQ'},
    to:  {stage: 'LABSTATUS', status: 'RVW'}
  },
  {
    from: {stage: 'LABSTATUS', status: 'RVW'},
    to:  {stage: 'LABSTATUS', status: 'PRT'}
  },
  {from: {stage: 'LABSTATUS', status: 'PRT'}, to:  {stage: 'RDEPART'}},
  {from: {stage: 'RDEPART'}, to:  {stage: 'RARRIVE'}},
  {from: {stage: 'SDEPART'}, to:  {stage: 'RARRIVE'}}
];

/**
 * Online arithmetic mean.
 *
 * @param  {number} average      [description]
 * @param  {number} averageCount [description]
 * @param  {number} nextValue    [description]
 * @return {number}              [description]
 */
const updateAverage = (average, averageCount, nextValue) => {
  if (averageCount < 0) {
    throw new Error('Invalid update average parameters');
  } else if (averageCount > 1) {
    return ((average * averageCount) + nextValue) / (averageCount + 1);
  } else if (averageCount === 1) {
    return nextValue;
  }
  return average;
};

/**
 * Extracts changeFirstDate values from the source object when the stagePair
 * attributes are present in the source.
 *
 * @param  {Object} source
 * @param  {Object} stagePair
 * @return {string}           The Change statusDate as a string
 */
const stageDate = (source, stagePair) => {
  const stageName = stagePair.stage;
  const statusName = stagePair.status;
  if (typeof statusName !== 'undefined' && source[stageName] &&
      source[stageName][statusName]) {
    return source[stageName][statusName].changeFirstDate;
  } else if (source[stageName]) {
    return source[stageName].changeFirstDate;
  }
  return null;
};

/**
 * Calculates the difference, in milliseconds, between 2 dates.
 *
 * @param  {string} startDate
 * @param  {string} endDate
 * @return {number}
 */
const calculateTAT = (startDate, endDate) => (
  new Date(endDate).valueOf() - new Date(startDate).valueOf());

/**
 * Given a measures object, representing the time taken for samples to cross
 * between a pair of stages in the workflow, and new SampleIds dates for the
 * same pair of workflow stages, update the TAT measures for that set of stages.
 *
 * @param  {Object} measures The TAT measures for a set of stages
 * @param  {Object} result   The times a given Sample first covered the same
 *                           set of stages.
 * @return {Object}          Updated measures Object
 */
const updateTATMeasures = (measures, result) => {
  if (result.toStageStatusDate && result.fromStageStatusDate) {

    const tat = calculateTAT(result.fromStageStatusDate,
      result.toStageStatusDate);

    // Update the running average TAT for this stage-pair
    measures.samplesIdsAvgTATms = updateAverage(
      measures.samplesIdsAvgTATms,
      measures.sampleIdsCount,
      tat
    );

    measures.turnArounds.push(result);
    measures.sampleIdsCount += 1;

  }
  return measures;
};

const calculateOneTAT = (stagePair, data) => {
  let measures = {
    sampleIdsCount: 0,
    samplesIdsAvgTATms: null,
    turnArounds: []
  };

  if (_.isEmpty(data)) {
    return measures;
  }
  const attrs = Object.keys(data);

  // Iterate through every SampleIds UUID to incorporate its stage pair timings
  return BPromise.map(attrs, attr => ({sampleId: attr, stages: data[attr]}))
  .map(item => {
    const fromStageStatusDate = stageDate(item.stages, stagePair.from);
    const toStageStatusDate = (
      fromStageStatusDate ?
      stageDate(item.stages, stagePair.to) :
      null
    );
    return {sampleId: item.sampleId, fromStageStatusDate, toStageStatusDate};
  })
  .reduce((reduced, item) => {
    return updateTATMeasures(reduced, item);
  }, measures);
};

/**
 * Translates the SampleId workflow statusDate raw query results into a
 * consolidated report of turnaround time for a collection of workflow stage
 * pairs. A pair of stages, and the TAT measures calculated by this module,
 * represent the time a SampleId spent traversing "from" one stage "to" another.
 *
 * @param  {Object} data
 * @return {Array.<Object>}
 */
const calculateTATs = data => {
  log.debug('Calculating TAT');
  return BPromise.map(TAT_STAGE_PAIRS, stagePair =>
    Object.assign({}, stagePair)
  )
  .map(stagePair =>
    calculateOneTAT(stagePair, data)
    .then(result => Object.assign({}, stagePair, result))
  )
  .tap(() => log.debug('Finished computing TAT'));
};

module.exports = {calculateTATs};
