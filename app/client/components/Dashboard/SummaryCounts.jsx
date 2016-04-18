import React, {PropTypes} from 'react';
import Iconic from '../Iconic';
import InfoBox from '../InfoBox';

const displayValue = (isFetchingData, val) => {
  if (isFetchingData) {
    return '-';
  }
  return val && val.toLocaleString ? val.toLocaleString() : val;
};

export const SummaryCounts = ({
  isFetchingData, numSampleIds, numArtifacts, numLabTests
}) => {
  return (
    <div className='pure-g dashboard-top-bar'>
      <div className='pure-u-1 pure-u-md-1-3'>
        <InfoBox header='Total Sample IDs'>
          <span>
            {displayValue(isFetchingData, numSampleIds)}
            <Iconic className='infobox-icon' name='clipboard'/>
          </span>

        </InfoBox>
      </div>
      <div className='pure-u-1 pure-u-md-1-3'>
        <InfoBox header='Total Samples & Forms'>
          <span>
            {displayValue(isFetchingData, numArtifacts)}
            <Iconic className='infobox-icon' name='droplet'/>
          </span>
        </InfoBox>
      </div>

      <div className='pure-u-1 pure-u-md-1-3'>
        <InfoBox header='Total Lab Tests'>
          <span>
            {displayValue(isFetchingData, numLabTests)}
            <Iconic className='infobox-icon' name='medical-cross'/>
          </span>
        </InfoBox>
      </div>
    </div>
  );
};

SummaryCounts.propTypes = {
  isFetchingData: PropTypes.bool.isRequired,
  numSampleIds: PropTypes.number.isRequired,
  numArtifacts: PropTypes.number.isRequired,
  numLabTests: PropTypes.number.isRequired
};

export default SummaryCounts;
