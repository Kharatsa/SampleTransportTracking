import React from 'react';
import SummaryFilterContainer from './SummaryFilterContainer';

class SummaryView extends React.Component {
  render() {

    var containerStyle = {
      height: '100%',
      width: '100%',
      fontSize: 0
    }
    var bothStyle = {
      display: 'inline-block',
      zoom: 1,
      verticalaAlign: 'top',
      fontSize: 16
    }
    var leftStyle = Object.assign({}, bothStyle, {
      width: '50%'
    })
    var rightStyle = Object.assign({}, bothStyle, {
      width: '50%'
    })

    return (
      <div>
        <div>
          <SummaryFilterContainer />
        </div>
        <div style={containerStyle}>
          <div style={leftStyle}>
            Total Counts
          </div>
          <div style={rightStyle}>
            Turn Around Time
          </div>
        </div>
        <div>
          View Changes Container
        </div>


      </div>
    );
 }
}

export default SummaryView;
