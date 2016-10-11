import {arrayOf, normalize} from 'normalizr';
import {fromJS, Map as ImmutableMap, List} from 'immutable';
import {changeInclude, metadata, dateStage, user} from './schemas.js';
import {
  ChangeRecord, SampleRecord, ArtifactRecord, LabTestRecord,
  KeyValueMetaRecord, FacilityMetaRecord, TurnAround, User,
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
          return [key, List(record.map(item => new ImmutableRecord(item)))];
        }
        return [key, new ImmutableRecord(record)];
      }
    ));
  }
  return ImmutableMap({});
};

const normalizeOneMeta = (data, Record) => {
  let {entities, result} = normalize(data, arrayOf(metadata));
  return {
    entities: makeImmutable(entities.metadata, Record),
    result: List(result)
  };
};

export const normalizeMetadata = data => {
  const normalized = {
    regions: normalizeOneMeta(data.regions, KeyValueMetaRecord),
    facilities: normalizeOneMeta(data.facilities, FacilityMetaRecord),
    people: normalizeOneMeta(data.people, KeyValueMetaRecord),
    labTests: normalizeOneMeta(data.labTests, KeyValueMetaRecord),
    artifacts: normalizeOneMeta(data.artifacts, KeyValueMetaRecord),
    statuses: normalizeOneMeta(data.statuses, KeyValueMetaRecord),
    rejections: normalizeOneMeta(data.rejections, KeyValueMetaRecord),
    stages: normalizeOneMeta(data.stages, KeyValueMetaRecord)
  };

  return ImmutableMap({
    regions: normalized.regions.entities,
    regionsKeys: normalized.regions.result,
    facilities: normalized.facilities.entities,
    facilitiesKeys: normalized.facilities.result,
    people: normalized.people.entities,
    peopleKeys: normalized.people.result,
    labTests: normalized.labTests.entities,
    labTestsKeys: normalized.labTests.result,
    artifacts: normalized.artifacts.entities,
    artifactsKeys: normalized.artifacts.result,
    statuses: normalized.statuses.entities,
    statusesKeys: normalized.statuses.result,
    rejections: normalized.rejections.entities,
    rejectionsKeys: normalized.rejections.result,
    stages: normalized.stages.entities,
    stagesKeys: normalized.stages.result
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

  // TODO(sean): these would be better as selectors
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
  const changeIds = List(result);
  const artifacts = makeImmutable(entities.artifactSamples, ArtifactRecord);
  const labTests = makeImmutable(entities.labTestSamples, LabTestRecord);
  const samples = makeImmutable(entities.samples, SampleRecord);
  return {changes, changeIds, artifacts, labTests, samples, count};
};

export const normalizeSummary = data => {
  const {sampleIdsCount, artifactsCount, labTestsCount, totalsCount} = data;
  return {
    sampleIds: fromJS(sampleIdsCount),
    artifacts: fromJS(artifactsCount),
    labTests: fromJS(labTestsCount),
    totals: fromJS(totalsCount)
  };
};

const getAvgTAT = turnAround => {
  const tat = turnAround.samplesIdsAvgTATms;
  if (tat && tat >= 0) {
    return tat;
  }
  return 0;
};

export const normalizeTurnArounds = data => {
  return List(data).map(turnAround => new TurnAround({
    from: turnAround.from,
    to: turnAround.to,
    averageTATms: getAvgTAT(turnAround)
  }));
};

export const normalizeStageDates = data => {
  const {entities, result} = normalize(data, arrayOf(dateStage));
  return {
    dates: List(result),
    summary: fromJS(entities.dateStage || {})
  };
};

export const normalizeUsers = data => {
  const {entities, result} = normalize(data, arrayOf(user));
  return {
    userIds: List(result),
    users: makeImmutable(entities.users, User),
  };
};
