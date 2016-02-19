'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const log = require('app/server/util/logapp.js');
const dates = require('app/server/util/dates.js');
const datamerge = require('app/server/util/datamerge.js');

const metaField = {
  START_DATE: 'start',
  END_DATE: 'end',
  DEVICE_ID: 'deviceid',
  SIM_SERIAL: 'simserial',
  PERSON: 'person',
  REGION: 'region',
  FACILITY: 'facility'
};

// ODK Collect XForms form IDs (which match the top element names)
const formType = {
  SAMPLE_DEPARTURE: 'sdepart',
  SAMPLE_ARRIVAL: 'sarrive',
  RESULTS_DEPATURE: 'rdepart',
  RESULTS_ARRIVAL: 'rarrive'
};

// ODK Collect XForms element names
const REPEAT = 'srepeat';
const LAB_ID = 'labid';
const ST_ID = 'stid';
const ARTIFACT = 'stype';
const STATUS = 'condition';

// Deep object paths from the top element to target text
const FORM_TYPE_PATH = ['$', 'id'];
const END_DATE_PATH = ['end', 0];
const FACILITY_PATH = [metaField.FACILITY, 0];
const PERSON_PATH = [metaField.PERSON, 0];
const REGION_PATH = [metaField.REGION, 0];

// Deep object paths from the repeat element (i.e., REPEAT) to target text
const ST_ID_REPEAT_PATH = [ST_ID, 0];
const LAB_ID_REPEAT_PATH = [LAB_ID, 0];
const STATUS_REPEAT_PATH = [STATUS, 0];
const ARTIFACT_REPEAT_PATH = [ARTIFACT, 0];

// Other ODK Collect XForms constants
const RESULT_ARTIFACT_TYPE = 'form';
const DEFAULT_STATUS = 'ok';

const formElement = BPromise.method(parsed => {
  const form = _.values(formType).filter(type => {
    return !!parsed[type];
  });
  if (!(form && form[0])) {
    throw new Error(`Cannot identify form type among top elements:
                    ${Object.keys(parsed)}`);
  }
  return form[0];
});

const collectSubmission = xml => {
  log.debug('Transorming Lab Status XML', xml);
  const parse = xml2js.parseStringAsync(xml);
  const form = parse.then(formElement);
  return BPromise.join(parse, form, (parsed, formResult) => parsed[formResult]);
};

const repeats = form => BPromise.resolve(_.get(form, [REPEAT]));

const sampleIds = form => {
  return repeats(form)
  .map(repeat => ({
    stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
    labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null
  }))
  .then(results => _.uniqBy(results, ids => ids.stId + ids.labId));
};

/**
 * Gets the artifact type code from the parsed object, if available. When
 * unavailable, a default value is returned.
 *
 * @param  {Object} repeat [description]
 * @param  {string} form   [description]
 * @return {string}        [description]
 */
const getArtifact = (repeat, form) => {
  const artifact = _.get(repeat, ARTIFACT_REPEAT_PATH);
  // Results forms do not include artifacts (e.g., blood vials). In the
  // absense of these elements, a default artifact type is substituted.
  if (form === formType.RESULTS_DEPATURE || form === formType.RESULTS_ARRIVAL) {
    return RESULT_ARTIFACT_TYPE;
  } else if (!artifact) {
    throw new Error(`Missing artifact for ${form} submission`);
  }
  return artifact;
};

const upperCaseKey = key => key ? key.toUpperCase() : key;

const artifacts = form => {
  const type = _.get(form, FORM_TYPE_PATH);

  return repeats(form)
  .map(repeat => ({
    stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
    labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null,
    artifactType: upperCaseKey(getArtifact(repeat, type))
  }))
  .then(results => _.uniqBy(results,
    item => item.artifactType + item.stId + item.labId
  ));
};

const changes = form => {
  const commonProps = BPromise.props({
    type: _.get(form, FORM_TYPE_PATH),
    statusDate: dates.parseXMLDate(_.get(form, END_DATE_PATH)),
    stage: _.get(form, FORM_TYPE_PATH),
    person: upperCaseKey(_.get(form, PERSON_PATH)),
    region: upperCaseKey(_.get(form, REGION_PATH)),
    facility: upperCaseKey(_.get(form, FACILITY_PATH))
  });

  return BPromise.join(commonProps, repeats(form), (common, repeatEls) =>
    BPromise.map(repeatEls, repeat => ({
      stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
      labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null,
      statusDate: common.statusDate,
      stage: common.stage,
      artifactType: upperCaseKey(getArtifact(repeat, common.type)),
      // artifactType: upperCaseKey(_.get(repeat, ARTIFACT_REPEAT_PATH)),
      region: common.region,
      facility: common.facility,
      person: common.person,
      status: upperCaseKey(_.get(repeat, STATUS_REPEAT_PATH, DEFAULT_STATUS))
    }))
  );
};

/**
 * Replaces the stId/labId value pair with the corresponding sampleId reference
 * (uuid).
 *
 * @method [fillSampleIdRefs]
 * @param {Array.<Object>} artifacts [description]
 * @param {Array.<Object>} sampleIds [description]
 * @return {Array.<Object>}          Array of artifacts with sampleId uuids
 */
const fillSampleIdRefs = BPromise.method((artifacts, sampleIds) => {
  if (!sampleIds) {
    throw new Error('Missing required parameter sampleIds');
  }
  if (!_.every(sampleIds, sampleId => !!sampleId.uuid)) {
    throw new Error('Missing required sampleIds uuid');
  }

  const mapStIds = datamerge.propKeyReduce(sampleIds, ['stId']);
  const mapLabIds = datamerge.propKeyReduce(sampleIds, ['labId']);

  return BPromise.join(mapStIds, mapLabIds)
  .spread((stIdMapper, labIdMapper) => {
    return BPromise.map(artifacts, artifact => {
      const id = artifact.stId || artifact.labId;
      const sampleId = stIdMapper[id] || labIdMapper[id];
      return Object.assign({},
        _.omit(artifact, ['stId', 'labId']),
        {sampleId: sampleId.uuid}
      );
    });
  });
});

/**
 * Replaces the stId/labId value pair with the corresponding sampleId reference
 * (uuid). Using this sample reference, this function replaces the artifactType
 * value with the correct artifact reference (uuid).
 *
 * @param  {Array.<Object>} changes   [description]
 * @param  {Array.<Object>} sampleIds [description]
 * @param  {Array.<Object>} artifacts [description]
 * @return {Array.<Object>}           Array of changes with artifact uuids
 */
const fillArtifactRefs = (changes, sampleIds, artifacts) => {
  // Lookup samples by the STT IDs
  const mapStIds = datamerge.propKeyReduce(sampleIds, ['stId']);
  const mapLabIds = datamerge.propKeyReduce(sampleIds, ['labId']);

  // Lookup artifacts by sampleId (uuid) and artifactType (metadata key)
  const mapArtifacts = datamerge.propKeyReduce(
    artifacts, ['sampleId', 'artifactType']
  );

  return BPromise.join(mapStIds, mapLabIds, mapArtifacts)
  .spread((stIdMapper, labIdMapper, artifactMapper) => {
    return BPromise.map(changes, change => {
      const id = change.stId || change.labId;
      const sampleId = stIdMapper[id] || labIdMapper[id];
      const artifactsByType = artifactMapper[sampleId.uuid];
      const artifact = artifactsByType[change.artifactType];
      return Object.assign({},
        // Change objects should not include stId, labId, and artifactType
        // values. Instead, each change holds a reference to an artifact (by
        // uuid), which in turn holds a reference to a sample (by uuid)
        _.omit(change, ['stId', 'labId', 'artifactType']),
        {artifact: artifact.uuid}
      );
    });
  });
};

module.exports = {
  collectSubmission,
  sampleIds,
  artifacts,
  changes,
  fillSampleIdRefs,
  fillArtifactRefs
};
