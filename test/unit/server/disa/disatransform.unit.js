'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BPromise = require('bluebird');
const disatransform = require('app/server/disa/disatransform.js');

describe('Disa Labs Status Tranforms', () => {

  const singleUpdate = (
    '<?xml version="1.0"?>' +
    '<LabStatus xmlns="http://kharatsa.com/schemas/labstatus.xsd" >' +
      '<STID>ABCD12345</STID>' +
      '<LabID>MHL1234567</LabID>' +
      '<StatusTimestamp>2016-01-01T10:00:00</StatusTimestamp>' +
      '<LabPrefix>' +
        '<LabPrefixCode>MHL</LabPrefixCode>' +
        '<Description>Duis autem vel</Description>' +
      '</LabPrefix>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>PRT</StatusCode>' +
          '<Description>Lorem ipsum dolor sit amet</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>*</TestCode>' +
          '<Description></Description>' +
        '</Test>' +
      '</SampleTest>' +
    '</LabStatus>'
  );

  const expectedSampleIds = {
    stId: 'ABCD12345',
    labId: 'MHL1234567'
  };

  it('should parse single lab update sample ids', () =>
    expect(
      disatransform.parseLabStatusXML(singleUpdate)
      .then(disatransform.parseSampleIds)
    ).to.eventually.deep.equal(expectedSampleIds)
  );

  const expectedLabTests = [];

  it('should parse single lab update lab tests', () =>
    expect(
      disatransform.parseLabStatusXML(singleUpdate)
      .then(disatransform.parseLabTests)
    ).to.eventually.deep.equal(expectedLabTests)
  );

  const expectedChanges = [{
    statusDate: new Date('2016-01-01T10:00:00.000Z'),
    stage: 'labstatus',
    facility: 'MHL',
    status: 'PRT',
    labTestType: '*',
    labRejection: null
  }];

  it('should parse single lab update changes', () =>
    expect(
      disatransform.parseLabStatusXML(singleUpdate)
      .then(disatransform.parseChanges)
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
    }
  ];

  it('should parse single lab update metadata', () =>
    expect(
      disatransform.parseLabStatusXML(singleUpdate)
      .then(disatransform.parseMetadata)
    ).to.eventually.deep.equal(expectedMetadata)
  );

  const manyUpdates = (
    '<?xml version="1.0"?>' +
    '<LabStatus xmlns="http://kharatsa.com/schemas/labstatus.xsd" >' +
      '<STID>ABCD12345</STID>' +
      '<LabID>MHL1234567</LabID>' +
      '<StatusTimestamp>2016-01-01T10:00:00</StatusTimestamp>' +
      '<LabPrefix>' +
        '<LabPrefixCode>MHL</LabPrefixCode>' +
        '<Description>Duis autem vel</Description>' +
      '</LabPrefix>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>RVW</StatusCode>' +
          '<Description>Fusce vulputate faucibus lectus, et lacinia urna' +
          '</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>TESTB</TestCode>' +
          '<Description>Ut wisi enim ad minim veniam' +
          '</Description>' +
        '</Test>' +
      '</SampleTest>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>REJ</StatusCode>' +
          '<Description>Cras nec tristique enim</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>TESTC</TestCode>' +
          '<Description>Just another test</Description>' +
        '</Test>' +
        '<Rejection>' +
          '<RejectionCode>SOBAD</RejectionCode>' +
          '<Description>Morbi elementum erat quis pretium sodales' +
          '</Description>' +
        '</Rejection>' +
      '</SampleTest>' +
    '</LabStatus>'
  );

  const expectedSampleIds2 = {
    stId: 'ABCD12345',
    labId: 'MHL1234567'
  };

  it('should parse multiple lab updates sample ids', () =>
    expect(
      disatransform.parseLabStatusXML(manyUpdates)
      .then(disatransform.parseSampleIds)
    ).to.eventually.deep.equal(expectedSampleIds2)
  );

  const expectedLabTests2 = [{
    testType: 'TESTB'
  }, {
    testType: 'TESTC'
  }];

  it('should parse multiple lab updates lab tests', () =>
    expect(
      disatransform.parseLabStatusXML(manyUpdates)
      .then(disatransform.parseLabTests)
    ).to.eventually.deep.equal(expectedLabTests2)
  );

  const expectedChanges2 = [{
    statusDate: new Date('2016-01-01T10:00:00.000Z'),
    stage: 'labstatus',
    facility: 'MHL',
    status: 'RVW',
    labTestType: 'TESTB',
    labRejection: null
  }, {
    statusDate: new Date('2016-01-01T10:00:00.000Z'),
    stage: 'labstatus',
    facility: 'MHL',
    status: 'REJ',
    labTestType: 'TESTC',
    labRejection: 'SOBAD'
  }];

  it('should parse multiple lab update changes', () =>
    expect(
      disatransform.parseLabStatusXML(manyUpdates)
      .then(disatransform.parseChanges)
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
      disatransform.parseLabStatusXML(manyUpdates)
      .then(disatransform.parseMetadata)
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
      statusDate: new Date('2016-01-01T10:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTestType: '*',
      labRejection: null
    }
  ];

  const expectedFilledChanges = [
    {
      statusDate: new Date('2016-01-01T10:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTest: labTests[0].uuid,
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T10:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTest: labTests[1].uuid,
      labRejection: null
    }
  ];

  it('should add lab references to changes given lab tests', () =>
    expect(
      disatransform.fillChangesLabTestRefs(c1, labTests)
    ).to.eventually.deep.equal(expectedFilledChanges)
  );

  const c2 = [
    {
      statusDate: new Date('2016-01-01T10:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTestType: '*',
      labRejection: null
    }, {
      statusDate: new Date('2016-01-01T10:00:00.000Z'),
      stage: 'labstatus',
      facility: 'MHL',
      status: 'PRT',
      labTestType: 'TESTD', // This test does not exist in the database
      labRejection: null
    }
  ];

  it('should throw an error for unrecognized change lab test types', () =>
    expect(
      disatransform.fillChangesLabTestRefs(c2, labTests)
    ).to.eventually.be.rejectedWith(Error)
  );

  var expectedXML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<labstatus id="labstatus">' +
    '<stid>ABCD12345</stid><labid>MHL1234567</labid>' +
    '<labtime>2016-01-01T10:00:00.000Z</labtime>' +
    '<srepeat><labstatus>RVW</labstatus><labtest>TESTB</labtest><labreject/>' +
    '</srepeat>' +
    '<srepeat><labstatus>REJ</labstatus><labtest>TESTC</labtest>' +
    '<labreject>SOBAD</labreject>' +
    '</srepeat>' +
    '</labstatus>'
  );

  it('should convert lab status objects to form submission XML', () =>
    expect(
      disatransform.parseLabStatusXML(manyUpdates)
      .then(parsed => BPromise.join(
        disatransform.parseSampleIds(parsed),
        disatransform.parseStatusDate(parsed),
        disatransform.parseChanges(parsed)
      ))
      .spread(disatransform.buildLabFormSubmission)
    ).to.eventually.equal(expectedXML)
  );

});
