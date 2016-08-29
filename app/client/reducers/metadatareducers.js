import {RECEIVE_METADATA, RECEIVE_USERS} from '../actions/actions';

const metaTypeKeysReducer = type => {
  return (state=null, action) => {
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
  return (state=null, action) => {
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

export const userIds = (state=null, {type, userIds=null}) => {
  switch (type) {
  case RECEIVE_USERS: {
    return userIds;
  }
  default:
    return state;
  }
};

export const usersById = (state=null, {type, users=null}) => {
  switch (type) {
  case RECEIVE_USERS: {
    return users;
  }
  default:
    return state;
  }
};
