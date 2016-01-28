// TODO: move these disasync tests to the sttclients

// 'use strict';

// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
// const expect = chai.expect;
// const config = require('app/config');
// const storage = require('app/server/storage');
// const sttmodels = require('app/server/stt/models');
// const disasync = require('app/server/disa/disasync.js');
// const disatransform = require('app/server/disa/disatransform.js');

// describe.skip('Disa Labs Status Sync', () => {
//   let models;
//   before(done => {
//     storage.init({config: config.db});
//     storage.loadModels(sttmodels);
//     models = storage.models;
//     return storage.db.dropAllSchemas()
//     .then(() => storage.db.sync())
//     .then(() => models.Metadata.bulkCreate(artifactMeta))
//     .then(() => models.Metadata.bulkCreate(labTestMeta))
//     .then(() => models.Metadata.bulkCreate(statusMeta))
//     .then(() => models.Metadata.bulkCreate(facilityMeta))
//     .then(() => models.Metadata.bulkCreate(personMeta))
//     .then(() => models.Metadata.bulkCreate(rejectionMeta))
//     .then(() => models.SampleIds.bulkCreate(sampleIds))
//     .then(() => models.Artifacts.bulkCreate(artifacts))
//     .then(() => models.LabTests.bulkCreate(labTests))
//     .then(() => models.Changes.bulkCreate(changes))
//     .then(() => done());
//   });

//   const s1 = {
//     stId: 'stt1',
//     labId: null
//   };
//   const expectedS1 = sampleIds[0];

//   it('should fetch existing sample ids', () =>
//     expect(
//       disasync.localSampleIds(s1)
//     ).to.eventually.deep.equal(expectedS1)
//   );

//   const m1 = [
//     {
//       type: 'facility',
//       key: 'FACILITY1',
//       value: 'Duis autem vel',
//       valueType: 'string'
//     }, {
//       type: 'status',
//       key: 'OK',
//       value: 'Everything is just great',
//       valueType: 'string'
//     }, {
//       type: 'labtest',
//       key: 'TESTB',
//       value: '',
//       valueType: 'string'
//     }, {
//       type: 'labtest',
//       key: 'TESTC',
//       value: '',
//       valueType: 'string'
//     }, {
//       type: 'rejection',
//       key: 'BROKEN',
//       value: 'Looking busted',
//       valueType: 'string'
//     }, {
//       type: 'rejection',
//       key: 'SPOILED',
//       value: 'Everything is all moldy',
//       valueType: 'string'
//     }
//   ];

//   const expectedM1 = [
//     facilityMeta[0],
//     statusMeta[0],
//     labTestMeta[1],
//     rejectionMeta[0]
//   ];

//   it('should fetch existing metadata', () =>
//     expect(
//       disasync.localMeta(m1)
//     ).to.eventually.deep.equal(expectedM1)
//   );

//   const t2SampleIds = sampleIds[2].uuid;
//   const t2 = [
//     {
//       testType: 'TESTA'
//     }, {
//       testType: 'TESTD'
//     }
//   ];

//   const expectedT2 = [labTests[0]];

//   it('should fetch existing all lab tests for sample ids', () =>
//     expect(
//       disatransform.fillSampleIdRefs(t2, t2SampleIds)
//       .then(filled => disasync.localLabTests(filled))
//     ).to.eventually.deep.equal(expectedT2)
//   );

//   const c1 = [
//     {
//       uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx14',
//       statusDate: new Date('2016-01-01T11:00:00.000Z'),
//       labTestType: 'TESTA',
//       facility: 'FACILITY1',
//       person: 'PERSON1',
//       status: 'OK'
//     }, {
//       uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx15',
//       statusDate: new Date('2016-01-01T11:00:00.000Z'),
//       labTestType: 'TESTB',
//       facility: 'FACILITY1',
//       person: 'PERSON1',
//       status: 'OK'
//     }
//   ];

//   const expectedC1 = [
//     Object.assign({}, changes[4], {artifact: null, labRejection: null}),
//     Object.assign({}, changes[5], {artifact: null, labRejection: null})
//   ];

//   it('should fetch existing lab status changes', () =>
//     expect(
//       disatransform.fillTestRefs(c1, labTests)
//       .then(filled => disasync.localChanges(filled))
//     ).to.eventually.deep.equal(expectedC1)
//   );

//   it('should fetch empty metadata results given no input', () =>
//     expect(disasync.localMeta([])).to.eventually.deep.equal([])
//   );

//   it('should fetch empty sampleIds results given no input', () =>
//     expect(disasync.localSampleIds({})).to.eventually.deep.equal({})
//   );

//   it('should fetch empty labTests results given no input', () =>
//     expect(disasync.localLabTests([])).to.eventually.deep.equal([])
//   );

//   it('should fetch empty changes results given no input', () =>
//     expect(disasync.localChanges([])).to.eventually.deep.equal([])
//   );

// });
