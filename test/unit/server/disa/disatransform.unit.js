'use strict';

const path = require('path');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BPromise = require('bluebird');
const disatransform = require('app/server/disa/disatransform.js');

describe('Disa Labs Status Tranforms', () => {

  const singleUpdate = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'disa-single.xml')}`,
    'utf-8'
  );

  const manyUpdates = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'disa-many.xml')}`,
    'utf-8'
  );

  const expectedXML = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'disa-many-odk.xml')}`,
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
    stage: 'labstatus',
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

  const expectedMetadata = [
    {
      type: 'facility',
      key: 'MHL',
      value: 'Duis autem vel',
      valueType: 'string'
    }, {
      type: 'status',
      key: 'PRT',
      value: 'Lorem ipsum dolor sit amet',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTA',
      value: 'A test of type A',
      valueType: 'string'
    }
  ];

  it('should parse single lab update metadata', () =>
    expect(
      disatransform.labStatus(singleUpdate)
      .then(disatransform.metadata)
    ).to.eventually.deep.equal(expectedMetadata)
  );

  const expectedSampleIds2 = {
    stId: 'ABCD12345',
    labId: 'MHL1234567'
  };

  it('should parse multiple lab updates sample ids', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.sampleId)
    ).to.eventually.deep.equal(expectedSampleIds2)
  );

  const expectedLabTests2 = [{
    testType: 'TESTB'
  }, {
    testType: 'TESTC'
  }];

  it('should parse multiple lab updates lab tests', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.labTests)
    ).to.eventually.deep.equal(expectedLabTests2)
  );

  const expectedChanges2 = [{
    statusDate: new Date('2016-01-01T00:00:00.000Z'),
    stage: 'labstatus',
    facility: 'MHL',
    status: 'RVW',
    labTestType: 'TESTB',
    labRejection: null
  }, {
    statusDate: new Date('2016-01-01T00:00:00.000Z'),
    stage: 'labstatus',
    facility: 'MHL',
    status: 'REJ',
    labTestType: 'TESTC',
    labRejection: 'SOBAD'
  }];

  it('should parse multiple lab update changes', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.labChanges)
    ).to.eventually.deep.equal(expectedChanges2)
  );

  const expectedMetadata2 = [
    {
      type: 'facility',
      key: 'MHL',
      value: 'Duis autem vel',
      valueType: 'string'
    }, {
      type: 'status',
      key: 'RVW',
      value: 'Fusce vulputate faucibus lectus, et lacinia urna',
      valueType: 'string'
    }, {
      type: 'status',
      key: 'REJ',
      value: 'Cras nec tristique enim',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTB',
      value: 'Ut wisi enim ad minim veniam',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTC',
      value: 'Just another test',
      valueType: 'string'
    }, {
      type: 'rejection',
      key: 'SOBAD',
      value: 'Morbi elementum erat quis pretium sodales',
      valueType: 'string'
    }
  ];

  it('should parse multiple lab update metadata', () =>
    expect(
      disatransform.labStatus(manyUpdates)
      .then(disatransform.metadata)
    ).to.eventually.deep.equal(expectedMetadata2)
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
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTA',
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTB',
      labRejection: null
    }
  ];

  const expectedFilledChanges = [
    {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTest: labTests[0].uuid,
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'labstatus',
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
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTA',
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T00:00:00.000Z'),
      stage: 'labstatus',
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
        disatransform.labChanges(parsed)
      ))
      .spread(disatransform.buildLabXForm)
    ).to.eventually.equal(expectedXML)
  );

});
