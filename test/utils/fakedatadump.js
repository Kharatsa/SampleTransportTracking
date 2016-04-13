'use strict';

const testmeta = require('./testmeta.js');
const fakedata = require('./fakedata.js');

const meta = {
  artifact: testmeta.metaArtifacts,
  labtest: testmeta.metaLabTests,
  district: testmeta.metaDistricts,
  lab: testmeta.metaLabs,
  facility: testmeta.metaFacilities,
  status: testmeta.metaStatuses,
  rejection: testmeta.metaRejections,
  person: testmeta.metaPeople,
  stage: testmeta.metaStages
};

console.log(fakedata.buildEntities(meta));
