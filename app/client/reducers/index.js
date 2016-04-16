import {combineReducers} from 'redux';

import * as metadata from './reducer_metadata';
import * as changesReducers from './changesreducers';
import * as artifactsReducers from './artifactsreducers';
import * as labTestsReducers from './labtestsreducers';
import * as sampleIdsReducers from './sampleidsreducers';
import * as summaryReducers from './summaryreducers';
import * as metadataReducers from './metadatareducers';
import * as filterReducers from './filterreducers';
import * as UIReducers from './uireducers';
import * as paginationReducers from './paginationreducers';

const reducers = Object.assign({},
  metadata, // TODO: replace all remaining uses of this wrapper metadata reducer
  changesReducers,
  artifactsReducers,
  labTestsReducers,
  sampleIdsReducers,
  summaryReducers,
  metadataReducers,
  filterReducers,
  UIReducers,
  paginationReducers
);

export const rootReducer = combineReducers(reducers);

export default rootReducer;
