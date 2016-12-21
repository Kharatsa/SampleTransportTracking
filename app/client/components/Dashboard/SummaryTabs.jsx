import React, {PropTypes} from 'react';
import Iconic from '../Iconic';
import HeroDataPanel from '../HeroDataPanel';
import Link from 'react-router/lib/Link';

const displayValue = (isFetchingData, val) => {
  if (isFetchingData) {
    return '-';
  }
  return val && val.toLocaleString ? val.toLocaleString() : val;
};

export const SummaryTabs = ({
  isFetchingData, numSampleIds, numArtifacts, numLabTests
}) => {
  return (
    <div className='pure-g dashboard-top-bar'>
    
      <div className='pure-u-1 pure-u-md-1-3'>
      <Link to='/tatsPage'>
        <HeroDataPanel header='Turn Around Times'>
        </HeroDataPanel>
      </Link>
      </div>

      <div className='pure-u-1 pure-u-md-1-3'>
      <Link to='/labTestsPage'>
        <HeroDataPanel header='Lab Tests'>
        </HeroDataPanel>
      </Link>
      </div>
    </div>
  );
};

SummaryTabs.propTypes = {
  isFetchingData: PropTypes.bool.isRequired,
  numSampleIds: PropTypes.number.isRequired,
  numArtifacts: PropTypes.number.isRequired,
  numLabTests: PropTypes.number.isRequired
};

export default SummaryTabs;
