import {combineReducers} from 'redux';

import * as changesReducers from './changesreducers';
import * as artifactsReducers from './artifactsreducers';
import * as labTestsReducers from './labtestsreducers';
import * as sampleIdsReducers from './sampleidsreducers';
import * as summaryReducers from './summaryreducers';
import * as metadataReducers from './metadatareducers';
import * as filterReducers from './filterreducers';
import * as UIReducers from './uireducers';
import * as paginationReducers from './paginationreducers';

// Consolidated state tree
const reducers = Object.assign({},
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
