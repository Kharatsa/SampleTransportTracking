'use strict';

import request from '../util/request.js';
import {
  normalizeChanges, normalizeSamples, normalizeMetadata, normalizeSample
} from './normalize.js';

const pagedURL = (url, page) => `${url}?page=${page}`;
const urlWithDates = (url, afterDate, beforeDate) => `${url}?afterDate=${afterDate}&beforeDate=${beforeDate}`
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

export const getSummary = (options, callback) => {
  let {afterDate, beforeDate, region, facility} = options;
  var url;
  if (facility) {
    url = `/stt/facility/${facility}/summary`
  }
  else if (region) {
    url = `/stt/region/${region}/summary`
  }
  else {
    url = `/stt/summary`
  }
  return request(urlWithDates(url, afterDate, beforeDate), (err, res) => {
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
