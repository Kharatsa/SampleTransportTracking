'use strict';

const _ = require('lodash');
const testmeta = require('./testmeta.js');

const FAKE_CHANGES_NUM = 5000;

const MILLIS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;
const MILLIS_PER_HOUR = 1000 * 60 * 60;
const STAGE_ORDER = ['SDEPART', 'SARRIVE', 'LABSTATUS', 'RDEPART', 'RARRIVE'];
const TEST_STATUS_ORDER = ['REQ', 'RVW', 'PRT'];

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

const randomInt = length => Math.floor(Math.random() * (length));

const randomString = (possible, numChars) => {
  let result = [];

  for (let i = 0; i < numChars; i++) {
    result.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  return result.join('');
};

const randomPastDate = () => {
  return new Date(Date.now() - randomInt(MILLIS_PER_YEAR * 5)).toISOString();
};

const incrementDate = dateStr => {
  const sourceTimestamp = new Date(dateStr).getTime();
  const incrementMillis = randomInt(100) * MILLIS_PER_HOUR;
  return new Date(sourceTimestamp + incrementMillis).toISOString();
};

const makeStId = () => {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return randomString(possible, 10);
};

const makeLabId = () => {
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numbers = '0123456789';
  return randomString(letters, 3) + randomString(numbers, 7);
};

const makeSample = (meta, createdAt) => ({
  uuid: makeUUID(),
  stId: makeStId(),
  labId: makeLabId(),
  origin: meta.facility[randomInt(meta.facility.length)].key,
  createdAt
});

const makeArtifact = (sample, type) => ({
  uuid: makeUUID(),
  sampleId: sample.uuid,
  artifactType: type
});

const makeTest = (sample, type) => ({
  uuid: makeUUID(),
  sampleId: sample.uuid,
  testType: type
});

const makeChange = options => {
  return {
    uuid: makeUUID(),
    statusDate: options.statusDate,
    stage: options.stage,
    artifact: options.artifact || null,
    labTest: options.labTest || null,
    facility: options.facility,
    person: options.person || null,
    status: options.status || null,
    labRejection: options.labRejection || null
  };
};

const buildStages = count => {
  let stages = ['SDEPART'];
  if (count > 1) {
    stages.push('SARRIVE');
  }
  if (count > 2) {
    stages.push('LABSTATUS');
  }
  if (count > 3) {
    stages.push('RDEPART');
  }
  if (count > 4) {
    stages.push('RARRIVE');
  }
  return stages;
};

const buildArtifacts = (sample, meta) => {
  let artifacts = [];
  const metaArtifacts = meta.artifact.filter(artifact =>
    artifact.key !== 'RESULT');
  const count = randomInt(4) + 1;
  for (let i = 0; i < count; i++) {
    const artifactMeta = metaArtifacts[randomInt(metaArtifacts.length)];
    artifacts.push(makeArtifact(sample, artifactMeta.key));
  }
  return artifacts;
};

const buildLabTests = (sample, stageCount, meta) => {
  let tests = [];
  if (stageCount > 2) {
    const count = randomInt(4) + 1;
    for (let i = 0; i < count; i++) {
      const testMeta = meta.labtest[randomInt(meta.labtest.length)];
      tests.push(makeTest(sample, testMeta.key));
    }
  }
  return tests;
};

const buildRequestChanges = (
  statusDate, stageKey, facilityKey, artifacts, meta
) => {
  const person = meta.person[randomInt(meta.person.length)];
  return artifacts.map(artifact => {
    const statusKey = Math.random() < 0.9 ? 'OK' : 'BAD';
    return makeChange({
      statusDate,
      stage: stageKey,
      artifact: artifact.uuid,
      facility: facilityKey,
      person: person.key,
      status: statusKey
    });
  });
};

const buildLabStatusChanges = (startDate, test, facilityKey, meta) => {
  let statusDate = startDate;

  const testStatusCount = randomInt(TEST_STATUS_ORDER.length) + 1;
  let result = [];
  for (let i = 0; i < testStatusCount; i++) {
    const status = meta.status[randomInt(meta.status.length)];
    const rejection = (
      status.key === 'REJ' ?
      meta.rejection[randomInt(meta.rejection.length)] :
      null
    );

    result.push(makeChange({
      statusDate,
      stage: 'LABSTATUS',
      labTest: test.uuid,
      facility: facilityKey,
      status: status.key,
      labRejection: rejection ? rejection.key : null
    }));

    if (status.key === 'REJ') {
      break;
    }
    statusDate = incrementDate(statusDate);
  }

  return result;
};

const buildLabChanges = (startDate, facilityKey, labTests, meta) => {
  let prints = [];
  const testChanges = labTests.map(test => {
    const result = buildLabStatusChanges(startDate, test, facilityKey, meta);

    const lastChange = result[result.length - 1];
    if (lastChange.status === 'PRT') {
      prints.push({date: lastChange.statusDate, facilityKey});
    }

    return result;
  });

  return {changes: _.flatten(testChanges), prints};
};

const buildResultChanges = (
  sample, artifacts, prints, facilityKey, meta
) => {
  const person = meta.person[randomInt(meta.person.length)];

  let artifact;
  const results = prints.map(print => {
    const pickupDate = incrementDate(print.date);
    let statusKey;
    let stages = [];

    if (Math.random() > 0.75) {
      artifact = makeArtifact(sample, 'RESULT');
      artifacts.push(artifact);
      statusKey = Math.random() < 0.9 ? 'OK' : 'BAD';

      stages.push(makeChange({
        statusDate: pickupDate,
        stage: 'RDEPART',
        artifact: artifact.uuid,
        facility: print.facilityKey,
        person: person.key,
        status: statusKey
      }));
    }

    if (Math.random() > 0.75 && !!artifact) {
      const facility = meta.facility[randomInt(meta.facility.length)];
      statusKey = Math.random() < 0.9 ? 'OK' : 'BAD';

      stages.push(makeChange({
        statusDate: incrementDate(pickupDate),
        stage: 'RARRIVE',
        artifact: artifact.uuid,
        facility: facility.key,
        person: person.key,
        status: statusKey
      }));
    }

    artifact = null;

    return stages;
  });

  return _.flatten(results);

};

const buildChanges = (startDate, stages, sample, artifacts, labTests, meta) => {
  let statusDate = startDate;
  const facilityKey = sample.origin;
  let prints;
  const changes = stages.map(stage => {
    let result = [];
    if (stage === 'SDEPART' || stage === 'SARRIVE') {
      result = buildRequestChanges(
        statusDate, stage, facilityKey, artifacts, meta);
    } else if (stage === 'LABSTATUS') {
      const facility = meta.facility[randomInt(meta.facility.length)];
      result = buildLabChanges(statusDate, facility.key, labTests, meta);
      prints = result.prints;
      result = result.changes;
    } else if (stage === 'RDEPART') {
      const facility = meta.facility[randomInt(meta.facility.length)];
      result = buildResultChanges(
        sample, artifacts, prints, facility.key, meta);
    } else {
      // noop
    }
    statusDate = incrementDate(statusDate);
    return result;
  });

  return _.flatten(changes);
};

const buildEntities = meta => {
  const stageCount = randomInt(STAGE_ORDER.length) + 1;
  const stages = buildStages(stageCount);

  const startDate = randomPastDate();

  const sample = makeSample(meta, startDate);

  const artifacts = buildArtifacts(sample, meta);

  const labTests = buildLabTests(sample, stageCount, meta);

  const changes = buildChanges(
    startDate, stages, sample, artifacts, labTests, meta);

  return {sample, artifacts, labTests, changes};
};

const removeFakeData = storage => {
  return storage.models.Changes.destroy({where: {uuid: {$like: 'FAKE%'}}})
  .then(() =>
    storage.models.Artifacts.destroy({where: {uuid: {$like: 'FAKE%'}}})
  )
  .then(() =>
    storage.models.LabTests.destroy({where: {uuid: {$like: 'FAKE%'}}})
  )
  .then(() =>
    storage.models.SampleIds.destroy({where: {uuid: {$like: 'FAKE%'}}})
  );
};

const load = (changesNum) => {
  const config = require('app/config');
  const log = require('app/server/util/logapp.js');
  const storage = require('app/server/storage');
  storage.init({config: config.db});
  const sttmodels = require('app/server/stt/models');
  storage.loadModels(sttmodels);

  const noLog = {logging: false};

  return storage.db.sync()
  .then(() => testmeta.load())
  .then(() => {
    log.info('Wiping fake data from development database');
    return removeFakeData(storage);
  })
  .then(() => {
    log.info('Loading fake data');
    const fakeChangesTarget = changesNum || FAKE_CHANGES_NUM;

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

    let samples = [];
    let artifacts = [];
    let labTests = [];
    let changes = [];
    while (changes.length < fakeChangesTarget) {
      const fake = buildEntities(meta);
      samples = samples.concat(fake.sample);
      artifacts = artifacts.concat(fake.artifacts);
      labTests = labTests.concat(fake.labTests);
      changes = changes.concat(fake.changes);
    }

    return {samples, artifacts, labTests, changes};
  })
  .then(fake => {
    log.info('Finished generating fake data');
    return storage.models.SampleIds.bulkCreate(fake.samples, noLog)
    .then(() => storage.models.Artifacts.bulkCreate(fake.artifacts, noLog))
    .then(() => storage.models.LabTests.bulkCreate(fake.labTests, noLog))
    .then(() => storage.models.Changes.bulkCreate(fake.changes, noLog));
  })
  .then(() => log.info('Finihsed loading fake data'))
  .catch(err => log.error('Error creating fake data', err, err.message));
};

module.exports = {
  buildEntities,
  removeFakeData,
  load
};
