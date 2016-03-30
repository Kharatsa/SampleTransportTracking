#!/usr/bin/env node --harmony

'use strict';

const cli = require('commander');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const metamodels = require('app/server/stt/models/metadata');
const metaclients = require('app/server/stt/clients/metadata');
const beforecli= require('./utils/clibefore.js');
const clireport = require('./utils/clireport.js');

const before = beforecli({models: metamodels});

cli.option('-d --development', 'Run commands on development database ' +
           '(default: production');

const metaModelPrefix = 'Meta';
const metaModelNames = Object.keys(metamodels).map(key => metamodels[key].name);
const metaTypes = metaModelNames.map(name => {
  if (!name.startsWith(metaModelPrefix)) {
    throw new Error(`Metadata model missing required prefix: "${metaModelPrefix}"`);
  }
  const lower = name.substr(metaModelPrefix.length, 1).toLowerCase();
  const rest = name.substr(metaModelPrefix.length + 1);
  return `${lower}${rest}`;
});

const prefixedName = name => {
  const upper = name.substr(0, 1).toUpperCase();
  const rest = name.substr(1);
  return `${metaModelPrefix}${upper}${rest}`;
};

const namedMetaClient = BPromise.method((storage, name) => {
  const client = metaclients[name];
  const model = storage.models[prefixedName(name)];
  if (typeof client === 'undefined') {
    throw new Error(`Failed to load database client for type=${name}
      Metadata type must exactly match one of:
      ${metaTypes.join(', ')}`);
  } if (typeof model === 'undefined') {
    throw new Error(`Failed to load database model for type=${name}`);
  }
  return client({db: storage.db, model});
});

const formatDateValue = date => date ? date.toISOString() : date;

const defaultMetaColumnSettings = [
  {name: 'key', header: 'Key', width: 15},
  {name: 'value', header: 'Value', width: 45}
];

const defaultMetaDateSettings = [
  {name: 'createdAt', header: 'Created At', width: 28,
    formatter: formatDateValue},
  {name: 'updatedAt', header: 'Updated At', width: 28,
    formatter: formatDateValue}
];

const oneMetaRow = (meta, attrs, formatters) => {
  return BPromise.map(attrs, (attr, index) => {
    const formatFunc = formatters[index];
    return formatFunc(meta[attr]) || '';
  });
};

const displayMetaTable = (metadata, extraSettings) => {
  let tableSettings = defaultMetaColumnSettings;
  if (typeof extraSettings !== 'undefined') {
    // Add the extra settings before the createdAt and updatedAt
    tableSettings = [].concat(tableSettings, extraSettings);
  }
  tableSettings = [].concat(tableSettings, defaultMetaDateSettings);

  const attrs = tableSettings.map(setting => setting.name);
  const formatters = tableSettings.map(setting =>
    setting.formatter || (val => (val)));

  const headers = tableSettings.map(setting => setting.header);
  const widths = tableSettings.map(setting => setting.width);

  const Table = require('cli-table');
  const table = new Table({
    head: headers,
    colWidths: widths
  });

  return BPromise.map(metadata, meta => oneMetaRow(meta, attrs, formatters))
  .each(meta => table.push(meta))
  .then(() => console.log(table.toString()));
};

const parseOthers = others => others.reduce((reduced, other) => {
  const parts = other.split('=');
  reduced[parts[0]] = parts[1] || null;
  return reduced;
}, {});

const othersStrings = others =>
  Object.keys(others).map(key => `  ${key} = ${others[key]}`);

const inputsString = (type, key, value, others) => {
  return `type = ${type}\n  key = ${key}` +
    `\n  value = ${value}\n${othersStrings(others).join('\n')}\n`;
};

const add = (type, key, value, others) => {
  let otherValues;
  try {
    otherValues = parseOthers(others);
  } catch (err) {
    return BPromise.reject(err);
  }

  log.debug(`Metadata add\n\n  ${inputsString(type, key, value, otherValues)}`);

  const values = Object.assign({}, {key, value}, otherValues);
  log.info(`Creating ${type}-type metadata with object`, values);

  return before({dev: cli.development})
  .then(storage => namedMetaClient(storage, type))
  .then(client => client.create({data: values}))
  .then(result => displayMetaTable(result))
  .catch(err => log.error(err.message));
};

cli.command('add <type> <key> <value> [otherColumn=value...]')
  .description('Add new metadata by type and key, where key is unique ' +
               'for the given type.')
  .action(add);

const remove = (type, key) => {
  return before({dev: cli.development})
  .then(storage => namedMetaClient(storage, type))
  .then(client => client.deleteByKey({data: {key}}))
  .then(count =>
    clireport.handleRemoveResult(count, `${type}-type metadata`, 'key', key))
  .catch(err => log.error(err.message));
};

cli.command('remove <type> <key>')
  .description('Remove metadata by type and key.')
  .action(remove);

// TODO: add support for updates. Delete/add are required presently.
// cli.command('update <type> <key> [otherColumn=value...]')
//   .description('Update existing metadata by type and key.');

const list = type => {
  return before({dev: cli.development})
  .then(storage => namedMetaClient(storage, type))
  .then(client => client.all({allowEmpty: true}))
  .then(results => {
    if (type === 'facilities') {
      displayMetaTable(results,
        [{name: 'region', header: 'Region', width: 10}]);
    } else {
      displayMetaTable(results);
    }
  })
  .catch(err => log.error(err.message, err.stack));
};

cli.command('list <type>')
  .description('List all the metadata by type.')
  .action(list);

const displaySchemaTable = schema => {
  const Table = require('cli-table');
  let table = new Table({
    head: ['Column', 'Type', 'PK', 'NULLable'],
    colWidths: [25, 15, 8, 10]
  });

  return BPromise.map(Object.keys(schema), key => [
    key, schema[key].type, schema[key].primaryKey, schema[key].allowNull
  ])
  .each(row => table.push(row))
  .then(() => console.log(table.toString()));
};

const handleDescribe = type => {
  return before({dev: cli.development})
  .then(storage => namedMetaClient(storage, type))
  .then(client => client.describeSchema({allowEmpty: true}))
  .then(displaySchemaTable);
};

cli.command('describe <type>')
  .description('Describe the metadata table schema by type.')
  .action(handleDescribe);

cli.on('--help', () => {
  console.log('  Valid metadata types:');
  metaTypes.forEach(type => {
    console.log(`\t- ${type}`);
  });
  console.log();
});

cli.parse(process.argv);
