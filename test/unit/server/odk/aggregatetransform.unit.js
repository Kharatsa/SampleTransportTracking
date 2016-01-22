'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const aggregatetransform = require('app/server/odk/sync/aggregatetransform.js');

describe('Aggregate XML Data Transforms', () => {

  describe.skip('form list tranform', () => {
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

    it('should parse form list XML to form objects', () =>
      expect(aggregatetransform.parseFormList(formListXML))
      .to.eventually.deep.equal(parsedFormList)
    );

    const formManifestXML = (
      '<manifest xmlns="http://openrosa.org/xforms/xformsManifest">' +
        '<mediaFile>' +
          '<filename>pg1342.txt</filename>' +
          '<hash>md5:01234</hash>' +
          '<downloadUrl>' +
            'https://www.gutenberg.org/cache/epub/1342/pg1342.txt' +
          '</downloadUrl>' +
        '</mediaFile>' +
        '<mediaFile>' +
          '<filename>pg2701.txt</filename>' +
          '<downloadUrl>' +
            'https://www.gutenberg.org/cache/epub/2701/pg2701.txt' +
          '</downloadUrl>' +
        '</mediaFile>' +
      '</manifest>'
    );

    const parsedManifest = [
      {
        filename: 'pg1342.txt',
        hash: 'md5:01234',
        downloadUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.txt'
      },
      {
        filename: 'pg2701.txt',
        hash: null,
        downloadUrl: 'https://www.gutenberg.org/cache/epub/2701/pg2701.txt'
      }
    ];

    it('should parse form list manifest XML', () =>
      expect(aggregatetransform.parseFormManifest(formManifestXML))
      .to.eventually.deep.equal(parsedManifest)
    );

    const submissionListXML = (
      '<idChunk xmlns="http://opendatakit.org/submissions">' +
        '<idList>' +
          '<id>uuid:e1ba</id>' +
          '<id>uuid:433d</id>' +
          '<id>uuid:6846</id>' +
        '</idList>' +
        '<resumptionCursor>' +
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta' +
        '</resumptionCursor>' +
      '</idChunk>'
    );

    const parsedSubmissionList = {
      ids: ['uuid:e1ba', 'uuid:433d', 'uuid:6846'],
      cursor: (
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ' +
        'nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. ' +
        'Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. ' +
        'Praesent mauris. Fusce nec tellus sed augue semper porta')
    };

    it('should parse submission list XML', () =>
      expect(aggregatetransform.parseSubmissionList(submissionListXML))
      .to.eventually.deep.equal(parsedSubmissionList)
    );

  });

});
