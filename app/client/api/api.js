'use strict';

import request from '../util/request.js';
import {
  normalizeChanges, normalizeSamples, normalizeMetadata, normalizeSample
} from './normalize.js';

const pagedURL = (url, page) => `${url}?page=${page}`;
// TODO: handle empty responses (res.json = {})

export const getSamples = (options, callback) => {
  callback = typeof options === 'function' ? options : callback;
  return request('/stt/ids', (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeSamples(res.json));
  });
};

export const getSampleDetail = (options, callback) => {
  if (!options.sampleId) {
    throw new Error(`Missing required options.sampleId parameter`);
  }
  return request(`/stt/ids/${options.sampleId}/changes`, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeSample(res.json));
  });
};

export const getChanges = (options, callback) => {
  callback = typeof options === 'function' ? options : callback;
  let {page} = options;
  return request(pagedURL('/stt/changes', page), (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeChanges(res.json));
  });
};


const dateForAPI = momentDate => momentDate.format("YYYY-MM-DD")
const urlWithDates = (url, afterDate, beforeDate) => `${url}?afterDate=${dateForAPI(afterDate)}&beforeDate=${dateForAPI(beforeDate)}`

const summaryURLForFilter = (summaryFilter) => {

  const afterDate = summaryFilter.get('afterDate');
  const beforeDate = summaryFilter.get('beforeDate');
  const regionKey = summaryFilter.get('regionKey');
  const facilityKey = summaryFilter.get('facilityKey');

  var url;
  if (facilityKey) {
    url = `/stt/facility/${facilityKey}/summary`
  }
  else if (regionKey) {
    url = `/stt/region/${regionKey}/summary`
  }
  else {
    url = `/stt/summary`
  }
  return urlWithDates(url, afterDate, beforeDate)
}

export const getSummary = (summaryFilter, callback) => {
  const url = summaryURLForFilter(summaryFilter)
  console.log('FETCH URL: ', url)
  return request(url, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, res.json);
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
