'use strict';

import request from '../util/request.js';
import {
  normalizeChanges, normalizeMetadata, normalizeSample, normalizeSummary
} from './normalize.js';

const summaryFilterValues = summaryFilter => {
  //validity checking for region / facility here?
  const regionKey = summaryFilter.get('regionKey');
  const facilityKey = summaryFilter.get('facilityKey');

  const afterDateLocal = summaryFilter.get('afterDate');
  const beforeDateLocal = summaryFilter.get('beforeDate');

  return {afterDateLocal, beforeDateLocal, regionKey, facilityKey};
};

const pageURLParam = ({page, first=true}) => {
  const prefix = first ? '?' : '&';
  return page ? `${prefix}page=${page}` : '';
};

export const locationURLParams = ({facilityKey, regionKey}) => {
  if (facilityKey && regionKey) {
    throw new Error('Both of facilityKey and regionKey cannot be passed');
  }

  const facilityPart = facilityKey ? `facility/${facilityKey}/` : '';
  const regionPart = regionKey ? `region/${regionKey}/` : '';

  // Only 1 of regionKey and facilityKey may be included
  return regionPart || facilityPart;
};

export const dateURLParams = ({afterDateLocal, beforeDateLocal}) => {
  if (!(afterDateLocal && beforeDateLocal)) {
    throw new Error('Missing required parameter afterDate or beforeDate');
  }

  const afterDatePart = `?afterDate=${afterDateLocal.toISOString()}`;
  const beforeDatePart = `&beforeDate=${beforeDateLocal.toISOString()}`;

  return `${afterDatePart}${beforeDatePart}`;
};

/**
 * Applies standard filter parameters to the endpoint
 *
 * @param {string} endpoint
 * @param {Immutable.Record} summaryFilter SummaryFilter type Immutable Record
 * @return {string}
 */
export const filteredURL = (endpoint, summaryFilter, page=null) => {
  const filterValues = summaryFilterValues(summaryFilter);

  const paramsPart = locationURLParams(filterValues);
  const queryPart = dateURLParams(filterValues);
  const pagePart = pageURLParam({page, first: false});

  return `/stt/${paramsPart}${endpoint}${queryPart}${pagePart}`;
};


export const getSampleDetail = (sampleId, callback) => {
  if (typeof sampleId === 'undefined') {
    throw new Error('Missing required options.sampleId parameter');
  }

  return request(`/stt/ids/${sampleId}/changes`, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeSample(res.json));
  });
};

export const getChanges = (filter, page=1, callback) => {
  page = Number.parseInt(page);
  const url = filteredURL('changes', filter, page);
  return request(url, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeChanges(res.json));
  });
};

export const getSummary = (filter, callback) => {
  const url = filteredURL('summary', filter);
  return request(url, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeSummary(res.json));
  });
};

export const getMetadata = (options, callback) => {
  callback = typeof options === 'function' ? options : callback;
  return request('/stt/meta', (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeMetadata(res.json));
  });
};
