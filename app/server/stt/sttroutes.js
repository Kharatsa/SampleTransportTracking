'use strict';

const express = require('express');
const router = express.Router();
const SampleIdRoutes = require('server/stt/routes/sampleidroutes.js');
const MetadataRoutes = require('server/stt/routes/metadataroutes.js');
const ChangesRoutes = require('server/stt/routes/changesroutes.js');
const SummaryRoutes = require('server/stt/routes/summaryroutes.js');

router.use('/', SummaryRoutes);
router.use('/', SampleIdRoutes);
router.use('/', MetadataRoutes);
router.use('/', ChangesRoutes);

module.exports = router;
