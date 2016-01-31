'use strict';

const express = require('express');
const router = express.Router();
const SampleIdRoutes = require('app/server/stt/routes/sampleidroutes.js');
const MetadataRoutes = require('app/server/stt/routes/metadataroutes.js');

router.use('/', SampleIdRoutes);
router.use('/', MetadataRoutes);

module.exports = router;
