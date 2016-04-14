'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const log = require('server/util/logapp.js');
const dates = require('server/util/dates.js');
const datamerge = require('server/util/datamerge.js');

const metaFields = {
  START_DATE: 'start',
  END_DATE: 'end',
  DEVICE_ID: 'deviceid',
  SIM_SERIAL: 'simserial',
  PERSON: 'person',
  REGION: 'region',
  FACILITY: 'facility'
};

// ODK Collect XForms form IDs (should match the top element names)
const formTypes = {
  SAMPLE_DEPARTURE: 'sdepart',
  SAMPLE_ARRIVAL: 'sarrive',
  RESULTS_DEPATURE: 'rdepart',
  RESULTS_ARRIVAL: 'rarrive'
};

// ODK Collect XForms element names
const TYPE_REPEAT = 'trepeat';
const SCAN_REPEAT = 'srepeat';
const ST_ID = 'stid';
const LAB_ID = 'labid';
const ARTIFACT = 'stype';
const STATUS = 'condition';
const END_DATE = 'end';

// Deep object paths from the top element to target text
const FORM_TYPE_PATH = ['$', 'id'];
const END_DATE_PATH = [END_DATE, 0];
const FACILITY_PATH = [metaFields.FACILITY, 0];
const REGION_PATH = [metaFields.REGION, 0];

// Other ODK Collect XForms constants
const DEFAULT_ARTIFACT_TYPE = 'RESULT';
const DEFAULT_STATUS = 'OK';
const DEFAULT_PERSON = null;

const formElement = BPromise.method(parsed => {
  // The parsed xml2js object should include an attribute corresponding to a
  // recognized form type. If the object does not include one of these
  // attributes, the form is unsupported.
  const form = _.values(formTypes).filter(type => {
    return !!parsed[type];
  });

  if (!(form && form[0])) {
    throw new Error(`Cannot identify form type among top elements:
                    ${Object.keys(parsed)}`);
  }

  return form[0];
});

const collectSubmission = xml => {
  const parse = xml2js.parseStringAsync(xml);

  // first top-level element defines the form type
  const form = parse.then(formElement);
  // Only the attributes beneath this top-level element are needed for any
  // additional parsing or data extraction
  return BPromise.join(parse, form, (parsed, formResult) => parsed[formResult])
  .tap(parsed => log.debug('raw parsed submission', parsed));
};

// Parses the sample type repeat element from the parsed xml2js object
const typeRepeats = form => BPromise.resolve(_.get(form, TYPE_REPEAT, []));

// Parses the scan repeat element from the parsed xml2js object
const scanRepeats = outer => BPromise.resolve(_.get(outer, SCAN_REPEAT, []));

const prepareKey = text =>
  (text && text.length ? text.toUpperCase().trim() : text);

/**
 * @callback getTextCallback
 * @param {Object} An object produced by xml2js
 * @return {any} [description]
 */

/**
 * Get text from attributes whose only children will be text nodes. These
 * text nodes, like other children elements, are parsed into an array. For
 * example, the following XML:
 *   <someElement>foo</someElement><someElement>bar</someElement>
 * Is converted by xml2js to the following Array:
 *   [{someElement: ['foo']}, {someElement: ['bar']}]
 *
 * attributeParser({'someElement'}) returns a function. This function in
 * turn would returns the text 'foo' and 'bar' given the objects at index 0 and
 * 1 respectively.
 *
 * @param {Object} options [description]
 * @param {string} options.source The attribute on the target object to be extracted
 * @param {string} [options.dest=options.source] The attribute on the result object
 * @param {any} [options.defaultValue] [description]
 * @return {getTextCallback}
 */
const attributeParser = (options) => {
  options = options || {};
  if (!options.source) {
    throw new Error('Missing required parameter - source');
  }
  const defaultValue = options.defaultValue;
  const source = options.source;
  const dest = options.dest || source;
  const transform = options.transform || (val => val);

  // Returned function parses the attributes from the target Object
  return target => {
    let result = Object.assign({}, target);
    const value = _.get(target, [source, 0]);
    if (value || typeof defaultValue !== 'undefined') {
      result[dest] = transform(value) || defaultValue;
    }
    if (value && source !== dest) {
      delete result[source];
    }
    return result;
  };
};

/**
 * Apply the provided attribute getters, and merge the results into a single
 * result object.
 *
 * @param  {Object} repeat  [description]
 * @param  {Array.<Function>} getters [description]
 * @return {Promise.<Object>}         [description]
 */
const repeatAttributeReducer = (repeat, getters) => {
  return BPromise.reduce(getters, (reduced, getter) => {
    return getter(reduced);
  }, repeat);
};

/**
 * Given a form object, this function produces an flat Array of parsed objects.
 * The getter functions are called on each repeat section (type and scan) to
 * build the parsed objects. When scan repeats are nested beneath/inside type
 * repeats, then the type repeats are parsed first, followed by the scan
 * repeats. The type repeat parsed objects are combined or flattened into all
 * descendent scan repeats.
 *
 * @param  {Object} options [description]
 * @param {!Object} options.target [description]
 * @param {Array.<getTextCallback>} options.getters [description]
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If options.target is undefined, options.getters is undefined,
 *                    or options.getters.length is falsy
 */
const repeatsFlat = options => {
  options = options || {};
  if (!options.target) {
    throw new Error('Missing required options parameter: target');
  }
  if (!(options.getters && options.getters.length)) {
    throw new Error('Missing required options parameter: getters');
  }

  return typeRepeats(options.target)
  .then(repeats => {
    if (!(repeats && repeats.length)) {
      return scanRepeats(options.target);
    }
    return BPromise.map(repeats, outer =>
      scanRepeats(outer)
      .map(inner => Object.assign({}, _.omit(outer, SCAN_REPEAT), inner)));
  })
  .then(_.flatten)
  .map(repeat => repeatAttributeReducer(repeat, options.getters))
  .then(repeats => {
    if (options.pick && options.pick.length) {
      return BPromise.map(repeats, repeat => _.pick(repeat, options.pick));
    }
    return repeats;
  });
};

// Attribute getter for sample tracking ID
const stIdTextGet = attributeParser({
  source: ST_ID,
  dest: 'stId',
  defaultValue: null
});

// Attribute getter for lab ID
const labIdTextGet = attributeParser({
  source: LAB_ID,
  dest: 'labId',
  defaultValue: null
});

/**
 * Parses the sample ID objects from the form
 * @param  {Object} form  xml2js form object
 * @return {Promise.<Array.<Object>>}
 */
const sampleIds = form => {
  return repeatsFlat({
    target: form,
    getters: [stIdTextGet, labIdTextGet],
    pick: ['stId', 'labId']
  })
  .filter(results => results.stId || results.labId)
  .then(results => _.uniqBy(results, ids => ids.stId + ids.labId))
  .then(results => {
    const formType = prepareKey(_.get(form, FORM_TYPE_PATH));
    if (formType.toUpperCase() === formTypes.SAMPLE_DEPARTURE.toUpperCase()) {
      const originFacility = prepareKey(_.get(form, FACILITY_PATH));
      return BPromise.map(results, result =>
        Object.assign({}, result, {origin: originFacility}));
    }
    return results;
  });
};

// Attribute getter for artifact type
const artifactText = attributeParser({
  source: ARTIFACT,
  dest: 'artifactType',
  defaultValue: DEFAULT_ARTIFACT_TYPE,
  transform: prepareKey
});

/**
 * Parse the artifact objects from the form
 * @param  {Object} form  xml2js form object
 * @return {Promise.<Array.<Object>>}
 */
const artifacts = form => {
  return repeatsFlat({
    target: form,
    getters: [stIdTextGet, labIdTextGet, artifactText],
    pick: ['stId', 'labId', 'artifactType']
  })
  .filter(results => results.stId || results.labId)
  .then(results => _.uniqBy(results,
    item => item.artifactType + item.stId + item.labId
  ));
};

// Attribute getter for condition or status
const statusText = attributeParser({
  source: STATUS,
  dest: 'status',
  defaultValue: DEFAULT_STATUS,
  transform: prepareKey
});

/**
 * Parse the change objects from the form
 * @param  {Object} form  xml2js form object
 * @return {Promise.<Array.<Object>>}
 */
const changes = (form, username) => {
  // Top-level elements shared among all changes
  const parseDate = dates.parseXMLDate(_.get(form, END_DATE_PATH));
  const common = {
    stage: prepareKey(_.get(form, FORM_TYPE_PATH)),
    facility: prepareKey(_.get(form, FACILITY_PATH)),
    person: prepareKey(username ? username : DEFAULT_PERSON)
  };

  const parseRepeats = repeatsFlat({
    target: form,
    getters: [stIdTextGet, labIdTextGet, artifactText, statusText],
    pick: ['stId', 'labId', 'artifactType', 'status']
  });

  return BPromise.join(parseDate, parseRepeats, (statusDate, repeats) => {
    return BPromise.map(repeats, repeat =>
      Object.assign({}, {statusDate}, common, repeat));
  })
  .filter(results => results.stId || results.labId);
};

const metaRegion = form => {
  return {key: prepareKey(_.get(form, REGION_PATH))};
};

const metaFacility = form => {
  const facilityKey = prepareKey(_.get(form, FACILITY_PATH));
  const regionKey = prepareKey(_.get(form, REGION_PATH));
  return {key: facilityKey, region: regionKey};
};

/**
 * Replaces the stId/labId value pair with the corresponding sampleId reference
 * (uuid).
 *
 * @method [fillSampleIdRefs]
 * @param {Array.<Object>} artifacts [description]
 * @param {Array.<Object>} sampleIds [description]
 * @return {Promise.<Array.<Object>>}  Array of artifacts with sampleId uuids
 */
const fillSampleIdRefs = BPromise.method((artifacts, sampleIds) => {
  if (!sampleIds) {
    throw new Error('Missing required parameter sampleIds');
  }
  if (!_.every(sampleIds, sampleId => !!sampleId.uuid)) {
    throw new Error('Missing required sampleIds uuid');
  }

  const mapStIds = datamerge.propKeyReduce(
    {items: sampleIds, propNames: ['stId']});
  const mapLabIds = datamerge.propKeyReduce(
    {items: sampleIds, propNames: ['labId']});

  return BPromise.join(mapStIds, mapLabIds)
  .spread((stIdMapper, labIdMapper) => {

    return BPromise.map(artifacts, artifact => {
      const id = artifact.stId || artifact.labId;
      const sampleId = stIdMapper[id] || labIdMapper[id];
      if (!sampleId) {
        throw new Error(`Failed to pair artifact ${JSON.stringify(artifact)} to
                        sampleIds ${JSON.stringify(sampleIds)}`);
      }
      return Object.assign({},
        _.omit(artifact, ['stId', 'labId']),
        {sampleId: sampleId.uuid}
      );
    });
  });
});

/**
 * Replaces the stId/labId value pair with the corresponding sampleId reference
 * (uuid). Using this sample reference, this function replaces the artifactType
 * value with the correct artifact reference (uuid).
 *
 * @param  {Array.<Object>} changes   [description]
 * @param  {Array.<Object>} sampleIds [description]
 * @param  {Array.<Object>} artifacts [description]
 * @return {Promise.<Array.<Object>>}  Array of changes with artifact uuids
 */
const fillArtifactRefs = (changes, sampleIds, artifacts) => {
  // Lookup samples by the STT IDs
  const mapStIds = datamerge.propKeyReduce(
    {items: sampleIds, propNames: ['stId']});
  const mapLabIds = datamerge.propKeyReduce(
    {items: sampleIds, propNames: ['labId']});

  // Lookup artifacts by sampleId (uuid) and artifactType (metadata key)
  const mapArtifacts = datamerge.propKeyReduce(
    {items: artifacts, propNames: ['sampleId', 'artifactType']});

  return BPromise.join(mapStIds, mapLabIds, mapArtifacts)
  .spread((stIdMapper, labIdMapper, artifactMapper) => {

    return BPromise.map(changes, change => {
      const id = change.stId || change.labId;
      const sampleId = stIdMapper[id] || labIdMapper[id];
      const artifactsByType = artifactMapper[sampleId.uuid];
      if (!artifactsByType) {
        throw new Error(`Failed to pair change ${JSON.stringify(change)} to
                        artifacts ${JSON.stringify(artifacts)}`);
      }
      const artifact = artifactsByType[change.artifactType];
      return Object.assign({},
        // Change objects should not include stId, labId, and artifactType
        // values. Instead, each change holds a reference to an artifact (by
        // uuid), which in turn holds a reference to a sample (by uuid)
        _.omit(change, ['stId', 'labId', 'artifactType']),
        {artifact: artifact.uuid}
      );
    });
  });
};

module.exports = {
  collectSubmission,
  sampleIds,
  artifacts,
  changes,
  metaRegion,
  metaFacility,
  fillSampleIdRefs,
  fillArtifactRefs
};
