'use strict';

const path = require('path');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BPromise = require('bluebird');
const disatransform = require('server/disa/disatransform.js');

describe('Disa Labs Status Tranforms', () => {

  const singleUpdate = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'disa-single.xml')}`,
    'utf-8'
  );

  const manyUpdates = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'disa1.xml')}`,
    'utf-8'
  );

  const expectedXML = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'disa-odk.xml')}`,
    'utf-8'
  );

  const expectedSampleIds = {
    stId: 'ABCD12345',
    labId: 'MHL1234567'
  };

  it('should parse single lab update sample ids', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.sampleId)
    ).to.eventually.deep.equal(expectedSampleIds)
  );

  const expectedLabTests = [
    {testType: 'TESTA'}
  ];

  it('should parse single lab update lab tests', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.labTests)
    ).to.eventually.deep.equal(expectedLabTests)
  );

  const expectedChanges = [{
    statusDate: new Date('2016-01-01T00:00:00.000Z'),
    stage: 'LABSTATUS',
    facility: 'MHL',
    status: 'PRT',
    labTestType: 'TESTA',
    labRejection: null
  }];

  it('should parse single lab update changes', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.labChanges)
    ).to.eventually.deep.equal(expectedChanges)
  );

  const expectedMetaFacility1 = {key: 'MHL', value: 'Duis autem vel'};

  it('should parse single lab update meta facility', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.metaFacility)
    ).to.eventually.deep.equal(expectedMetaFacility1)
  );

  const expectedMetaStatuses1 = [
    {key: 'PRT', value: 'Lorem ipsum dolor sit amet'}
  ];

  it('should parse single lab update meta statuses', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.metaStatuses)
    ).to.eventually.deep.equal(expectedMetaStatuses1)
  );

  const expectedMetaLabTests1 = [
    {key: 'TESTA', value: 'A test of type A'}
  ];

  it('should parse single lab update meta lab tests', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.metaLabTests)
    ).to.eventually.deep.equal(expectedMetaLabTests1)
  );

  const expectedMetaRejections1 = [];

  it('should parse single lab update meta rejections', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.metaRejections)
    ).to.eventually.deep.equal(expectedMetaRejections1)
  );

  const expectedSampleIds2 = {
    stId: 'ZXCBZXCB',
    labId: 'LCC0231368'
  };

  it('should parse multiple lab updates sample ids', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.sampleId)
    ).to.eventually.deep.equal(expectedSampleIds2)
  );

  const expectedLabTests2 = [{
    testType: 'DIFF'
  }, {
    testType: 'LFT'
  }, {
    testType: 'UECA'
  }, {
    testType: 'FBC'
  }];

  it('should parse multiple lab updates lab tests', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.labTests)
    ).to.eventually.deep.equal(expectedLabTests2)
  );

  const expectedChanges2 = [{
    statusDate: new Date('2016-02-19T10:43:14'),
    stage: 'LABSTATUS',
    facility: 'LCC',
    status: 'REQ',
    labTestType: 'DIFF',
    labRejection: null
  }, {
    statusDate: new Date('2016-02-19T10:43:14'),
    stage: 'LABSTATUS',
    facility: 'LCC',
    status: 'REQ',
    labTestType: 'LFT',
    labRejection: null
  }, {
    statusDate: new Date('2016-02-19T10:43:14'),
    stage: 'LABSTATUS',
    facility: 'LCC',
    status: 'REQ',
    labTestType: 'UECA',
    labRejection: null
  }, {
    statusDate: new Date('2016-02-19T10:43:14'),
    stage: 'LABSTATUS',
    facility: 'LCC',
    status: 'REJ',
    labTestType: 'FBC',
    labRejection: 'SOBAD'
  }];

  it('should parse multiple lab update changes', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.labChanges)
    ).to.eventually.deep.equal(expectedChanges2)
  );

  const expectedMetaStatuses = [
    {key: 'REQ', value: 'Requested'},
    {key: 'REJ', value: 'Rejected'}
  ];

  it('should parse multiple lab update meta statuses', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.metaStatuses)
    ).to.eventually.deep.equal(expectedMetaStatuses)
  );

  const expectedMetaFacility = {
    key: 'LCC', value: 'Queen Elizabeth II Hospital'
  };

  it('should parse multiple lab update meta facility', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.metaFacility)
    ).to.eventually.deep.equal(expectedMetaFacility)
  );

  const expectedMetaLabTests = [
    {key: 'DIFF', value: 'Differential'},
    {key: 'LFT', value: 'Liver Function Tests'},
    {key: 'UECA', value: 'Urea, Electrolytes & Creatinin'},
    {key: 'FBC', value: 'Full Blood Count + Platelets'}
  ];

  it('should parse multiple lab update meta lab tests', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.metaLabTests)
    ).to.eventually.deep.equal(expectedMetaLabTests)
  );

  const expectedMetaRejections = [
    {key: 'SOBAD', value: 'Morbi elementum erat quis pretium sodales'}
  ];

  it('should parse multiple lab update meta rejections', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.metaRejections)
    ).to.eventually.deep.equal(expectedMetaRejections)
  );

  const sampleIds1 = {
    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3',
    stId: 'stt3',
    labId: 'LAB0000001',
    outstanding: true
  };

  const labTests = [
    {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx8',
      sampleId: sampleIds1.uuid,
      testType: 'TESTA'
    }, {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx9',
      sampleId: sampleIds1.uuid,
      testType: 'TESTB'
    }
  ];

  const c1 = [
    {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'LABSTATUS',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTA',
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'LABSTATUS',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTB',
      labRejection: null
    }
  ];

  const expectedFilledChanges = [
    {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'LABSTATUS',
      facility: 'MHL',
      status: 'PRT',
      labTest: labTests[0].uuid,
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'LABSTATUS',
      facility: 'MHL',
      status: 'PRT',
      labTest: labTests[1].uuid,
      labRejection: null
    }
  ];

  it('should add lab references to changes given lab tests', () =>
    expect(
      disatransform.fillTestRefs(c1, labTests)
    ).to.eventually.deep.equal(expectedFilledChanges)
  );

  const c2 = [
    {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'LABSTATUS',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTA',
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'LABSTATUS',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTD', // This test does not exist in the database
      labRejection: null
    }
  ];

  it('should throw an error for unrecognized change lab test types', () =>
    expect(
      disatransform.fillTestRefs(c2, labTests)
    ).to.eventually.be.rejectedWith(Error)
  );

  it('should convert lab status objects to form submission XML', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(parsed => BPromise.join(
        disatransform.sampleId(parsed),
        disatransform.labStatusDate(parsed),
        disatransform.labChanges(parsed),
        disatransform.metaFacility(parsed),
        new Date('2016-01-02T00:00:00.000Z'),
        manyUpdates
      ))
      .spread(disatransform.buildLabXForm)
    ).to.eventually.equal(expectedXML)
  );

});
