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
 * Helper function for XMLHttpRequests
 *
 * @param   {Object|String}  options  URL String or options Object.
 *          {String}         options.method HTTP method (GET/POST)
 *          {String}         options.url    Request URL
 * @param   {Function}       callback  The callback is called after one of the
 *                                     XMLHttpRequest onload, onerror, or
 *                                     onabord events are emitted. The function
 *                                     is called with an (err, res)
 *                                     arguments. The res Object includes the
 *                                     follow attributes:
 *                                       {String}   res.response
 *                                       {String}   res.text
 *                                       {String}   res.type
 *                                       {Object}   res.json
 *                                       {Document} res.xml
 *                                       {Number}   res.status
 *                                       {String}   res.statusText
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
