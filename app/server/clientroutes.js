'use strict';

const express = require('express');
const router = express.Router();
const log = require('app/server/util/log.js');
const clientRoutes = ('app/client/routes.js');


router.get('/', function(req, res) {
  log.debug('Rendering index');
  res.render('index');
})

// exports.index = function(req, res){
//   res.render('index', { name: 'John' });
// };

module.exports = router;
