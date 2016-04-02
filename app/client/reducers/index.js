'use strict';

import { combineReducers } from 'redux';

import PageReducer from './reducer_page';
import WindowSizeReducer from './reducer_windowSize';
import IsFetchingDataReducer from './reducer_isFetchingData';
import MetadataReducer from './reducer_metadata';
import SelectedSampleIdReducer from './reducer_selectedSampleId';
import SampleIdsReducer from './reducer_sampleIds';
import SamplesByIdReducer from './reducer_samplesById';
import ChangeIdsReducer from './reducer_changeIds';
import ChangesByIdReducer from './reducer_changesById';
import ChangesTotalReducer from './reducer_changesTotal';
import ArtifactIdsReducer from './reducer_artifactIds';
import ArtifactsByIdReducer from './reducer_artifactsById';
import ChangesByArtifactIdReducer from './reducer_changesByArtifactId';
import LabTestIdsReducer from './reducer_labTestIds';
import LabTestsByIdReducer from './reducer_labTestsById';
import ChangesByLabTestIdReducer from './reducer_changesByLabTestId';
import changesByStageReducer from './reducer_changesByStage';
import SummaryFilterReducer from './reducer_summaryFilter';
import SummaryReducer from './reducer_summary';


const rootReducer = combineReducers({
  page: PageReducer,
  windowSize: WindowSizeReducer,
  isFetchingData: IsFetchingDataReducer,
  metadata: MetadataReducer,
  selectedSampleId: SelectedSampleIdReducer,
  sampleIds: SampleIdsReducer,
  samplesById: SamplesByIdReducer,
  changeIds: ChangeIdsReducer,
  changesById: ChangesByIdReducer,
  changesTotal: ChangesTotalReducer,
  artifactIds: ArtifactIdsReducer,
  artifactsById: ArtifactsByIdReducer,
  changesByArtifactId: ChangesByArtifactIdReducer,
  labTestIds: LabTestIdsReducer,
  labTestsById: LabTestsByIdReducer,
  changesByLabTestId: ChangesByLabTestIdReducer,
  changesByStage: changesByStageReducer,
  summaryFilter: SummaryFilterReducer,
  summary: SummaryReducer
});

export default rootReducer;
