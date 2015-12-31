'use strict';

const BPromise = require('bluebird');
const libxml = require('libxmljs');
const parseText = require('app/common/parse.js').parseText;
const log = require('app/server/util/log.js');

function getXMLNamespaceAttributes(element) {
  var ns = element.namespace();
  var nsPrefix = (
    ns.prefix() === null || typeof ns.prefix() === 'undefined' ?
    'xmlns' : ns.prefix()
  );
  return {
    namespace: ns,
    prefix: nsPrefix,
    uri: ns.href()
  };
}

function findElementXPath(namespacePrefix, elementName) {
  return './/' + namespacePrefix + ':' + elementName;
}

function getElementText(parentElem, elementName, nsPrefix, nsUri) {
  var target = parentElem.get(findElementXPath(nsPrefix, elementName), nsUri);
  return (
    target !== null && typeof target !== 'undefined' ?
    target.text() :
    null
  );
}

function reduceElements(parentElem, elemNames, nsPrefix, nsUri) {
  if (typeof nsPrefix === 'undefined' || typeof nsUri === 'undefined') {
    var ns = getXMLNamespaceAttributes(parentElem);
    nsPrefix = ns.prefix;
    nsUri = ns.uri;
  }

  return BPromise.reduce(elemNames, function(result, elemName) {
    var text = getElementText(parentElem, elemName, nsPrefix, nsUri);
    result[elemName] = parseText(text);
    return result;
  }, {});
}

/**
 * Enum for ODK Aggregate form list elements
 * @enum {string}
 */
const formListXFormElements = {
  FORM_ID: 'formID',
  NAME: 'name',
  MAJOR_MINOR_VERSION: 'majorMinorVersion',
  VERSION: 'version',
  HASH: 'hash',
  DOWNLOAD_URL: 'downloadUrl',
  MANIFEST_URL: 'manifestUrl'
};

const formListXFormElementNames = Object.keys(formListXFormElements).map(
  name => formListXFormElements[name]
);

const xFormElementName = 'xform';

/**
 * Parses the XML form list to an object. The resulting object will take the
 * shape shown below. The keys for the 'xform' objects are all enumerated in the
 * formListXFormElements enum constant.
 *
 * {xforms: [
 *   {xform: {
 *     formID: 'something', name: 'something', ..., manifestUrl: 'http://something'
 *   }},
 *   {...},
 *   ...
 * ]}
 *
 * @param  {string} xml     The ODK Aggregate form list XML
 * @return {Promise.<Object>}
 */
function parseFormList(xml) {
  log.debug('Parsing form list XML', xml);
  var doc = libxml.parseXmlString(xml);
  var rootElem = doc.root();
  var ns = getXMLNamespaceAttributes(rootElem);

  var xformsXPathQuery = findElementXPath(ns.prefix, xFormElementName);
  return BPromise.map(rootElem.find(xformsXPathQuery, ns.uri),
    xformElem => reduceElements(xformElem, formListXFormElementNames, ns.prefix, ns.uri)
  )
  .map(xform => ({xform: xform}))
  .then(xforms => ({xforms: xforms}));
}


/**
 * Enum for ODK Aggregate submission list elements
 * @enum {string}
 */
const submissionListElements = {
  ID_CHUNK: 'idChunk',
  ID_LIST: 'idList',
  ID_LIST_ID: 'id',
  R_CURSOR: 'resumptionCursor'
};

/**
 * Enum for ODK Aggregate submission list cursor elements
 * @enum {string}
 */
const cursorElements = {
  ATTR_NAME: 'attributeName',
  ATTR_VAL: 'attributeValue',
  URI_LAST_VALUE: 'uriLastReturnedValue',
  IS_FORWARD: 'isForwardCursor'
};

const cursorElementNames = Object.keys(cursorElements).map(
  name => cursorElements[name]
);

function parseIdList(idListElem, nsPrefix, nsUri) {
  var idXPathQuery = findElementXPath(
    nsPrefix, submissionListElements.ID_LIST_ID
  );
  var idElems = idListElem.find(idXPathQuery, nsUri);
  return BPromise.map(idElems, elem => ({id: elem.text()}));
}

function parseResumptionCursor(rCursorElem) {
  var cursorElem = rCursorElem.child(0);
  return BPromise.props({cursor:
    reduceElements(cursorElem, cursorElementNames)
  });
}

function parseSubmissionList(xml) {
  log.debug('Parsing submission list XML', xml);

  var doc = libxml.parseXmlString(xml);
  var rootElem = doc.root();
  var ns = getXMLNamespaceAttributes(rootElem);

  var idListXPathQuery = findElementXPath(
    ns.prefix, submissionListElements.ID_LIST
  );
  var idListElem = rootElem.get(idListXPathQuery, ns.uri);
  var rcursorXPathQuery = findElementXPath(
    ns.prefix, submissionListElements.R_CURSOR
  );
  var rcursorElem = rootElem.get(rcursorXPathQuery, ns.uri);

  return BPromise.props({
    idList: parseIdList(idListElem, ns.prefix, ns.uri),
    resumptionCursor: parseResumptionCursor(rcursorElem, ns.prefix, ns.uri)
  })
  .then(chunk => ({idChunk: chunk}));
}

// function parseSubmissionMeta(topElem) {
//   // TODO
// }

// function parseSubmission(xml) {
//     log.debug('Parsing submission XML', xml);

//   var doc = libxml.parseXmlString(xml);
//   var rootElem = doc.root();
//   var ns = getXMLNamespaceAttributes(rootElem);

//   return reduceElements(cursorElem, [
//     ''
//   ])

// }

module.exports = {
  parseFormList: parseFormList,
  parseSubmissionList: parseSubmissionList
  // parseSubmission: parseSubmission
};
