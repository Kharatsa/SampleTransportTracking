'use strict';

import request from '../util/request.js';
import {
  normalizeChanges, normalizeSamples, normalizeMetadata, normalizeSample, normalizeSummary
} from './normalize.js';
import {fromJS} from 'Immutable';

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

const urlWithParams = (url, params) => {
  const immutableParams = fromJS(params);
  console.log('immutableParams: ', immutableParams);
  if (immutableParams.size > 0) {
    const first = immutableParams.entrySeq().first()
    console.log(first);
    const startingString = `${url}?${first[0]}=${first[1]}`
    console.log(startingString);
    const returnURL = immutableParams.rest().reduce((acc, val, key) => {
      return acc.concat(`&${key}=${val}`)
    }, startingString);
    console.log(returnURL);
    return returnURL;
  }
  else {
    return url;
  }
}

const changesURLForFilterAndPage = (summaryFilter, page) => {

  const afterDate = summaryFilter.get('afterDate');
  const beforeDate = summaryFilter.get('beforeDate');
  const regionKey = summaryFilter.get('regionKey');
  const facilityKey = summaryFilter.get('facilityKey');

  var url;
  if (facilityKey) {
    url = `/stt/facility/${facilityKey}/changes`
  }
  else if (regionKey) {
    url = `/stt/region/${regionKey}/changes`
  }
  else {
    url = `/stt/changes`
  }
  return urlWithParams(url, {
    page: page,
    afterDate: dateForAPI(afterDate),
    beforeDate: dateForAPI(beforeDate)
  })
}

export const getChanges = (summaryFilter, options, callback) => {
  console.log(summaryFilter)
  callback = typeof options === 'function' ? options : callback;
  let {page} = options;
  console.log('page in getChanges ', page)
  const url = changesURLForFilterAndPage(summaryFilter, page);
  return request(url, (err, res) => {
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
  return urlWithParams(url, {
    afterDate: dateForAPI(afterDate),
    beforeDate: dateForAPI(beforeDate)
  })
}

export const getSummary = (summaryFilter, callback) => {
  const url = summaryURLForFilter(summaryFilter)
  console.log('FETCH URL: ', url)
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
