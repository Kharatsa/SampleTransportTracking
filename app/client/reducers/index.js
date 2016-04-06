import {combineReducers} from 'redux';

import metadataReducer from './reducer_metadata';
import * as changesReducers from './changesreducers';
import * as artifactsReducers from './artifactsreducers';
import * as labTestsReducers from './labtestsreducers';
import * as sampleIdsReducers from './sampleidsreducers';
import summaryReducer from './summaryreducers';
import * as metadatareducers from './metadatareducers';
import * as filterReducers from './filterreducers';
import * as UIReducers from './uireducers';
import * as paginationReducers from './paginationreducers';

const reducers = Object.assign({}, {
  metadata: metadataReducer,
  summary: summaryReducer
},
  changesReducers,
  artifactsReducers,
  labTestsReducers,
  sampleIdsReducers,
  metadataReducers,
  filterReducers,
  UIReducers,
  paginationReducers
);

export const rootReducer = combineReducers(reducers);

export default rootReducer;
