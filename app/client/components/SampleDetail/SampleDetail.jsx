import React from 'react';
import SampleBasics from './SampleBasics';
import SampleStage from './SampleStage';
import SampleArtifacts from './SampleArtifacts';
import SampleTests from './SampleTests';
import ChangesTable from '../ChangesTable';
import WindowSizeListener from '../../containers/wrappers/WindowSizeListener';
import MissingSample from './MissingSampleDetail';

const FlexChangesTable = WindowSizeListener(ChangesTable, {changeHeight: false});

export const SampleDetail = ({
  routeParams,
  selectedSampleId, samplesById,
  changeIds, changesById,
  artifactsById, labTestsById,
  changesByArtifactId, changesByLabTestId, changesByStage,
  metadata
}) => {
  const sample = samplesById.get(selectedSampleId);

  if (sample) {
    const people = metadata.get('people');
    const facilities = metadata.get('facilities');

    const stId = sample.get('stId');
    const labId = sample.get('labId');
    const created = sample.get('createdAt');

    return (
      <div>
        <SampleBasics stId={stId} labId={labId} created={created} />
        <div className='pure-g panel'>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleStage
                label='Requests'
                color='blue'
                people={people}
                facilities={facilities}
                pickupStageName='SDEPART'
                deliveryStageName='SARRIVE'
                changesById={changesById}
                changesByStage={changesByStage} />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleStage
                label='Results'
                color='green'
                people={people}
                facilities={facilities}
                pickupStageName='RDEPART'
                deliveryStageName='RARRIVE'
                changesById={changesById}
                changesByStage={changesByStage}/>
          </div>
        </div>
        <div className='pure-g panel'>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleArtifacts
                // changeIds={changeIds}
                // changesById={changesById}
                artifactsById={artifactsById}
                changesByArtifactId={changesByArtifactId}
                metadata={metadata} />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleTests
                changeIds={changeIds}
                changesById={changesById}
                labTestsById={labTestsById}
                changesByLabTestId={changesByLabTestId}
                metadata={metadata} />
          </div>
        </div>
        <FlexChangesTable
          height={400}
          samplesById={samplesById}
          changeIds={changeIds}
          changesById={changesById}
          artifactsById={artifactsById}
          labTestsById={labTestsById}
          metadata={metadata} />
      </div>
    );
  }

  return <MissingSample sampleId={routeParams.sampleId} />;
};

export default SampleDetail;
