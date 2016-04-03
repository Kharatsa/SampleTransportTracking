'use strict';

import {Map as ImmutableMap, Seq} from 'immutable';
import {RECEIVE_METADATA} from '../actions/actions';

const keySeqFromMap = metadata =>
  metadata.valueSeq().map(meta => meta.get('key'));

const metaTypeKeysReducer = type => {
  return (state=Seq(), action) => {
    switch(action.type) {
    case RECEIVE_METADATA: {
      return keySeqFromMap(action.metadata.get(type));
    }
    default:
      return state;
    }
  };
};

const metaTypeReducer = type => {
  return (state=ImmutableMap(), action) => {
    switch(action.type) {
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
