import React from 'react';
import SummaryFilterContainer from './SummaryFilterContainer';
import ViewChangesButton from '../components/Summary/ViewChangesButton';

class SummaryView extends React.Component {
  render() {

    const buttonsStyle = {
      textAlign: 'right'
    };

    return (
      <div>
        <div>
          <SummaryFilterContainer />
        </div>
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1 pure-u-lg-1-2">
            <span>Total Counts</span>
          </div>
          <div className="pure-u-1 pure-u-md-1 pure-u-lg-1-2">
            <span>Turn Around Time</span>
          </div>
        </div>
        <div style={buttonsStyle}>
          <ViewChangesButton />
        </div>
      </div>
    );
 }
}

export default SummaryView;
