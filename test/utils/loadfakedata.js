#!/usr/local/bin node

'use strict';

const cli = require('commander');
const fakedata = require('./fakedata');

cli
  .usage('[options]')
  .option(
    '-p, --production',
    'Populate the production database (default=development)')
  .option(
    '-c, --changes <n>',
    `Total number of fake changes (default=${fakedata.FAKE_CHANGES_NUM}`,
    parseInt)
  .parse(process.argv);

if (cli.production) {
  process.env.NODE_ENV = 'production';
}

fakedata.load(cli.changes);
