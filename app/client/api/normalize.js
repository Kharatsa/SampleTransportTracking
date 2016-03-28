'use strict';

import {arrayOf, normalize} from 'normalizr';
import {Map as ImmutableMap, Seq, List} from 'immutable';
import {
  changeInclude, sample, metadata, sampleInclude
} from './schemas.js';
import {
  ChangeRecord, SampleRecord, ArtifactRecord, LabTestRecord,
  KeyValueMetaRecord, FacilityMetaRecord, SummaryTotal, ArtifactsCount, ArtifactsCountDetail
} from './records.js';

/**
 * Given an object keyed on UUIDs, returns an Immutable Map copy of that object
 * containing Immutable Records for each key's value.
 *
 * @param  {Object} source
 * @param  {Immutable.Record} ImmutableRecord
 * @return {Immutable.Map}
 */
const makeImmutable = (source, ImmutableRecord) => {
  if (source && Object.keys(source).length) {
    return ImmutableMap(Object.keys(source).map(
      key => {
        const record = source[key];
        if (Array.isArray(record)) {
          return [key, Seq(record.map(item => new ImmutableRecord(item)))];
        }
        return [key, new ImmutableRecord(record)];
      }
    ));
  }
  return ImmutableMap({});
};

/**
 * Reduce an array of Objects into an Object keyed on one of the Object's
 * values.
 *
 * @param {Array.<Object>} data
 * @param {Object} options
 * @param {?boolean} [options.replace=false] [description]
 * @param {!string} options.key
 * @return {Object}
 */
const keyReduce = (data, options) => {
  // options defaults
  options = Object.assign({replace: false}, options);
  const {replace, key} = options;
  const keyFunc = typeof key === 'function' ? key : item => item[key];
  return data.reduce((reduced, item) => {
    const itemKey = keyFunc(item);
    if (typeof reduced[itemKey] === 'undefined' && !replace) {
      reduced[itemKey] = [];
    }
    if (replace) {
      reduced[itemKey] = item;
    } else {
      reduced[itemKey].push(item);
    }
    return reduced;
  }, {});
};

const normalizeMeta = (data, Record) => {
  let {entities} = normalize(data, arrayOf(metadata));
  return makeImmutable(entities.metadata, Record);
};

export const normalizeMetadata = data => {
  return ImmutableMap({
    regions: normalizeMeta(data.regions, KeyValueMetaRecord),
    facilities: normalizeMeta(data.facilities, FacilityMetaRecord),
    people: normalizeMeta(data.people, KeyValueMetaRecord),
    labTests: normalizeMeta(data.labTests, KeyValueMetaRecord),
    artifacts: normalizeMeta(data.artifacts, KeyValueMetaRecord),
    statuses: normalizeMeta(data.statuses, KeyValueMetaRecord),
    rejections: normalizeMeta(data.rejections, KeyValueMetaRecord),
    stages: normalizeMeta(data.stages, KeyValueMetaRecord)
  });
};

export const normalizeSamples = ({data, count}) => {
  const {entities, result} = normalize(data, arrayOf(sample));
  const samples = makeImmutable(entities.samples, SampleRecord);
  const sampleIds = Seq(result);
  return {samples, sampleIds, count};
};

const sampleDetailArtifactMaps = data => {
  let artifactChanges;
  if (data.Artifacts) {
    artifactChanges = (
      data.Artifacts.map(ref => ref.Changes)
      .reduce((reduced, next) => reduced.concat(next), []));
  } else {
    artifactChanges = [];
  }

  const changesByArtifactId = makeImmutable(
    keyReduce(artifactChanges, {key: 'artifact'}), ChangeRecord
  );

  return {changesByArtifactId, artifactChanges};
};

const sampleDetailTestMaps = data => {
  let testChanges;
  if (data.LabTests) {
    testChanges = (
      data.LabTests.map(ref => ref.Changes)
      .reduce((reduced, next) => reduced.concat(next), []));
  } else {
    testChanges = [];
  }

  const changesByLabTestId = makeImmutable(
    keyReduce(testChanges, {key: 'labTest'}), ChangeRecord
  );

  return {changesByLabTestId, testChanges};
};

const sampleDetailStageMap = (artifactChanges, testChanges) => {
  const combinedChanges = artifactChanges.concat(testChanges);

  const changesIdsByStage = combinedChanges.reduce((reduced, item) => {
    const stage = item.stage;
    if (!reduced[stage]) {
      reduced[stage] = [];
    }
    reduced[stage].push(item.uuid);
    return reduced;
  }, {});

  Object.keys(changesIdsByStage).forEach(key => {
    changesIdsByStage[key] = Seq(changesIdsByStage[key]);
  });

  return {changesIdsByStage: ImmutableMap(changesIdsByStage)};
};

export const normalizeSample = data => {
  const {changesByArtifactId, artifactChanges} = sampleDetailArtifactMaps(data);
  const {changesByLabTestId, testChanges} = sampleDetailTestMaps(data);
  const {changesIdsByStage} = sampleDetailStageMap(artifactChanges,
                                                   testChanges);

  const {entities, result} = normalize(data, sampleInclude);
  const sampleId = result || null;

  // TODO: do this sort this on the server
  const changesRaw = makeImmutable(entities.changes, ChangeRecord);
  const changes = changesRaw.sortBy(change => change.statusDate);

  const artifacts = makeImmutable(entities.artifactChanges, ArtifactRecord);
  const labTests = makeImmutable(entities.labTestChanges, LabTestRecord);
  const samples = makeImmutable(entities.sampleIncludes, SampleRecord);
  return {samples, sampleId, changes, artifacts, labTests,
          changesByArtifactId, changesByLabTestId, changesIdsByStage};
};

export const normalizeChanges = ({data, count}) => {
  const {entities, result} = normalize(data, arrayOf(changeInclude));
  const changes = makeImmutable(entities.changeIncludes, ChangeRecord);
  const changeIds = Seq(result);
  const artifacts = makeImmutable(entities.artifactSamples, ArtifactRecord);
  const labTests = makeImmutable(entities.labTestSamples, LabTestRecord);
  const samples = makeImmutable(entities.samples, SampleRecord);
  return {changes, changeIds, artifacts, labTests, samples, count};
};

const defaultArtifactsStruct = () => {
  const stages = Seq(["RARRIVE", "RDEPART", "SARRIVE", "SDEPART"])
  const statuses = Seq(["OK", "BAD"])
  const artifactTypes = Seq(["REQUEST", "BLOOD", "SPUTUM", "URINE", "DBS", "RESULT"])

  return stages.flatMap( stage => {
    return statuses.map( status => {
      return new ArtifactsCount({
        stage,
        status,
        artifactsCountDetails: artifactTypes.map( type => (new ArtifactsCountDetail({type})))
      })
    })
  })
}

const normalizeArtifacts = artifacts => {
  return Seq(artifacts).reduce((artifactsStruct, jsonArtifactCount) => {
    return artifactsStruct.map( (artifactCount) => {
      // console.log(artifactCount)
      if ((jsonArtifactCount.stage === artifactCount.get('stage')) && (jsonArtifactCount.status === artifactCount.get('status'))) {
          return new ArtifactsCount({
            stage: artifactCount.get('stage'),
            status: artifactCount.get('status'),
            artifactsCountDetails: artifactCount.artifactsCountDetails.map( detail => {
              if (jsonArtifactCount.artifactType === detail.get('type')) {
                return new ArtifactsCountDetail({
                  type: jsonArtifactCount.artifactType,
                  sampleIdsCount: jsonArtifactCount.sampleIdsCount,
                  artifactsCount: jsonArtifactCount.artifactsCount
                });
              }
              else {
                return detail;
              }
            })
          })
      }
      else {
        return artifactCount
      }
    })
  },
  defaultArtifactsStruct());
}

export const normalizeSummary = data => {
  console.log(defaultArtifactsStruct())
  defaultArtifactsStruct().forEach(x => console.log(x))
  const {artifacts, labTests, totals} = data;
  return {artifacts: normalizeArtifacts(artifacts), labTests, totals: new SummaryTotal(totals)};
}
