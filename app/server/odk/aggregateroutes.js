'use strict';

const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');
const formidable = require('formidable');
const config = require('app/config');
const log = require('app/server/util/logapp.js');
const sttmiddleware = require('app/server/sttmiddleware.js');
const aggregate = require('app/server/odk/aggregateapi.js');

let passport = null;
let authenticate = null;
if (config.server.isProduction()) {
  passport = require('app/server/auth/httpauth.js');
  authenticate = passport.authenticate('basic', {session: false});
} else {
  authenticate = (req, res, next) => next();
}

const prepareXMLResponse = (res, statusCode, body) => {
  res.set({'Content-Type': 'text/xml', 'Content-Length': body.length});
  res.status(statusCode);
};

const handleHeadRequest = (req, res) => res.status(401).send('');

const escapeRegExp = str => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

/**
 * To mimic the ODK Aggregate server this web server masks, the XML responses
 * with URLs for that original server must be altered to report this app's URL
 * in place of the original ODK Aggregate URL. This ensures that all requests
 * from the client arrive to this application first.
 *
 * @param  {string} xml      Original XML from Aggregate
 * @param  {string} fromHost URL to hide
 * @param  {string} toHost   URL to display
 * @return {string}          Altered XML
 */
const swapHostnames = (xml, fromHost, toHost) => {
  return new BPromise((resolve) => {
    resolve(xml.replace(new RegExp(escapeRegExp(fromHost), 'g'), toHost));
  });
};

const ODK_MASK_URL = config.server.PUBLIC_URL + '/odk';
log.info(`Masking ODK Aggregate with url ${ODK_MASK_URL}`);

router.all('*', aggregate.setOpenRosaHeaders, authenticate);

router.head('/formList', handleHeadRequest);

router.get('/formList',
  sttmiddleware.normalizeParams,
  (req, res) => {
    let formId = req.query.formid;
    let verbose = req.query.verbose;
    let allVersions = req.query.listallversions;

    return aggregate.formList({formId, verbose, allVersions})
    .spread((odkRes, body) => {
      return BPromise.join(
        odkRes,
        swapHostnames(body, config.odk.URL, ODK_MASK_URL)
      );
    })
    .spread((odkRes, body) => {
      log.debug('Got formList', body);
      prepareXMLResponse(res, odkRes.statusCode, body);
      res.send(body);
    });
  }
);

const openRosaAcceptLength = (req, res, next) => {
  res.append(
    'X-OpenRosa-Accept-Content-Length',
    config.odk.SUBMISSION_MAX_LENGTH
  );
  next();
};

router.head('view/submissionList',
  openRosaAcceptLength,
  handleHeadRequest
);

router.get('/view/submissionList',
  openRosaAcceptLength,
  sttmiddleware.normalizeParams,
  (req, res, next) => {
    log.debug(`Requesting ODK submission list`);

    let formId = req.query.formid;
    let numEntries = req.query.numentries;
    let cursor = req.query.cursor;
    if (typeof formId !== 'undefined') {
      return aggregate.submissionList({formId, numEntries, cursor})
      .spread((odkRes, body) => {
        log.debug('Got submissionList', body);

        prepareXMLResponse(res, odkRes.statusCode, body);
        res.send(body);
      })
      .catch(err => next(err));
    } else {
      res.status(500).send('Error: Missing formid parameter');
    }
  }
);

router.head('/view/downloadSubmission', handleHeadRequest);

router.get('/view/downloadSubmission',
  sttmiddleware.normalizeParams,
  (req, res, next) => {
    let formId = req.query.formid;
    let topElement = req.query.topelement || formId;
    let submissionId = (
      req.query.submissionid ||
      req.query.idvalue ||
      req.query.instanceid
    );

    aggregate.downloadSubmission({formId, topElement, submissionId})
    .spread((odkRes, body) => {
      log.debug('Got downloadSubmission', body);

      prepareXMLResponse(res, odkRes.statusCode, body);
      res.send(body);
    })
    .catch(err => next(err));
  }
);

const SUBMISSION_PART_NAME = 'xml_submission_file';

const parseXMLPart = (form, part) => {
  if (part.name !== SUBMISSION_PART_NAME) {
    log.debug(`default formidable handler for part named "${part.name}"`);
    form.handlePart(part);
    return;
  }

  let value = '';
  part.on('data', buff => value += buff.toString('utf-8'));
  part.on('end', () => form.emit('field', part.name, value));
};

const parseSubmissionFormData = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    req.form = {fields, files};
    next();
  });
  form.onPart = parseXMLPart.bind(null, form);
};

// Responses to the /submission route with status code `200` are not considered
// successful. For this reason, the submission route requires a custom status
// code of `204` sent with its response
// https://groups.google.com/d/msg/opendatakit-developers/PFWsIb3nnTk/e4DyVsWCnZYJ
router.head('/submission',
  openRosaAcceptLength, (req, res) => res.status(204).send()
);

router.post('/submission',
  openRosaAcceptLength,
  parseSubmissionFormData,
  (req, res, next) => {
    log.debug(`Received new ODK form submission`);

    let submission = req.form.fields[SUBMISSION_PART_NAME];
    log.debug(`ODK submission ${SUBMISSION_PART_NAME}:\n${submission}`);

    return aggregate.makeSubmission(req.form.fields[SUBMISSION_PART_NAME])
    .spread((odkRes, body) => {
      log.debug(`ODK submission response=${odkRes.statusCode}, body:\n${body}`);

      prepareXMLResponse(res, odkRes.statusCode, body);
      res.send(body);
    })
    .catch(err => next(err));
  }
);

const passthroughGet = (req, res, next) => {
  log.debug(`${req.originalUrl}, query=${req.query}`);
  return aggregate.passthroughGet({url: req.path, query: req.query})
  .spread((odkRes, body) => BPromise.join(
    odkRes,
    swapHostnames(body, config.odk.URL, ODK_MASK_URL)
  ))
  .spread((odkRes, body) => {
    log.debug('Got passthrough GET response', body);

    prepareXMLResponse(res, odkRes.statusCode, body);
    res.send(body);
  })
  .catch(err => next(err));
};

router.head('/xformsManifest', handleHeadRequest);
router.get('/xformsManifest', passthroughGet);
router.head('/formXml', handleHeadRequest);
router.get('/formXml',passthroughGet);
router.head('/xformsDownload', handleHeadRequest);
router.get('/xformsDownload', passthroughGet);

router.all('/*', (req, res, next) => {
  let error = new Error('Not allowed');
  error.status = 405;
  next(error);
});

module.exports = router;
