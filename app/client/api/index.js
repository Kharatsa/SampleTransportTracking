import request from '../util/request.js';
import {
  normalizeChanges, normalizeMetadata, normalizeSample,
  normalizeSummary, normalizeTurnArounds,
  normalizeStageDates, normalizeUsers,
} from './normalize.js';

const pageURLParam = (pageNum) => {
  if (pageNum) {
    return `page=${pageNum}`;
  }
  return '';
};

const locationURLParams = ({facilityKey, regionKey}) => {
  const facilityPart = facilityKey ? `facility/${facilityKey}/` : '';
  const regionPart = regionKey ? `region/${regionKey}/` : '';

  // Only 1 of regionKey and facilityKey may be included. The facilityPart
  // is more specific, so should be used if present.
  return facilityPart || regionPart;
};

const toISODateString = date => {
  if (typeof date.format === 'function') {
    return date.format('YYYY-MM-DD');  // moment date
  }
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`;
};

const dateURLParams = ({afterDate, beforeDate}) => {
  let afterDatePart;
  if (afterDate) {
    afterDatePart = `afterDate=${toISODateString(afterDate)}`;
  } else {
    afterDatePart = '';
  }

  let beforeDatePart;
  if (beforeDate) {
    beforeDatePart = `beforeDate=${toISODateString(beforeDate)}`;
  } else {
    beforeDatePart = '';
  }

  return [afterDatePart, beforeDatePart];
};

const makeQuerystring = (...args) => {
  const result = args.filter((arg) => !!arg).join('&');
  if (result) {
    return `?${result}`;
  }
  return '';
};

/**
 * Applies standard filter parameters to the endpoint
 *
 * @param {string} endpoint
 * @param {Immutable.Record} summaryFilter SummaryFilter type Immutable Record
 * @return {string}
 */
export const filteredURL = (endpoint, filter, page=null) => {
  const params = locationURLParams(filter);
  const [beforePart, afterPart] = dateURLParams(filter);
  const pagePart = pageURLParam(page);
  const queryString = makeQuerystring(beforePart, afterPart, pagePart);

  return `/stt/${params}${endpoint}${queryString}`;
};

export const getSampleDetail = (sampleId, callback) => {
  if (!sampleId) {
    throw new Error('Missing required options.sampleId parameter');
  }

  return request(`/stt/ids/${sampleId}/changes`, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeSample(res.json));
  });
};

export const getChanges = (filter={}, page=1, callback) => {
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
  let url;
  if (filter) {
    url = filteredURL('summary', filter);
  } else {
    url = '/stt/summary';
  }
  return request(url, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeSummary(res.json));
  });
};

export const getTurnArounds = (filter={}, callback) => {
  const url = filteredURL('tat', filter);
  return request(url, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeTurnArounds(res.json));
  });
};

export const getStageDates = (filter={}, callback) => {
  const url = filteredURL('stageDates', filter);
  return request(url, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeStageDates(res.json));
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

export const getUsers = (callback) => {
  return request('/users', (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, normalizeUsers(res.json));
  });
};
