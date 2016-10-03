/**
 * Constants representing key aspects of the STT workflow. These variables
 * should be used in view, reducer, selector, and normalize logic, rather than
 * referencing these constant values directly, so these may be maintained
 * more sensibly in the future.
 */

const SCAN_STAGES = {
  SAMPLE_PICKUP: 'SDEPART',
  SAMPLE_DELIVERY: 'SARRIVE',
  RESULT_PICKUP: 'RDEPART',
  RESULT_DELIVERY: 'RARRIVE'
};

const SCAN_STAGES_ORDER = [
  SCAN_STAGES.SAMPLE_PICKUP, SCAN_STAGES.SAMPLE_DELIVERY,
  SCAN_STAGES.RESULT_PICKUP, SCAN_STAGES.RESULT_DELIVERY
];

const isScanStage = stage => {
  return (
    stage === SCAN_STAGES.SAMPLE_PICKUP ||
    stage === SCAN_STAGES.SAMPLE_DELIVERY ||
    stage === SCAN_STAGES.RESULT_PICKUP ||
    stage === SCAN_STAGES.RESULT_DELIVERY
  );
};

const isRequestScanStage = stage => {
  return (
    stage === SCAN_STAGES.SAMPLE_PICKUP ||
    stage === SCAN_STAGES.SAMPLE_DELIVERY
  );
};

const SCAN_ARTIFACTS = {
  REQUEST_FORM: 'REQUEST',
  BLOOD: 'BLOOD',
  SPUTUM: 'SPUTUM',
  URINE: 'URINE',
  DRIED_BLOOD: 'DBS',
  RESULT_FORM: 'RESULT'
};

const REQUEST_SCAN_ARTIFACTS = {
  REQUEST_FORM: 'REQUEST',
  BLOOD: 'BLOOD',
  SPUTUM: 'SPUTUM',
  URINE: 'URINE',
  DRIED_BLOOD: 'DBS'
};

const isResultScanStage = stage => {
  return (
    stage === SCAN_STAGES.RESULT_PICKUP ||
    stage === SCAN_STAGES.RESULT_DELIVERY
  );
};

const RESULT_SCAN_ARTIFACTS = {
  RESULT_FORM: 'RESULT'
};

const LAB_STAGES = {TESTING: 'LABSTATUS'};

const LAB_STAGES_ORDER = [LAB_STAGES.TESTING];

const isLabStage = stage => stage === LAB_STAGES.TESTING;

const WORKFLOW_STAGES_ORDER = [
  SCAN_STAGES.SAMPLE_PICKUP, SCAN_STAGES.SAMPLE_DELIVERY,
  LAB_STAGES.TESTING,
  SCAN_STAGES.RESULT_PICKUP, SCAN_STAGES.RESULT_DELIVERY
];

const SCAN_STATUSES = {GOOD: 'OK', BAD: 'BAD'};

const isScanStatus = status =>
  (status === SCAN_STATUSES.GOOD || status === SCAN_STATUSES.BAD);

const isProblemScan = status => status === SCAN_STATUSES.GOOD;

/**
 * Sample Transport Tracking lab test statuses
 * @readonly
 * @enum {string}
 */
const LAB_STATUSES = {
  REQUESTED: 'REQ',
  REVIEWED: 'RVW',
  REFERRED: 'REF',
  REJECTED: 'REJ',
  DELETED: 'DEL', // not intended to be exposed on the client/dashboard
  PRINTED: 'PRT'
};

// Represents only basic statuses, excluding special cases (i.e., referrals)
// and exceptions (i.e., rejections)
const LAB_STATUSES_ORDER = [
  LAB_STATUSES.REQUESTED,
  LAB_STATUSES.REVIEWED,
  LAB_STATUSES.PRINTED
];

const isLabStatus = status => !isScanStatus(status);

const isRejectedTest = status => status === LAB_STATUSES.REJECTED;

const META_TYPES = {
  ARTIFACTS: 'artifacts',
  FACILITIES: 'facilities',
  PEOPLE: 'people',
  LABS: 'labs',
  TESTS: 'labtests',
  REJECTIONS: 'labrejections',
  STATUSES: 'statuses',
  STAGES: 'stages',
};

const META_TYPES_ORDER = [
  META_TYPES.ARTIFACTS, META_TYPES.FACILITIES, META_TYPES.PEOPLE,
  META_TYPES.LABS, META_TYPES.TESTS, META_TYPES.REJECTIONS,
  META_TYPES.REJECTIONS, META_TYPES.STATUSES, META_TYPES.STAGES,
];

module.exports = {
  SCAN_STAGES,
  SCAN_STAGES_ORDER,
  SCAN_ARTIFACTS,
  REQUEST_SCAN_ARTIFACTS,
  RESULT_SCAN_ARTIFACTS,
  SCAN_STATUSES,
  LAB_STAGES,
  LAB_STAGES_ORDER,
  LAB_STATUSES,
  LAB_STATUSES_ORDER,
  WORKFLOW_STAGES_ORDER,
  isScanStage,
  isScanStatus,
  isRequestScanStage,
  isResultScanStage,
  isLabStage,
  isProblemScan,
  isLabStatus,
  isRejectedTest,
  META_TYPES,
  META_TYPES_ORDER,
};
