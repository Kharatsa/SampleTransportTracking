'use strict';

const fs = require('fs');
const BPromise = require('bluebird');
const readFileAsync = BPromise.promisify(fs.readFile);
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const transform = require('server/odk/collect/collecttransform.js');

describe('ODK Collect Tranforms', () => {
  const basePath = path.join(__dirname, '..', '..', '..', 'data');

  it('should parse empty submissions sample ids', () =>
    expect(
      readFileAsync(path.join(basePath, 'sdepart1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal([])
  );

  it('should parse empty submissions artifacts', () =>
    expect(
      readFileAsync(path.join(basePath, 'sdepart1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.artifacts)
    ).to.eventually.deep.equal([])
  );

  it('should parse empty submissions changes', () =>
    expect(
      readFileAsync(path.join(basePath, 'sdepart1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.changes)
    ).to.eventually.deep.equal([])
  );

  const expectedSampleIds4 = [{stId: '396f99229', labId: null, origin: 'BRN'}];

  it('should parse sample depart sample ids', () =>
    expect(
      readFileAsync(path.join(basePath, 'sdepart2.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds4)
  );

  const expectedArtifacts4 = [
    {stId: '396f99229', labId: null, artifactType: 'BLOOD'},
    {stId: '396f99229', labId: null, artifactType: 'URINE'},
    {stId: '396f99229', labId: null, artifactType: 'REQUEST'}
  ];

  it('should parse sample depart artifacts', () =>
    expect(
      readFileAsync(path.join(basePath, 'sdepart2.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.artifacts)
    ).to.eventually.deep.equal(expectedArtifacts4)
  );

  const expectedChanges4 = [
    {statusDate: new Date('Tue Mar 15 2016 11:33:11.116 GMT-0400 (EDT)'),
      stage: 'SDEPART',
      facility: 'BRN',
      person: null,
      stId: '396f99229',
      labId: null,
      artifactType: 'BLOOD',
      status: 'BAD'},
    {statusDate: new Date('Tue Mar 15 2016 11:33:11.116 GMT-0400 (EDT)'),
      stage: 'SDEPART',
      facility: 'BRN',
      person: null,
      stId: '396f99229',
      labId: null,
      artifactType: 'URINE',
      status: 'OK'},
    {statusDate: new Date('Tue Mar 15 2016 11:33:11.116 GMT-0400 (EDT)'),
      stage: 'SDEPART',
      facility: 'BRN',
      person: null,
      stId: '396f99229',
      labId: null,
      artifactType: 'REQUEST',
      status: 'OK'}
  ];

  it('should parse sample depart changes', () =>
    expect(
      readFileAsync(path.join(basePath, 'sdepart2.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.changes)
    ).to.eventually.deep.equal(expectedChanges4)
  );

  const expectedSampleIds1 = [
    {stId: 'fc598532d', labId: null},
    {stId: 'a7c9b39b3', labId: null},
    {stId: '396f99229', labId: null},
    {stId: '857fa4700', labId: null},
    {stId: 'a786ae7ff', labId: null},
    {stId: 'f975916ff', labId: null},
    {stId: 'f852a888a', labId: null},
    {stId: '7359984eb', labId: null},
    {stId: '666996e91', labId: null},
    {stId: '7d80a07b0', labId: null}
  ];

  it('should parse parse sarrive sample ids', () =>
    expect(
      readFileAsync(path.join(basePath, 'sarrive1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds1)
  );

  const expectedArtifacts1 = [
    {artifactType: 'REQUEST', stId: 'fc598532d', labId: null},
    {artifactType: 'REQUEST', stId: 'a7c9b39b3', labId: null},
    {artifactType: 'REQUEST', stId: '396f99229', labId: null},
    {artifactType: 'REQUEST', stId: '857fa4700', labId: null},
    {artifactType: 'REQUEST', stId: 'a786ae7ff', labId: null},
    {artifactType: 'REQUEST', stId: 'f975916ff', labId: null},
    {artifactType: 'REQUEST', stId: 'f852a888a', labId: null},
    {artifactType: 'REQUEST', stId: '7359984eb', labId: null},
    {artifactType: 'REQUEST', stId: '666996e91', labId: null},
    {artifactType: 'REQUEST', stId: '7d80a07b0', labId: null},
    {artifactType: 'SPUTUM', stId: 'fc598532d', labId: null},
    {artifactType: 'SPUTUM', stId: 'a7c9b39b3', labId: null},
    {artifactType: 'SPUTUM', stId: '396f99229', labId: null},
    {artifactType: 'BLOOD', stId: 'f975916ff', labId: null},
    {artifactType: 'BLOOD', stId: 'f852a888a', labId: null},
    {artifactType: 'BLOOD', stId: 'a786ae7ff', labId: null},
    {artifactType: 'BLOOD', stId: '666996e91', labId: null},
    {artifactType: 'BLOOD', stId: '7d80a07b0', labId: null},
    {artifactType: 'URINE', stId: '666996e91', labId: null},
    {artifactType: 'URINE', stId: 'a7c9b39b3', labId: null}
  ];

  it('should parse parse sarrive artifacts', () =>
    expect(
      readFileAsync(path.join(basePath, 'sarrive1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.artifacts)
    ).to.eventually.deep.equal(expectedArtifacts1)
  );

  const expectedChanges1 = [
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: 'fc598532d',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: 'a7c9b39b3',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: '396f99229',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: '857fa4700',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: 'a786ae7ff',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: 'f975916ff',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: 'f852a888a',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: '7359984eb',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: '666996e91',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'REQUEST',
    status: 'OK',
    stId: '7d80a07b0',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'SPUTUM',
    status: 'OK',
    stId: 'fc598532d',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'SPUTUM',
    status: 'OK',
    stId: 'a7c9b39b3',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'SPUTUM',
    status: 'OK',
    stId: '396f99229',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'BLOOD',
    status: 'OK',
    stId: 'f975916ff',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'BLOOD',
    status: 'OK',
    stId: 'f852a888a',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'BLOOD',
    status: 'OK',
    stId: 'a786ae7ff',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'BLOOD',
    status: 'OK',
    stId: '666996e91',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'BLOOD',
    status: 'OK',
    stId: '7d80a07b0',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'URINE',
    status: 'BAD',
    stId: '666996e91',
    labId: null},
  {statusDate: new Date('Mon Mar 14 2016 19:51:28.446 GMT-0400 (EDT)'),
    stage: 'SARRIVE',
    person: null,
    facility: 'KHB',
    artifactType: 'URINE',
    status: 'OK',
    stId: 'a7c9b39b3',
    labId: null}
  ];

  it('should parse parse sarrive changes', () =>
    expect(
      readFileAsync(path.join(basePath, 'sarrive1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.changes)
    ).to.eventually.deep.equal(expectedChanges1)
  );

  const expectedSampleIds2 = [
    {stId: 'f5c5995a3', labId: null},
    {stId: 'c09795573', labId: null},
    {stId: 'a2f4b8e3f', labId: null}
  ];

  it('should parse result depart sample ids', () =>
    expect(
      readFileAsync(path.join(basePath, 'rdepart1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds2)
  );

  const expectedArtifacts2 = [
    {stId: 'f5c5995a3', labId: null, artifactType: 'RESULT'},
    {stId: 'c09795573', labId: null, artifactType: 'RESULT'},
    {stId: 'a2f4b8e3f', labId: null, artifactType: 'RESULT'}
  ];

  it('should parse result depart artifacts', () =>
    expect(
      readFileAsync(path.join(basePath, 'rdepart1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.artifacts)
    ).to.eventually.deep.equal(expectedArtifacts2)
  );

  const expectedChanges2 = [
    {statusDate: new Date('Tue Mar 15 2016 10:40:59.579 GMT-0400 (EDT)'),
      stage: 'RDEPART',
      facility: 'STG',
      person: null,
      stId: 'f5c5995a3',
      labId: null,
      artifactType: 'RESULT',
      status: 'OK'},
    {statusDate: new Date('Tue Mar 15 2016 10:40:59.579 GMT-0400 (EDT)'),
      stage: 'RDEPART',
      facility: 'STG',
      person: null,
      stId: 'c09795573',
      labId: null,
      artifactType: 'RESULT',
      status: 'OK'},
    {statusDate: new Date('Tue Mar 15 2016 10:40:59.579 GMT-0400 (EDT)'),
      stage: 'RDEPART',
      facility: 'STG',
      person: null,
      stId: 'a2f4b8e3f',
      labId: null,
      artifactType: 'RESULT',
      status: 'OK'}
  ];

  it('should parse result depart changes', () =>
    expect(
      readFileAsync(path.join(basePath, 'rdepart1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.changes)
    ).to.eventually.deep.equal(expectedChanges2)
  );

  const expectedSampleIds3 = [{stId: '4b59bb109', labId: null}];

  it('should parse result arrive sample ids', () =>
    expect(
      readFileAsync(path.join(basePath, 'rarrive1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds3)
  );

  const expectedArtifacts3 = [
    {stId: '4b59bb109', labId: null, artifactType: 'RESULT'}
  ];

  it('should parse result arrive artifacts', () =>
    expect(
      readFileAsync(path.join(basePath, 'rarrive1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.artifacts)
    ).to.eventually.deep.equal(expectedArtifacts3)
  );

  const expectedChanges3 = [
    {statusDate: new Date('Tue Mar 15 2016 10:41:29.974 GMT-0400 (EDT)'),
      stage: 'RARRIVE',
      facility: 'PNT',
      person: null,
      stId: '4b59bb109',
      labId: null,
      artifactType: 'RESULT',
      status: 'OK'}
  ];

  it('should parse result arrive changes', () =>
    expect(
      readFileAsync(path.join(basePath, 'rarrive1.xml'), 'utf-8')
      .then(transform.collectSubmission)
      .then(transform.changes)
    ).to.eventually.deep.equal(expectedChanges3)
  );
});
