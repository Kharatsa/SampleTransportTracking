'use strict';

const chai = require('chai');
const expect = chai.expect;
const BPromise = require('bluebird');
// const transform = require('app/server/odk/xmltransform');
const xml2js = require('xml2js');
const parseStringAsync = BPromise.promisify(xml2js.parseString);

var formListXML = (
  '<xforms xmlns="http://openrosa.org/xforms/xformsList">' +
    '<xform>' +
      '<formID>sdepart</formID>' +
      '<name>Sample Departure</name>' +
      '<majorMinorVersion>2</majorMinorVersion>' +
      '<version>2</version>' +
      '<hash>md5:647a015d5b1ac13168f6112518397eb4</hash>' +
      '<downloadUrl>http://odk.kharatsa.com/formXml?formId=sdepart</downloadUrl>' +
      '<manifestUrl>' +
      'http://odk.kharatsa.com/xformsManifest?formId=sdepart' +
      '</manifestUrl>' +
    '</xform>' +
    '<xform>' +
      '<formID>sarrive</formID>' +
      '<hash>md5:aec4c67a85f476ddd8805143f585caaa</hash>' +
      '<manifestUrl>' +
      'http://odk.kharatsa.com/xformsManifest?formId=sarrive' +
      '</manifestUrl>' +
    '</xform>' +
  '</xforms>'
);

var parsedFormList = {xforms: [
  {xform: {
    formID: 'sdepart',
    name: 'Sample Departure',
    majorMinorVersion: 2,
    version: 2,
    hash: 'md5:647a015d5b1ac13168f6112518397eb4',
    downloadUrl: 'http://odk.kharatsa.com/formXml?formId=sdepart',
    manifestUrl: 'http://odk.kharatsa.com/xformsManifest?formId=sdepart'
  }},
  {xform: {
    formID: 'sarrive',
    name: null,
    majorMinorVersion: null,
    version: null,
    hash: 'md5:aec4c67a85f476ddd8805143f585caaa',
    downloadUrl: null,
    manifestUrl: 'http://odk.kharatsa.com/xformsManifest?formId=sarrive'
  }}
]};

var submissionListXML = (
  '<idChunk xmlns="http://opendatakit.org/submissions">' +
    '<idList>' +
      '<id>uuid:bf8ce25b-e1ba-4d58-b573-eb98f61f51f1</id>' +
      '<id>uuid:645d8577-433d-4f84-8178-81a2881634bd</id>' +
      '<id>uuid:da9a9f19-6846-452c-b7fa-ab7df61bc9f2</id>' +
      '<id>uuid:4562467b-7130-4cca-84c2-ccbc88816b2d</id>' +
    '</idList>' +
    '<resumptionCursor>' +
      '<cursor xmlns="http://www.opendatakit.org/cursor"><attributeName>_LAST_UPDATE_DATE</attributeName><attributeValue>2015-11-19T02:39:55.000+0000</attributeValue><uriLastReturnedValue>uuid:2f228b78-1394-4cb5-be8c-507037fd9f2c</uriLastReturnedValue><isForwardCursor>true</isForwardCursor></cursor>' +
    '</resumptionCursor>' +
  '</idChunk>'
);
var parsedSubmissionList = {idChunk: {
  idList: [
    {id: 'uuid:bf8ce25b-e1ba-4d58-b573-eb98f61f51f1'},
    {id: 'uuid:645d8577-433d-4f84-8178-81a2881634bd'},
    {id: 'uuid:da9a9f19-6846-452c-b7fa-ab7df61bc9f2'},
    {id: 'uuid:4562467b-7130-4cca-84c2-ccbc88816b2d'}
  ],
  resumptionCursor: {cursor: {
    attributeName: '_LAST_UPDATE_DATE',
    attributeValue: '2015-11-19T02:39:55.000+0000',
    uriLastReturnedValue: 'uuid:2f228b78-1394-4cb5-be8c-507037fd9f2c',
    isForwardCursor: true
  }}
}};

var submissionXML = (
  '<submission xmlns="http://opendatakit.org/submissions" xmlns:orx="http://openrosa.org/xforms">' +
    '<data>' +
      '<sdepart id="sdepart" instanceID="uuid:bf8ce25b-e1ba-4d58-b573-eb98f61f51f1" submissionDate="2015-11-16T01:53:15.000Z" isComplete="true" markedAsCompleteDate="2015-11-16T01:53:15.000Z">' +
      '<start>2015-11-15T01:52:15.000Z</start>' +
      '<end>2015-11-15T01:53:22.000Z</end>' +
      '<deviceid>867979020085780</deviceid>' +
      '<simserial>8901260971103975692</simserial>' +
      '<person>rider1</person>' +
      '<region>maseru</region>' +
      '<facility>domiciliary</facility>' +
      '<srepeat>' +
        '<stid>b9caba788</stid>' +
        '<stype>blood</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>a8e99efb7</stid>' +
        '<stype>sputum</stype>' +
        '<condition>broken</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>60958c825</stid>' +
        '<stype>blood</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>7feda19a8</stid>' +
        '<stype>blood</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<store_gps>40.7637223000 -73.9613886000 0E-10 20.0000000000</store_gps>' +
      '<orx:meta>' +
        '<orx:instanceID>uuid:bf8ce25b-e1ba-4d58-b573-eb98f61f51f1</orx:instanceID>' +
      '</orx:meta>' +
      '</sdepart>' +
    '</data>' +
  '</submission>'
);

describe.skip('ODK Aggregate XML parsers', function() {

  it('should parse form list xml', function(done) {
    return parseStringAsync(formListXML)
    .then(function(parsed) {
      console.dir(parsed, {colors: true, depth: 20});
      console.dir(parsedFormList, {colors: true, depth: 20});
      expect(parsed).to.deep.equal(parsedFormList);
    })
    .then(done);
  });

  it('should parse form submission list xml', function(done) {
    return parseStringAsync(submissionListXML)
    .then(function(parsed) {
      console.dir(parsed, {colors: true, depth: 20});
      console.dir(parsedSubmissionList, {colors: true, depth: 20});
      expect(parsed).to.deep.equal(parsedSubmissionList);
    })
    .then(done);
  });

});
