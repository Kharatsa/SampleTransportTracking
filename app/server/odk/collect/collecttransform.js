'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
// const xmlBuilder = new xml2js.Builder({renderOpts: {pretty: false}});
const log = require('app/server/util/logapp.js');
// const string = require('app/common/string.js');
const datamerge = require('app/server/util/datamerge.js');
const datatransform = require('app/server/util/datatransform.js');
// const datamerge = require('app/server/util/datamerge.js');
// const firstText = datatransform.firstText;

// TODO: remove
// const DEBUG = (message, value) => {
//   if (process.env.NODE_ENV === 'test') {
//     console.log(`DEBUG ${message}`);
//     console.dir(value, {depth: 10});
//   }
// };

const metaField = {
  START_DATE: 'start',
  END_DATE: 'end',
  DEVICE_ID: 'deviceid',
  SIM_SERIAL: 'simserial',
  PERSON: 'person',
  REGION: 'region',
  FACILITY: 'facility'
};

const formType = {
  SAMPLE_DEPARTURE: 'sdepart',
  SAMPLE_ARRIVAL: 'sarrive',
  RESULTS_DEPATURE: 'redepart',
  RESULTS_ARRIVAL: 'rarrive'
};

const REPEAT = 'srepeat';
const LAB_ID = 'labid';
const ST_ID = 'stid';
const ARTIFACT = 'stype';
const STATUS = 'condition';

const formElement = BPromise.method(parsed => {
  const form = _.values(formType).filter(type => !!parsed[type]);
  if (!(form || form[0])) {
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

const ST_ID_REPEAT_PATH = [ST_ID, 0];
const LAB_ID_REPEAT_PATH = [LAB_ID, 0];

const sampleIds = form => (
  repeats(form)
  .map(repeat => ({
    stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
    labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null
  }))
  .then(results => _.uniqBy(results, ids => ids.stId))
);

const FACILITY_PATH = [metaField.FACILITY, '0'];
const PERSON_PATH = [metaField.PERSON, '0'];
const REGION_PATH = [metaField.REGION, '0'];
const STATUS_REPEAT_PATH = [STATUS, '0'];
const ARTIFACT_REPEAT_PATH = [ARTIFACT, '0'];

const metadata = form => {
  const repeatEl = repeats(form);

  const facilityMeta = datatransform.oneMeta(
    form, 'facility', FACILITY_PATH, null
  );
  const personMeta = datatransform.oneMeta(form, 'person', PERSON_PATH, null);
  const regionMeta = datatransform.oneMeta(form, 'region', REGION_PATH, null);
  const statusMeta = repeatEl.map(repeat =>
    datatransform.oneMeta(repeat, 'status', STATUS_REPEAT_PATH, null)
  );
  const artifactMeta = repeatEl.map(repeat =>
    datatransform.oneMeta(repeat, 'artifact', ARTIFACT_REPEAT_PATH, null)
  );

  return BPromise.join(
    facilityMeta, personMeta, regionMeta, statusMeta, artifactMeta
  )
  .then(_.flatten)
  .then(results => _.uniqBy(results, meta => meta.key))
  .filter(item => item !== null);
};

const artifacts = form => (
  repeats(form)
  .map(repeat => ({
    stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
    labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null,
    artifactType: _.get(repeat, ARTIFACT_REPEAT_PATH)
  }))
  .then(results => _.uniqBy(results, artifact => artifact.artifactType))
);

const TIMEZONE_PARTIAL_PATTERN = /-\d{2}$/;
const parseDate = value => {
  if (value.search(TIMEZONE_PARTIAL_PATTERN) === -1) {
    return new Date(value);
  }
  return new Date(value + ':00');
};

const FORM_TYPE_PATH = ['$', 'id'];
const END_DATE_PATH = ['end', 0];

const changes = form => {
  const commonProps = BPromise.props({
    statusDate: parseDate(_.get(form, END_DATE_PATH)),
    stage: _.get(form, FORM_TYPE_PATH),
    person: _.get(form, PERSON_PATH),
    region: _.get(form, REGION_PATH),
    facility: _.get(form, FACILITY_PATH)
  });

  return BPromise.join(commonProps, repeats(form), (common, repeatEls) =>
    BPromise.map(repeatEls, repeat => ({
      stId: _.get(repeat, ST_ID_REPEAT_PATH),
      labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null,
      statusDate: common.statusDate,
      stage: common.stage,
      artifactType: _.get(repeat, ARTIFACT_REPEAT_PATH),
      region: common.region,
      facility: common.facility,
      person: common.person,
      status: _.get(repeat, STATUS_REPEAT_PATH)
    }))
  );
};

const fillSampleIdRefs = BPromise.method((artifacts, sampleIds) => {
  if (!sampleIds) {
    throw new Error('Missing required parameter sampleIds');
  }
  if (!_.every(sampleIds, sampleId => !!sampleId.uuid)) {
    throw new Error('Missing required sampleIds uuid');
  }
  // const sampleIdsMap = datamerge.propKeyReduce(sampleIds, ['stId']);
  return datamerge.propKeyReduce(sampleIds, ['stId'])
  .then(idMap => {
    // console.log('idMap');
    // console.dir(idMap, {depth: 10});
    return BPromise.map(artifacts, artifact => {
      const sampleMatch = idMap[artifact.stId];
      // console.log('artifact for match');
      // console.dir(artifact, {depth: 10});
      // console.log('sampleMatch', sampleMatch);
      // console.dir(sampleMatch, {depth: 10});
      return Object.assign({},
        // artifact,
        _.omit(artifact, ['stId', 'labId']),
        {sampleId: sampleMatch.uuid}
      );
    });
  });
});

// const artifactTypeRef = BPromise.method((artifactType, artifactMap) => {
//   const artifactTypeRef = (
//     artifactMap[artifactType] ?
//     artifactMap[artifactType].uuid :
//     null
//   );
//   if (!artifactTypeRef) {
//     throw new Error(`Missing artifact reference for test type
//                     "${artifactType}"`);
//   }
//   return {artifactType: artifactTypeRef};
// });

const fillArtifactRefs = (changes, sampleIds, artifacts) => {
  // create map stId -> sampleIds (get uuid for sampleIdRef)
  // create map like sampleRef -> artifactType -> artifact
  const mapSamples = datamerge.propKeyReduce(sampleIds, ['stId']);
  // map of sampleId (uuid ref) --> artifact
  const mapArtifacts = datamerge.propKeyReduce(
    artifacts, ['sampleId', 'artifactType']
  );
  return BPromise.join(mapSamples, mapArtifacts)
  .spread((smapper, amapper) => {
    // console.log('sample ids mapper');
    // console.dir(smapper, {depth: 10});
    // console.log('artifacts mapper');
    // console.dir(amapper, {depth: 10});

    return BPromise.map(changes, change => {
      // console.log('change for match');
      // console.dir(change, {depth: 10});
      const sampleIdRef = smapper[change.stId];
      // console.log('change sampleIdRef', sampleIdRef);
      const artifactRef = amapper[sampleIdRef.uuid][change.artifactType];
      // console.log('change artifactRef', artifactRef);
      return Object.assign({},
        _.omit(change, ['stId', 'labId', 'artifactType']),
        {artifact: artifactRef.uuid}
      );
    });
    // TODO
  });
  // const mapArtifacts = mapSamples.then(mapper => );
  // return datamerge.propKeyReduce(artifacts, ['artifactType'])
  // .then(mapper => BPromise.map(change =>
  //   BPromise.join(change, artifactTypeRef(change.))
  // ))
};

module.exports = {
  collectSubmission,
  sampleIds,
  metadata,
  artifacts,
  changes,
  fillSampleIdRefs,
  fillArtifactRefs
};
