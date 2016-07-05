import React from 'react';
import SampleBasics from './SampleBasics';
import SampleStage from './SampleStage';
import SampleArtifacts from './SampleArtifacts';
import SampleTests from './SampleTests';
import ChangesTable from '../ChangesTable';
import WaitOnFetch from '../WaitOnFetch.jsx';
import WindowSizeListener from '../../containers/WindowSizeListener';
import MissingSample from './MissingSampleDetail';
import {SCAN_STAGES} from '../../../common/sttworkflow';

const FlexChangesTable = WindowSizeListener(ChangesTable, {changeHeight: false});


const _SampleDetail = (props) => {
  const {
    routeParams,
    selectedSampleId, samplesById,
    changeIds, changesById,
    artifactsById, labTestsById,
    changesByArtifactId, changesByLabTestId, changesByStage,
    metaPeople,
    metaFacilities,
    metaArtifacts,
    metaStatuses,
    metaStages,
    metaLabTests,
  } = props;

  const sample = samplesById.get(selectedSampleId);

  if (sample) {
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
                people={metaPeople}
                facilities={metaFacilities}
                pickupStageName={SCAN_STAGES.SAMPLE_PICKUP}
                deliveryStageName={SCAN_STAGES.SAMPLE_DELIVERY}
                changesById={changesById}
                changesByStage={changesByStage} />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleStage
                label='Results'
                color='green'
                people={metaPeople}
                facilities={metaFacilities}
                pickupStageName={SCAN_STAGES.RESULT_PICKUP}
                deliveryStageName={SCAN_STAGES.RESULT_DELIVERY}
                changesById={changesById}
                changesByStage={changesByStage}/>
          </div>
        </div>
        <div className='pure-g panel'>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleArtifacts
                color='black'
                artifactsById={artifactsById}
                changesByArtifactId={changesByArtifactId}
                metaArtifacts={metaArtifacts}
                metaStatuses={metaStatuses}
                metaStages={metaStages}
            />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleTests
                color='black'
                changeIds={changeIds}
                changesById={changesById}
                labTestsById={labTestsById}
                changesByLabTestId={changesByLabTestId}
                metaLabTests={metaLabTests}
                metaStatuses={metaStatuses}
                metaStages={metaStages}
            />
          </div>
        </div>
        <FlexChangesTable
          height={400}
          {...props} />
      </div>
    );
  }

  return <MissingSample sampleId={routeParams.sampleId} />;
};

export const SampleDetail = WaitOnFetch(_SampleDetail);

export default SampleDetail;
