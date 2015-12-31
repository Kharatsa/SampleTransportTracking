'use strict';

function loadHandler(request) {
  let response;
  if (request.status >= 200 && request.status < 400) {
    // Success!
    let json = null;
    try {
      json = JSON.parse(request.response);
    } catch (e) {
      // No-op
    }
    response = {
      response: request.response,
      text: request.responseText,
      type: request.responseType,
      json,
      xml: request.responseXML,
      status: request.status,
      statusText: request.statusText
    };
  } else {
    response = {error: new Error(request.statusText)};
    // We reached our target server, but it returned an error
  }
  return response;
}

/**
 * The callback is called after one of the XMLHttpRequest onload, onerror, or
 * onabord events are emitted. The function is called with an (err, res)
 * arguments.
 *
 * @callback requestCallback
 * @param {Error|null} err - The request error
 * @param {Object} res - The XHR response object
 * @param {string} res.response
 * @param {string} res.text
 * @param {string} res.type
 * @param {Object} res.json
 * @param {Document} res.xml
 * @param {number} res.status
 * @param {string} res.statusText
 */

/**
 * Helper function for XMLHttpRequests
 *
 * @param {Object|string} options - URL String or options Object.
 * @param {string} options.method - HTTP method (GET/POST)
 * @param {string} options.url - Request URL
 * @param {requestCallback} callback - The callback that handles the response.
 * @param  {Function}       callback

 */
let request = function(options, callback) {
  let method = options.method || 'GET';
  let url = typeof options === 'string' ? options : options.url;

  // XMLHttpRequest(JSObject objParameters);
  let finished = false;
  let req = new XMLHttpRequest();

  req.onload = function() {
    let res = loadHandler(req);
    if (finished) {
      return;
    }
    finished = true;
    if (res.error) {
      callback(res.error);
    } else {
      callback(null, res);
    }
  };

  req.onerror = function() {
    if (finished) {
      return;
    }
    finished = true;
    callback({error: new Error('Connection error')});
  };

  req.onabort = function() {
    if (finished) {
      return;
    }
    finished = true;
    callback(null, {});
  };

  // void open(DOMString method, DOMString url, optional boolean async,
  //           optional DOMString? user, optional DOMString? password);
  req.open(method, url);
  req.send();
};

module.exports = request;
