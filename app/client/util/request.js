'use strict';

function loadHandler(request) {
  var response;
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var json = null;
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
 * @param   {Object|String}  options  [description]
 * @param   {Function}       callback [description]
 */
var request = function(options, callback) {
  var method = options.method || 'GET';
  var url = typeof options === 'string' ? options : options.url;

  // XMLHttpRequest(JSObject objParameters);
  var finished = false;
  var req = new XMLHttpRequest();

  req.onload = function() {
    var res = loadHandler(req);
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
