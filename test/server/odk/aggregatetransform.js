'use strict';

const chai = require('chai');
const expect = chai.expect;
const aggregatetransform = require('app/server/odk/sync/aggregatetransform.js');

describe('Aggregate XML Data Transforms', () => {

  describe('form list tranform', () => {
    const formListXML = (
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

    var parsedFormList = [
      {
        formId: 'sdepart',
        formName: 'Sample Departure',
        majorMinorVersion: 2,
        version: 2,
        hash: 'md5:647a015d5b1ac13168f6112518397eb4',
        downloadUrl: 'http://odk.kharatsa.com/formXml?formId=sdepart',
        manifestUrl: 'http://odk.kharatsa.com/xformsManifest?formId=sdepart'
      },
      {
        formId: 'sarrive',
        formName: null,
        majorMinorVersion: null,
        version: null,
        hash: 'md5:aec4c67a85f476ddd8805143f585caaa',
        downloadUrl: null,
        manifestUrl: 'http://odk.kharatsa.com/xformsManifest?formId=sarrive'
      }
    ];

    it('should parse form list XML to form objects', done => {
      return aggregatetransform.parseFormList(formListXML)
      .then(result => expect(result).to.deep.equal(parsedFormList))
      .then(() => done());
    });
  });

});
