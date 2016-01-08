'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const disatransform = require('app/server/disa/disatransform.js');

describe('Disa Labs Tranforms', () => {
  var goodSingleSubmission = (
    '<?xml version="1.0"?><LabStatus xmlns="http://SomeMoHDomain/LabStatus.xsd" >' +
    ' <STID>ABCD12345</STID>' +
    ' <LabID>MHL1234567</LabID>' +
    ' <StatusTimestamp>2015-12-07T21:32:52</StatusTimestamp>' +
    ' <SampleTest>' +
    '   <StatusCode>PRT</StatusCode>' +
    '   <TestCode>*</TestCode>' +
    ' </SampleTest>' +
    '</LabStatus>'
  );

  var expectedStatus = {
    stid: 'ABCD12345',
    labid: 'MHL1234567',
    labtime: new Date('2015-12-07T21:32:52').toISOString(),
    srepeat: [{labstatus: 'PRT', labtest: '*', labreject: null}]
  };

  it('should parse submissions with no reject code and 1 test', () =>
    expect(disatransform.parseLabStatus(goodSingleSubmission))
      .to.eventually.deep.equal(expectedStatus)
  );

  var goodManySubmission = (
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
    '</LabStatus>'
  );

  var expectedManyStatus = {
    stid: 'ABCD12345',
    labid: 'MHL1234567',
    labtime: new Date('2015-12-07T21:32:52').toISOString(),
    srepeat: [
      {labstatus: 'REQ', labtest: 'TEST1', labreject: null},
      {labstatus: 'RVW', labtest: 'TEST2', labreject: null},
      {labstatus: 'REJ', labtest: 'TEST3', labreject: 'BAD'}
    ]
  };

  it('should parse submissions with multiple tests', () =>
    expect(disatransform.parseLabStatus(goodManySubmission))
      .to.eventually.deep.equal(expectedManyStatus)
  );

  var expectedXML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<labstatus id="labstatus">' +
    '<stid>ABCD12345</stid><labid>MHL1234567</labid>' +
    '<labtime>2015-12-07T21:32:52.000Z</labtime>' +
    '<srepeat><labstatus>REQ</labstatus><labtest>TEST1</labtest><labreject/></srepeat>' +
    '<srepeat><labstatus>RVW</labstatus><labtest>TEST2</labtest><labreject/></srepeat>' +
    '<srepeat><labstatus>REJ</labstatus><labtest>TEST3</labtest><labreject>BAD</labreject></srepeat>' +
    '</labstatus>'
  );

  it('should convert lab status objects to XML form submissions', () =>
    expect(
      disatransform.parseLabStatus(goodManySubmission)
      .then(disatransform.buildLabForm)
    ).to.eventually.equal(expectedXML)
  );

});
