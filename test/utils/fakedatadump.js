'use strict';

const testmeta = require('./testmeta.js');
const fakedata = require('./fakedata.js');

const meta = {
  artifact: testmeta.metaArtifacts,
  labtest: testmeta.metaLabTests,
  facility: testmeta.metaFacilities,
  region: testmeta.metaRegions,
  status: testmeta.metaStatuses,
  rejection: testmeta.metaRejections,
  person: testmeta.metaPeople,
  stage: testmeta.metaStages
};

console.log(fakedata.buildEntities(meta));
