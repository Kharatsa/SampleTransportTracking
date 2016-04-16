import {Map as ImmutableMap, Seq} from 'immutable';
import {RECEIVE_METADATA} from '../actions/actions';

const metaTypeKeysReducer = type => {
  return (state=Seq(), action) => {
    switch (action.type) {
    case RECEIVE_METADATA: {
      return action.metadata.get(`${type}Keys`);
    }
    default:
      return state;
    }
  };
};

const metaTypeReducer = type => {
  return (state=ImmutableMap(), action) => {
    switch (action.type) {
    case RECEIVE_METADATA: {
      return action.metadata.get(type);
    }
    default:
      return state;
    }
  };
};

export const metaRegionsKeys = metaTypeKeysReducer('regions');
export const metaRegionsByKey = metaTypeReducer('regions');

export const metaFacilitiesKeys = metaTypeKeysReducer('facilities');
export const metaFacilitiesByKey = metaTypeReducer('facilities');

export const metaPeopleKeys = metaTypeKeysReducer('people');
export const metaPeopleByKey = metaTypeReducer('people');

export const metaStagesKeys = metaTypeKeysReducer('stages');
export const metaStagesByKey = metaTypeReducer('stages');

export const metaStatusesKeys = metaTypeKeysReducer('statuses');
export const metaStatusesByKey = metaTypeReducer('statuses');

export const metaArtifactsKeys = metaTypeKeysReducer('artifacts');
export const metaArtifactsByKey = metaTypeReducer('artifacts');

export const metaLabTestsKeys = metaTypeKeysReducer('labTests');
export const metaLabTestsByKey = metaTypeReducer('labTests');

export const metaRejectionsKeys = metaTypeKeysReducer('rejections');
export const metaRejectionsByKey = metaTypeReducer('rejections');
