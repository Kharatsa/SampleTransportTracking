'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const csv = require('server/util/csv.js');

describe('CSV parser', () => {

  const csvStr1 = (
    `a,b,c
    d,e,f
    g,h,i
    j,k,l
    m,n,o
    p,q,r



      `
  );

  const expected1 = [
    {a: 'd', b: 'e', c: 'f'},
    {a: 'g', b: 'h', c: 'i'},
    {a: 'j', b: 'k', c: 'l'},
    {a: 'm', b: 'n', c: 'o'},
    {a: 'p', b: 'q', c: 'r'}
  ];

  it('should parse CSV files with headers', () =>
    expect(csv.parse(csvStr1))
    .to.eventually.deep.equal(expected1)
  );

  const csvStr2 = (
    `a,b,c
    d,e,f
    g,h,i
    j,k,l
    m,n,o
    p,q,r

    `
  );

  const expected2 = [
    {'0': 'a', '1': 'b', '2': 'c'},
    {'0': 'd', '1': 'e', '2': 'f'},
    {'0': 'g', '1': 'h', '2': 'i'},
    {'0': 'j', '1': 'k', '2': 'l'},
    {'0': 'm', '1': 'n', '2': 'o'},
    {'0': 'p', '1': 'q', '2': 'r'}
  ];

  it('should parse CSV files without headers', () =>
    expect(csv.parse(csvStr2, {headers: false}))
    .to.eventually.deep.equal(expected2)
  );
});
