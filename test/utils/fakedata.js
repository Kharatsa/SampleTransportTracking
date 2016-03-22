'use strict';

const config = require('app/config');
const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
storage.init({config: config.db});
const sttmodels = require('app/server/stt/models');
storage.loadModels(sttmodels);
const testmeta = require('./testmeta.js');

const FAKE_SAMPLES_NUM = 500;
const FAKE_ARTIFACTS_NUM = 1500;
const FAKE_TESTS_NUM = 2000;
const FAKE_CHANGES_NUM = 5000;

const makeUUID = () => {
  // http://www.ietf.org/rfc/rfc4122.txt
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  return 'FAKE' + s.slice(4, s.length).join('');
};

const getRandomInt = length => Math.floor(Math.random() * (length));

const makeRandomString = (possible, numChars) => {
  let result = [];

  for (let i = 0; i < numChars; i++) {
    result.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  return result.join('');
};

const makeStId = () => {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return makeRandomString(possible, 10);
};

const makeLabId = () => {
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numbers = '0123456789';
  return makeRandomString(letters, 3) + makeRandomString(numbers, 7);
};

const makeSample = () => ({
  uuid: makeUUID(),
  stId: makeStId(),
  labId: makeLabId()
});

const fakeSamples = num => {
  let samples = [];
  let samplesById = {};

  for (let i = 0; i < num; i++) {
    let sample = makeSample();
    samples.push(sample);
    samplesById[sample.uuid] = sample;
  }

  return {samples,  samplesById};
};

const makeArtifact = (sample, type) => ({
  uuid: makeUUID(),
  sampleId: sample.uuid,
  artifactType: type
});

const fakeArtifacts = (num, samples, types) => {
  let artifacts = [];
  let artifactsById = {};

  for (let i = 0; i < num; i++) {
    let sample = samples[getRandomInt(samples.length)];
    let type = types[getRandomInt(types.length)];
    let artifact = makeArtifact(sample, type);
    artifacts.push(artifact);
    artifactsById[artifact.uuid] = artifact;
  }

  return {artifacts,  artifactsById};
};

const makeTest = (sample, type) => ({
  uuid: makeUUID(),
  sampleId: sample.uuid,
  testType: type
});

const fakeTests = (num, samples, types) => {
  let tests = [];
  let testsById = {};

  for (let i = 0; i < num; i++) {
    let sample = samples[getRandomInt(samples.length)];
    let type = types[getRandomInt(types.length)];
    let test = makeTest(sample, type);
    tests.push(test);
    testsById[test.uuid] = test;
  }

  return {tests, testsById};
};

const MILLIS_PER_YEAR = 31536000000;

const makeDate = () => {
  return new Date(Date.now() - getRandomInt(MILLIS_PER_YEAR * 5)).toISOString();
};

const makeChange = (
  artifact, test, facility, person, status, labRejection, stage
) => {
  return ({
    uuid: makeUUID(),
    statusDate: makeDate(),
    stage: stage,
    artifact: artifact ? artifact.uuid : null,
    labTest: test ? test.uuid : null,
    facility: facility ? facility.key : null,
    person: person ? person.key : null,
    status: status ? status.key :  null,
    labRejection: labRejection ? labRejection.key : null
  });
};

const fakeChanges = (num, artifacts, tests, meta) => {
  let changes = [];

  for (let i = 0; i < num; i++) {
    const facility = meta.facility[getRandomInt(meta.facility.length)];
    const stage = meta.stage[getRandomInt(meta.stage.length)].key;
    const status = meta.status[getRandomInt(meta.status.length)];

    let test = null;
    let artifact = null;
    let person = null;
    let rejection = null;

    if (stage !== 'LABSTATUS') {
      artifact = artifacts[getRandomInt(artifacts.length)];
      person = meta.person[getRandomInt(meta.person.length)];
    } else {
      test = tests[getRandomInt(tests.length)];
      if (status !== 'OK') {
        rejection = meta.rejection[getRandomInt(meta.rejection.length)];
      }
    }

    let change = makeChange(
      artifact, test, facility, person, status, rejection, stage
    );
    changes.push(change);
  }

  return changes;
};

const make = () => {
  return testmeta.load()
  .then(() => {
    const meta = {
      artifact: testmeta.metaArtifacts,
      labtest: testmeta.metaLabTests,
      facility: testmeta.metaFacilities,
      region: testmeta.metaRegions,
      status: testmeta.metaStatuses,
      rejection: testmeta.metaRejections,
      person: testmeta.metaPeople,
      stage: testmeta.metaStages
    };

    const fSamples = fakeSamples(FAKE_SAMPLES_NUM);

    const artifactTypes = meta.artifact.map(meta => meta.key);
    const fArtifacts = fakeArtifacts(FAKE_ARTIFACTS_NUM, fSamples.samples,
                                     artifactTypes);

    const testTypes = meta.labtest.map(meta => meta.key);
    const fTests = fakeTests(FAKE_TESTS_NUM, fSamples.samples, testTypes);

    const fChanges = fakeChanges(FAKE_CHANGES_NUM, fArtifacts.artifacts,
                                 fTests.tests, meta);

    return {
      metadata: [].concat(
        meta.artifact, meta.labtest, meta.facility, meta.region, meta.status,
        meta.rejection, meta.person
      ),
      samples: fSamples.samples,
      artifacts: fArtifacts.artifacts,
      labTests: fTests.tests,
      changes: fChanges
    };
  });
};

const load = () => {
  const noLog = {logging: false};

  return make()
  .then(fake => {
    return storage.db.sync()
    .then(() => log.info('Wiping fake data from development database'))
    .then(() =>
      storage.models.Changes.destroy({where: {uuid: {$like: 'FAKE%'}}}))
    .then(() =>
      storage.models.Artifacts.destroy({where: {uuid: {$like: 'FAKE%'}}}))
    .then(() =>
      storage.models.LabTests.destroy({where: {uuid: {$like: 'FAKE%'}}}))
    .then(() =>
      storage.models.SampleIds.destroy({where: {uuid: {$like: 'FAKE%'}}}))
    .then(() => log.info('Loading fake data'))
    .then(() => storage.models.SampleIds.bulkCreate(fake.samples, noLog))
    .then(() => storage.models.Artifacts.bulkCreate(fake.artifacts, noLog))
    .then(() => storage.models.LabTests.bulkCreate(fake.labTests, noLog))
    .then(() => storage.models.Changes.bulkCreate(fake.changes, noLog))
    .then(() => log.info('Finished loading fake data'))
    .catch(err => log.error('Error creating fake data', err, err.message));
  });
};

module.exports = {
  make,
  load
};
