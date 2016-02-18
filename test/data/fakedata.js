'use strict';

const config = require('app/config');
const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
storage.init({config: config.db});
const sttmodels = require('app/server/stt/models');
storage.loadModels(sttmodels);

const lorem = ['lorem', 'ipsum', 'dolor', 'sit', 'amet, ', 'consectetur',
'adipisicing', 'elit, ', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut',
'labore', 'et', 'dolore', 'magna', 'aliqua.', 'enim', 'ad', 'minim',
'veniam, ', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat.', 'duis', 'aute', 'irure',
'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum',
'dolore', 'eu', 'fugiat', 'nulla', 'pariatur.', 'excepteur', 'sint', 'occaecat',
'cupidatat', 'non', 'proident, ', 'sunt', 'in', 'culpa', 'qui', 'officia',
'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum.', 'sed', 'ut',
'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error', 'sit', 'voluptatem',
'accusantium', 'doloremque', 'laudantium, ', 'totam', 'rem', 'aperiam', 'eaque',
'ipsa, ', 'quae', 'ab', 'illo', 'inventore', 'veritatis', 'et', 'quasi',
'architecto', 'beatae', 'vitae', 'dicta', 'sunt, ', 'explicabo.', 'nemo',
'enim', 'ipsam', 'voluptatem, ', 'quia', 'voluptas', 'sit, ', 'aspernatur',
'aut', 'odit', 'aut', 'fugit, ', 'sed', 'quia', 'consequuntur', 'magni',
'dolores', 'eos, ', 'qui', 'ratione', 'voluptatem', 'sequi', 'nesciunt, ',
'neque', 'porro', 'quisquam', 'est, ', 'qui', 'dolorem', 'ipsum, ', 'quia',
'dolor', 'sit, ', 'amet, ', 'consectetur, ', 'adipisci', 'velit, ', 'sed',
'quia', 'non', 'numquam', 'eius', 'modi', 'tempora', 'incidunt, ', 'ut',
'labore', 'et', 'dolore', 'magnam', 'aliquam', 'quaerat', 'voluptatem.', 'ut',
'enim', 'ad', 'minima', 'veniam, ', 'quis', 'nostrum', 'exercitationem',
'ullam', 'corporis', 'suscipit', 'laboriosam, ', 'nisi', 'ut', 'aliquid', 'ex',
'ea', 'commodi', 'consequatur?', 'quis', 'autem', 'vel', 'eum', 'iure',
'reprehenderit, ', 'qui', 'in', 'ea', 'voluptate', 'velit', 'esse, ', 'quam',
'nihil', 'molestiae', 'consequatur, ', 'vel', 'illum, ', 'qui', 'dolorem',
'eum', 'fugiat, ', 'quo', 'voluptas', 'nulla', 'pariatur?', 'at', 'vero', 'eos',
'et', 'accusamus', 'et', 'iusto', 'odio', 'dignissimos', 'ducimus, ', 'qui',
'blanditiis', 'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti, ',
'quos', 'dolores', 'et', 'quas', 'molestias', 'excepturi', 'sint, ',
'obcaecati', 'cupiditate', 'non', 'provident, ', 'similique', 'sunt', 'in',
'culpa, ', 'qui', 'officia', 'deserunt', 'mollitia', 'animi, ', 'id', 'est',
'laborum', 'et', 'dolorum', 'fuga.', 'harum', 'quidem', 'rerum', 'facilis',
'est', 'et', 'expedita', 'distinctio.', 'Nam', 'libero', 'tempore, ', 'cum',
'soluta', 'nobis', 'est', 'eligendi', 'optio, ', 'cumque', 'nihil', 'impedit',
'quo', 'minus', 'id, ', 'quod', 'maxime', 'placeat, ', 'facere', 'possimus, ',
'omnis', 'voluptas', 'assumenda', 'est, ', 'omnis', 'dolor', 'repellendus.',
'temporibus', 'autem', 'quibusdam', 'aut', 'officiis', 'debitis', 'aut',
'rerum', 'necessitatibus', 'saepe', 'eveniet, ', 'ut', 'et', 'voluptates',
'repudiandae', 'sint', 'molestiae', 'non', 'recusandae.', 'itaque', 'earum'
];

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
  // return s.join('');
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

const makeLorem = length => {
  let value = [];
  for (let i = 0; i < length; i++) {
    value.push(lorem[getRandomInt(lorem.length)]);
  }
  return value.join(' ');
};

const makeMeta = (type, valueLength) => {
  let value = makeLorem(valueLength);

  return {
    type,
    key: 'FAKE' + makeRandomString('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4),
    value,
    valueType: 'string'
  };
};

const fakeMetadata = (num, type, valueLength) => {
  let result = [];

  for (let i = 0; i < num; i++) {
    let meta = makeMeta(type, valueLength);
    result.push(meta);
  }

  return result;
};

const MILLIS_PER_YEAR = 31536000000;

const makeDate = () => {
  return new Date(Date.now() - getRandomInt(MILLIS_PER_YEAR * 5)).toISOString();
};

const WORKFLOW_STAGES = [
  'spickup',
  'sarrival',
  'labstatus',
  'rpickup',
  'rarrival'
];

const makeChange = (artifact, test, facility, person, status, labRejection) => {
  return ({
    uuid: makeUUID(),
    statusDate: makeDate(),
    stage: WORKFLOW_STAGES[getRandomInt(WORKFLOW_STAGES.length)],
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
    let test = null;
    let artifact = null;
    let facility = null;
    let person = null;
    let status = null;
    let rejection = null;
    if (Math.random() > 0.5) {
      artifact = artifacts[getRandomInt(artifacts.length)];
      facility = meta.facility[getRandomInt(meta.facility.length)];
      person = meta.person[getRandomInt(meta.person.length)];
    } else {
      test = tests[getRandomInt(tests.length)];
      rejection = meta.rejection[getRandomInt(meta.rejection.length)];
    }
    status = meta.status[getRandomInt(meta.status.length)];

    let change = makeChange(
      artifact, test, facility, person, status, rejection
    );
    changes.push(change);
  }

  return changes;
};

const make = () => {
  const meta = {
    artifact: fakeMetadata(5, 'artifact', 2),
    labtest: fakeMetadata(20, 'labtest', 2),
    facility: fakeMetadata(50, 'facility', 2),
    region: fakeMetadata(10, 'region', 1),
    status: fakeMetadata(10, 'status', 2),
    rejection: fakeMetadata(10, 'rejection', 3),
    person: fakeMetadata(50, 'person', 2)
  };

  const fSamples = fakeSamples(100);

  const artifactTypes = meta.artifact.map(meta => meta.key);
  const fArtifacts = fakeArtifacts(500, fSamples.samples, artifactTypes);

  const testTypes = meta.labtest.map(meta => meta.key);
  const fTests = fakeTests(500, fSamples.samples, testTypes);

  const fChanges = fakeChanges(1000, fArtifacts.artifacts, fTests.tests, meta);

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
};

const load = () => {
  const fake = make();
  const noLog = {logging: false};

  return storage.db.sync()
  .then(() => log.info('Wiping data from development database'))
  .then(() => storage.models.Changes.destroy({where: {uuid: {$like: 'FAKE%'}}}))
  .then(() => storage.models.Artifacts.destroy({where: {uuid: {$like: 'FAKE%'}}}))
  .then(() => storage.models.LabTests.destroy({where: {uuid: {$like: 'FAKE%'}}}))
  .then(() => storage.models.SampleIds.destroy({where: {uuid: {$like: 'FAKE%'}}}))
  .then(() => storage.models.Metadata.destroy({where: {key: {$like: 'FAKE%'}}}))
  .then(() => log.info('Loading fake data'))
  .then(() => storage.models.Metadata.bulkCreate(fake.metadata, noLog))
  .then(() => storage.models.SampleIds.bulkCreate(fake.samples, noLog))
  .then(() => storage.models.Artifacts.bulkCreate(fake.artifacts, noLog))
  .then(() => storage.models.LabTests.bulkCreate(fake.labTests, noLog))
  .then(() => storage.models.Changes.bulkCreate(fake.changes, noLog))
  .then(() => log.info('Finished loading fake data'))
  .catch(log.error);
};

module.exports = {
  make,
  load
};
