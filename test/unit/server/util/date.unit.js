'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const dates = require('server/util/dates.js');

describe('Date parser', () => {

  it('should parse YYYY-MM-DD HH:MM:SS.s date strings', () =>
    expect(dates.parseXMLDate('2016-02-15 10:09:05.0'))
    .to.eventually.deep.equal(new Date('2016-02-15T10:09:05.000Z'))
  );

  it('should parse YYYY-MM-DDTHH:MM:SS.sss+TZ date strings', () =>
    expect(dates.parseXMLDate('2016-02-16T13:53:32.963+02'))
    .to.eventually.deep.equal(new Date('2016-02-16T13:53:32.963+02:00'))
  );

  it('should return null for unrecognized date strings', () =>
    expect(dates.parseXMLDate('xyz'))
    .to.eventually.be.null
  );
});
