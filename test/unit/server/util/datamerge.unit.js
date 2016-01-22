'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const merge = require('app/server/util/datamerge.js');

describe('Data Merge Utilities', () => {
  const items = [
    {a: 1, b: 2, c: 3, d: 4},
    {a: 5, b: 2, c: 3, d: 4},
    {a: 3, b: 4, c: 5, d: 6},
    {a: 5, b: 2, c: 3, d: 4},
    {a: 1, b: 99, c: 99, d: 4}
  ];
  const mapProps1 = ['a', 'd'];

  const mapped = {
    1: {
      4: {a: 1, b: 99, c: 99, d: 4}
    },
    3: {
      6: {a: 3, b: 4, c: 5, d: 6}
    },
    5: {
      4: {a: 5, b: 2, c: 3, d: 4}
    }
  };

  it('should reduce an object array to a prop values map object', () =>
    expect(
      merge.propKeyReduce(items, mapProps1)
    ).to.eventually.deep.equal(mapped)
  );

  const incoming1 = [
    {a: 1, b: 2, c: 3, d: 4},
    {a: 2, b: 3, c: 4, d: 5},
    {a: 3, b: 4, c: 5, d: 6},
    {a: 4, b: 5, c: 6, d: 7},
    {a: 5, b: 6, c: 7, d: 8},
    {a: 1, b: 99, c: 99, d: 4}
  ];
  const local1 = [
    {a: 1, b: 99, c: 99, d: 4},
    {a: 3, b: 4, c: 5, d: 6},
    {a: 4, b: 88, c: 88, d: 7}
  ];
  const mapProps2 = ['a', 'd'];
  const merged1 = [
    {
      incoming: {a: 1, b: 2, c: 3, d: 4},
      local: {a: 1, b: 99, c: 99, d: 4}
    }, {
      incoming: {a: 2, b: 3, c: 4, d: 5},
      local: null
    }, {
      incoming: {a: 3, b: 4, c: 5, d: 6},
      local: {a: 3, b: 4, c: 5, d: 6}
    }, {
      incoming: {a: 4, b: 5, c: 6, d: 7},
      local: {a: 4, b: 88, c: 88, d: 7}
    }, {
      incoming: {a: 5, b: 6, c: 7, d: 8},
      local: null
    }, {
      incoming: {a: 1, b: 99, c: 99, d: 4},
      local: {a: 1, b: 99, c: 99, d: 4}
    }
  ];

  it('should pair objects in arrays by prop values', () =>
    expect(
      merge.pairLocalByPropKeys(incoming1, local1, mapProps2)
    ).to.eventually.deep.equal(merged1)
  );

});
