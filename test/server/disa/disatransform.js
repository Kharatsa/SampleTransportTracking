'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const disatransform = require('app/server/disa/disatransform.js');

describe('Disa Labs Tranforms', () => {
  var goodSubmission = (
    '<?xml version="1.0"?><LabStatus xmlns="http://SomeMoHDomain/LabStatus.xsd" >' +
    ' <STID>ABCD12345</STID>' +
    ' <LabID>MHL1234567</LabID>' +
    ' <StatusTimestamp>2015-12-07T21:32:52</StatusTimestamp>' +
    ' <SampleTest>' +
    '   <StatusCode>PRT</StatusCode>' +
    '   <TestCode>*</TestCode>' +
    ' </SampleTest>' +
    '</LabStatus>');

  var expected = {
    stId: 'ABCD12345',
    labId: 'MHL1234567',
    statusTime: new Date('2015-12-07T21:32:52'),
    tests: [{statusCode: 'PRT', testCode: '*', rejectCode: null}]
  };

  it('should parse submissions with no reject code and 1 test', () =>
    expect(disatransform.parseLabStatus(goodSubmission))
      .to.eventually.deep.equal(expected)
  );

  goodSubmission = (
    '<?xml version="1.0"?><LabStatus xmlns="http://SomeMoHDomain/LabStatus.xsd" >' +
    ' <STID>ABCD12345</STID>' +
    ' <LabID>MHL1234567</LabID>' +
    ' <StatusTimestamp>2015-12-07T21:32:52</StatusTimestamp>' +
    ' <SampleTest>' +
    '   <StatusCode>REQ</StatusCode>' +
    '   <TestCode>TEST1</TestCode>' +
    ' </SampleTest>' +
    ' <SampleTest>' +
    '   <StatusCode>RVW</StatusCode>' +
    '   <TestCode>TEST2</TestCode>' +
    ' </SampleTest>' +
    ' <SampleTest>' +
    '   <StatusCode>REJ</StatusCode>' +
    '   <TestCode>TEST3</TestCode>' +
    '   <RejectionCode>BAD</RejectionCode>' +
    ' </SampleTest>' +
    '</LabStatus>');

  expected = {
    stId: 'ABCD12345',
    labId: 'MHL1234567',
    statusTime: new Date('2015-12-07T21:32:52'),
    tests: [
      {statusCode: 'REQ', testCode: 'TEST1', rejectCode: null},
      {statusCode: 'RVW', testCode: 'TEST2', rejectCode: null},
      {statusCode: 'REJ', testCode: 'TEST3', rejectCode: 'BAD'}
    ]
  };

  it('should parse submissions with multiple tests', () =>
    expect(disatransform.parseLabStatus(goodSubmission))
      .to.eventually.deep.equal(expected)
  );

});
