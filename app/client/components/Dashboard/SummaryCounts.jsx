import React, {PropTypes} from 'react';
import Iconic from '../Iconic';
import HeroDataPanel from '../HeroDataPanel';

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
        <HeroDataPanel header='Total Sample IDs'>
          <span>
            {displayValue(isFetchingData, numSampleIds)}
            <Iconic className='hero-data-icon stt-icon' name='clipboard'/>
          </span>

        </HeroDataPanel>
      </div>
      <div className='pure-u-1 pure-u-md-1-3'>
        <HeroDataPanel header='Total Samples & Forms'>
          <span>
            {displayValue(isFetchingData, numArtifacts)}
            <Iconic className='hero-data-icon stt-icon' name='droplet'/>
          </span>
        </HeroDataPanel>
      </div>

      <div className='pure-u-1 pure-u-md-1-3'>
        <HeroDataPanel header='Total Lab Tests'>
          <span>
            {displayValue(isFetchingData, numLabTests)}
            <Iconic className='hero-data-icon stt-icon' name='medical-cross'/>
          </span>
        </HeroDataPanel>
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
