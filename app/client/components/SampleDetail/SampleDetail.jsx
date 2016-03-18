'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SampleBasics from './SampleBasics.jsx';
import SampleStage from './SampleStage.jsx';
import SampleArtifacts from './SampleArtifacts.jsx';
import SampleTests from './SampleTests.jsx';
import ChangesTable from '../ChangesTable.jsx';
import WindowSizeListener from '../../containers/wrap/WindowSizeListener.jsx';

const FlexChangesTable = WindowSizeListener(ChangesTable, {height: false});

export const SampleDetail = ({
  selectedSampleId, samplesById,
  changeIds, changesById,
  artifactsById, labTestsById,
  changesByArtifactId, changesByLabTestId, changesIdsByStage,
  metadata
}) => {
  const sample = samplesById.get(selectedSampleId);

  if (sample) {
    const people = metadata.get('person');
    const facilities = metadata.get('facility');

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
                pickupStageName='Sample Pickup'
                deliveryStageName='Sample Delivery'
                changesById={changesById}
                changesIdsByStage={changesIdsByStage} />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleStage
                label='Results'
                color='green'
                people={people}
                facilities={facilities}
                pickupStageName='Results Pickup'
                deliveryStageName='Results Delivery'
                changesById={changesById}
                changesIdsByStage={changesIdsByStage}/>
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

  return <span />;
};

export default SampleDetail;
