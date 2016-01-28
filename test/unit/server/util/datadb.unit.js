'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const dbresult = require('app/server/storage/dbresult.js');

describe('Database Results Helper Functions', () => {
  const source = {
    a: 1, b: 2, c: 3
  };
  const match = {
    a: 1, b: 2, c: 3, d: 4, e: 5
  };
  it('should identify objects with matching props as equal', () =>
    expect(dbresult.commonPropsEqual(source, match))
    .to.equal(true)
  );

  const missingProps = {
    a: 1, c: 3, d: 4, e: 5
  };

  it('should identify objects with missing props as not equal', () =>
    expect(dbresult.commonPropsEqual(source, missingProps))
    .to.equal(false)
  );

  const mismatched = Object.assign({}, match, {b: 99});

  it('should identify objects with mismatched prop values as not equal', () =>
    expect(dbresult.commonPropsEqual(source, mismatched))
    .to.equal(false)
  );

  const raw = {
    id: 1,
    uuid: 'xyz',
    a: 2,
    createdAt: 'YOLO',
    updatedAt: 'YOYO'
  };
  const dateFiltered = {id: 1, uuid: 'xyz', a: 2};

  it('should exclude database date columns from objects', () =>
    expect(dbresult.omitDateDBCols(raw))
    .to.deep.equal(dateFiltered)
  );

  const allFiltered = {a: 2};

  it('should exclude database columns from objects', () =>
    expect(dbresult.omitDBCols(raw))
    .to.deep.equal(allFiltered)
  );
});
