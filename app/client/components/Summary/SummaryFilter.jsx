import React from 'react'; // eslint-disable-line no-unused-vars
import {changeSummaryFilter} from '../../actions/actioncreators';
import {List} from 'immutable';

import SummaryFilterVerticalMenu from './SummaryFilterVerticalMenu';

class SummaryFilter extends React.Component {

  // shouldComponentUpdate(nextProps) {
  //
  //   return (!(
  //     this.props.summaryFilter === nextProps.summaryFilter
  //   ));
  // }

  render() {
    const {afterDate, beforeDate, regionKey, facilityKey} = this.props.summaryFilter;
    console.log(this.props.summaryFilter)

    const {changeSummaryFilter} = this.props.actions;

    //convert regions to list of (value, key), sorted alphabetically by value
    const regionsMap = this.props.metadata.get('regions');
    //NOTE: generating list here
    const regionsList = (() => {
      if (regionsMap) {
        return regionsMap.toList().sortBy(rec => rec.get('value'));
      }
      else {
        return List();
      }
    })();

    const regionSelection = (key) => {
      changeSummaryFilter(
        afterDate,
        beforeDate,
        key,
        facilityKey
      )
    }

    //disable facilities control unless a region has been selected??
    //first, filter facilities by selected region
    //then, convert facilities to array of (value, key), sorted alphabetically by value
    const facilitiesMap = this.props.metadata.get('facilities');
    const facilitiesList = (() => {
      if (facilitiesMap) {
        if (regionKey) {
          return facilitiesMap.toList().sortBy(rec => rec.get('value')).filter( (rec) => {
            return (regionKey === rec.get('region'))
          })
        }
        else {
          return facilitiesMap.toList().sortBy(rec => rec.get('value'))
        }

      }
      else {
        return List();
      }
    })();

    facilitiesList.forEach( (rec) => console.log('region: ', rec.get('region')) )

    const facilitySelection = (key) => {
      changeSummaryFilter(
        afterDate,
        beforeDate,
        regionKey,
        key
      )
    }

    // console.log(this.props.summaryFilter);

    // console.log(this.props.actions);
    // return (
    //   <div>
    //     {afterDate.toString()}
    //     {beforeDate.toString()}
    //     <SummaryFilterVerticalMenu menuRecords={regionsList} onSelection={regionSelection}/>
    //     {facilityKey}
    //   </div>
    // )
    // return (
    //   <div>
    //     <div className="pure-menu pure-menu-scrollable custom-restricted">
    //       <ul className="pure-menu-list">
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Flickr</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Messenger</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sports</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Finance</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autos</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Beauty</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Movies</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Small Business</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Cricket</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Tech</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">World</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">News</a></li>
    //           <li className="pure-menu-item"><a href="#" className="pure-menu-link">Support</a></li>
    //       </ul>
    //     </div>
    //   </div>
    // )

    return (
      <div>
        <SummaryFilterVerticalMenu menuRecords={regionsList} currentlySelected={regionKey} onSelection={regionSelection}/>
        <SummaryFilterVerticalMenu menuRecords={facilitiesList} currentlySelected={facilityKey} onSelection={facilitySelection}/>
      </div>
    );
  }
}


export default SummaryFilter;
