import React from 'react';
import ViewChangesButton from '../../components/Summary/ViewChangesButton';
import TotalCountsContainer from './TotalCountsContainer';

class SummaryView extends React.Component {
  render() {

    const buttonsStyle = {
      textAlign: 'right'
    };

    return (
      <div className='main'>
        <div className='pure-g'>
          <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-2'>
            <TotalCountsContainer />
          </div>
          <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-2'>
            <span>Turn Around Time</span>
          </div>
        </div>
        <div className='panel' style={buttonsStyle}>
          <ViewChangesButton />
        </div>
      </div>
    );
  }
}

export default SummaryView;
