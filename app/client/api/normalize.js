import {arrayOf, normalize} from 'normalizr';
import {Map as ImmutableMap, Seq, List} from 'immutable';
import {changeInclude, metadata} from './schemas.js';
import {
  ChangeRecord, SampleRecord, ArtifactRecord, LabTestRecord,
  KeyValueMetaRecord, FacilityMetaRecord,
  SummaryTotal, ArtifactsCount, LabTestsCount,
  TurnAround
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

/**
 * @param  {ImmutableMap} changesById [description]
 * @param  {Object} options     [description]
 * @param {string} options.refName [description]
 * @param {boolean} [options.many=false] [description]
 * @return {Object}             [description]
 */
const sampleDetailsRefMap = (changesById, options) => {
  options = Object.assign({}, {many: false}, options);

  return changesById.keySeq().reduce((reduced, changeId) => {
    const change = changesById.get(changeId);
    const refId = change.get(options.refName);
    if (refId !== null && options.many) {
      const changes = reduced.get(refId);
      reduced = reduced.set(refId,
        typeof changes === 'undefined' ? List([change]) : changes.push(change));
    } else if (refId !== null) {
      reduced = reduced.set(refId, change);
    }
    return reduced;
  }, ImmutableMap());
};

export const normalizeSample = data => {
  const normalized = normalizeChanges(data);
  const {changes, changeIds, artifacts, labTests, samples, count} = normalized;

  const changesByArtifactId = sampleDetailsRefMap(changes,
    {refName: 'artifact', many: true});
  const changesByLabTestId = sampleDetailsRefMap(changes,
    {refName: 'labTest', many: true});
  const changesByStage = sampleDetailsRefMap(changes,
    {refName: 'stage', many: true});

  const sampleId = samples.size > 0 ? samples.first().get('uuid') : null;

  return {
    changes, changeIds, artifacts, labTests, samples, count, sampleId,
    changesByArtifactId, changesByLabTestId, changesByStage
  };
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

const normalizeArtifacts = artifacts =>
  Seq(artifacts).map(artifact => new ArtifactsCount(artifact));

const normalizeLabTests = labTests =>
  Seq(labTests).map(labTest => new LabTestsCount(labTest));

export const normalizeSummary = data => {
  const {artifacts, labTests, totals} = data;
  return {
    artifacts: normalizeArtifacts(artifacts),
    labTests: normalizeLabTests(labTests),
    totals: new SummaryTotal(totals)
  };
};

export const normalizeTurnArounds = data => {
  console.log('in normalize turn arounds', data)
  return Seq(data).map(turnAround => new TurnAround({
    from: turnAround.from,
    to: turnAround.to,
    averageTATms: ( () => {
      if (!turnAround.samplesIdsAvgTATms || turnAround.samplesIdsAvgTATms < 0) { return 0; }
      else { return turnAround.samplesIdsAvgTATms; }
    }) ()
  }))
}
