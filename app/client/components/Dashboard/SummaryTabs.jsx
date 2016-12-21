import React, {PropTypes} from 'react';
import Iconic from '../Iconic';
import HeroDataPanel2 from '../HeroDataPanel2';
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
    <div className='dashboard-top-bar'>
      <div className='pure-u-1 pure-u-md-1-2'>
        <Link to='/tatsPage'>
          <HeroDataPanel2 header='Turn Around Times'>
          </HeroDataPanel2>
        </Link>
      </div>
      <div className='pure-u-1 pure-u-md-1-2'>
        <Link to='/labTestsPage'>
          <HeroDataPanel2 header='Lab Tests'>
          </HeroDataPanel2>
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
