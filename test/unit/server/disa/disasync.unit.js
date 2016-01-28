'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const config = require('app/config');
const storage = require('app/server/storage');
const sttmodels = require('app/server/stt/models');
const disasync = require('app/server/disa/disasync.js');
const disatransform = require('app/server/disa/disatransform.js');

// TODO: move these to the client tests?

const artifactMeta = [
  {
    id: 1,
    type: 'artifact',
    key: 'form',
    value: 'Form',
    valueType: 'string'
  }, {
    id: 2,
    type: 'artifact',
    key: 'blood',
    value: 'Blood',
    valueType: 'string'
  }, {
    id: 3,
    type: 'artifact',
    key: 'dbs',
    value: 'Dried Blood Spot',
    valueType: 'string'
  }
];

const labTestMeta = [
  {
    id: 4,
    type: 'labtest',
    key: 'TESTA',
    value: 'Test A',
    valueType: 'string'
  }, {
    id: 5,
    type: 'labtest',
    key: 'TESTB',
    value: 'Some Test Named B',
    valueType: 'string'
  }
];

const facilityMeta = [
  {
    id: 6,
    type: 'facility',
    key: 'FACILITY1',
    value: 'A great facility',
    valueType: 'string'
  }
];

const personMeta = [
  {
    id: 7,
    type: 'person',
    key: 'PERSON1',
    value: 'A great person',
    valueType: 'string'
  }
];

const statusMeta = [
  {
    id: 8,
    type: 'status',
    key: 'OK',
    value: 'Everything is just great',
    valueType: 'string'
  }, {
    id: 9,
    type: 'status',
    key: 'BAD',
    value: 'Something is not right',
    valueType: 'string'
  }
];

const rejectionMeta = [
  {
    id: 10,
    type: 'rejection',
    key: 'BROKEN',
    value: 'It broke :/',
    valueType: 'string'
  }
];

const sampleIds = [
  {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1',
    stId: 'stt1',
    labId: null,
    outstanding: true
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2',
    stId: 'stt2',
    labId: null,
    outstanding: true
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3',
    stId: 'stt3',
    labId: 'LAB0000001',
    outstanding: true
  }
];

const artifacts = [
  {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx4',
    sampleId: sampleIds[0].uuid,
    artifactType: 'blood'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx5',
    sampleId: sampleIds[0].uuid,
    artifactType: 'form'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx6',
    sampleId: sampleIds[1].uuid,
    artifactType: 'dbs'
  },
  {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx7',
    sampleId: sampleIds[1].uuid,
    artifactType: 'form'
  }
];

const labTests = [
  {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx8',
    sampleId: sampleIds[2].uuid,
    testType: 'TESTA'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx9',
    sampleId: sampleIds[2].uuid,
    testType: 'TESTB'
  }
];

const changes = [
  {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx10',
    statusDate: new Date('2016-01-01T10:00:00.000Z'),
    stage: 'labstatus',
    artifact: artifacts[0].uuid,
    facility: 'FACILITY1',
    person: 'PERSON1',
    status: 'OK'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx11',
    statusDate: new Date('2016-01-01T10:00:00.000Z'),
    stage: 'labstatus',
    artifact: artifacts[1].uuid,
    facility: 'FACILITY1',
    person: 'PERSON1',
    status: 'OK'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx12',
    statusDate: new Date('2016-01-01T11:00:00.000Z'),
    stage: 'labstatus',
    artifact: artifacts[2].uuid,
    facility: 'FACILITY1',
    person: 'PERSON1',
    status: 'BAD'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx13',
    statusDate: new Date('2016-01-01T11:00:00.000Z'),
    stage: 'labstatus',
    artifact: artifacts[3].uuid,
    facility: 'FACILITY1',
    person: 'PERSON1',
    status: 'OK'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx14',
    statusDate: new Date('2016-01-01T11:00:00.000Z'),
    stage: 'labstatus',
    labTest: labTests[0].uuid,
    facility: 'FACILITY1',
    person: 'PERSON1',
    status: 'OK'
  }, {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx15',
    statusDate: new Date('2016-01-01T11:00:00.000Z'),
    stage: 'labstatus',
    labTest: labTests[1].uuid,
    facility: 'FACILITY1',
    person: 'PERSON1',
    status: 'OK'
  }
];

describe.skip('Disa Labs Status Sync', () => {
  let models;
  before(done => {
    storage.init({config: config.db});
    storage.loadModels(sttmodels);
    models = storage.models;
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => models.Metadata.bulkCreate(artifactMeta))
    .then(() => models.Metadata.bulkCreate(labTestMeta))
    .then(() => models.Metadata.bulkCreate(statusMeta))
    .then(() => models.Metadata.bulkCreate(facilityMeta))
    .then(() => models.Metadata.bulkCreate(personMeta))
    .then(() => models.Metadata.bulkCreate(rejectionMeta))
    .then(() => models.SampleIds.bulkCreate(sampleIds))
    .then(() => models.Artifacts.bulkCreate(artifacts))
    .then(() => models.LabTests.bulkCreate(labTests))
    .then(() => models.Changes.bulkCreate(changes))
    .then(() => done());
  });

  const s1 = {
    stId: 'stt1',
    labId: null
  };
  const expectedS1 = sampleIds[0];

  it('should fetch existing sample ids', () =>
    expect(
      disasync.localSampleIds(s1)
    ).to.eventually.deep.equal(expectedS1)
  );

  const m1 = [
    {
      type: 'facility',
      key: 'FACILITY1',
      value: 'Duis autem vel',
      valueType: 'string'
    }, {
      type: 'status',
      key: 'OK',
      value: 'Everything is just great',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTB',
      value: '',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTC',
      value: '',
      valueType: 'string'
    }, {
      type: 'rejection',
      key: 'BROKEN',
      value: 'Looking busted',
      valueType: 'string'
    }, {
      type: 'rejection',
      key: 'SPOILED',
      value: 'Everything is all moldy',
      valueType: 'string'
    }
  ];

  const expectedM1 = [
    facilityMeta[0],
    statusMeta[0],
    labTestMeta[1],
    rejectionMeta[0]
  ];

  it('should fetch existing metadata', () =>
    expect(
      disasync.localMeta(m1)
    ).to.eventually.deep.equal(expectedM1)
  );

  const t2SampleIds = sampleIds[2].uuid;
  const t2 = [
    {
      testType: 'TESTA'
    }, {
      testType: 'TESTD'
    }
  ];

  const expectedT2 = [labTests[0]];

  it('should fetch existing all lab tests for sample ids', () =>
    expect(
      disatransform.fillSampleIdRefs(t2, t2SampleIds)
      .then(filled => disasync.localLabTests(filled))
    ).to.eventually.deep.equal(expectedT2)
  );

  const c1 = [
    {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx14',
      statusDate: new Date('2016-01-01T11:00:00.000Z'),
      labTestType: 'TESTA',
      facility: 'FACILITY1',
      person: 'PERSON1',
      status: 'OK'
    }, {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx15',
      statusDate: new Date('2016-01-01T11:00:00.000Z'),
      labTestType: 'TESTB',
      facility: 'FACILITY1',
      person: 'PERSON1',
      status: 'OK'
    }
  ];

  const expectedC1 = [
    Object.assign({}, changes[4], {artifact: null, labRejection: null}),
    Object.assign({}, changes[5], {artifact: null, labRejection: null})
  ];

  it('should fetch existing lab status changes', () =>
    expect(
      disatransform.fillTestRefs(c1, labTests)
      .then(filled => disasync.localChanges(filled))
    ).to.eventually.deep.equal(expectedC1)
  );

  it('should fetch empty metadata results given no input', () =>
    expect(disasync.localMeta([])).to.eventually.deep.equal([])
  );

  it('should fetch empty sampleIds results given no input', () =>
    expect(disasync.localSampleIds({})).to.eventually.deep.equal({})
  );

  it('should fetch empty labTests results given no input', () =>
    expect(disasync.localLabTests([])).to.eventually.deep.equal([])
  );

  it('should fetch empty changes results given no input', () =>
    expect(disasync.localChanges([])).to.eventually.deep.equal([])
  );

});
