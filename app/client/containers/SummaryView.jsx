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
        <div className="pure-g">
          <div className="pure-u-1 pure-u-md-1 pure-u-lg-1-2">
            <span>Total Counts</span>
          </div>
          <div className="pure-u-1 pure-u-md-1 pure-u-lg-1-2">
            <span>Turn Around Time</span>
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
