'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {List} from 'immutable';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import SummaryFilterVerticalMenu from './SummaryFilterVerticalMenu';

export const SummaryFilter = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    const {afterDate, beforeDate, regionKey, facilityKey} = this.props.summaryFilter;
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
      if (regionKey !== key) {
        changeSummaryFilter(
          afterDate,
          beforeDate,
          key,
          facilityKey
        );
      }
    };

    //disable facilities control unless a region has been selected??
    //first, filter facilities by selected region
    //then, convert facilities to array of (value, key), sorted alphabetically by value
    const facilitiesMap = this.props.metadata.get('facilities');
    const facilitiesList = (() => {
      if (facilitiesMap) {
        if (regionKey) {
          return facilitiesMap.toList().sortBy(rec => rec.get('value')).filter( (rec) => {
            return (regionKey === rec.get('region'));
          });
        }
        else {
          return facilitiesMap.toList().sortBy(rec => rec.get('value'));
        }

      }
      else {
        return List();
      }
    })();

    const facilitySelection = (key) => {
      if (facilityKey !== key) {
        changeSummaryFilter(
          afterDate,
          beforeDate,
          regionKey,
          key
        );
      }
    };

    const afterDateSelection = (ad) => {
      //minimum before date is afterDate + 1 day
      //set accordingly
      if (ad !== afterDate) {
        var bd = (() => {
          const minBeforeDate = ad.clone().add(1, 'day');
          if ( beforeDate <= minBeforeDate ) {
            return minBeforeDate;
          }
          else {
            return beforeDate;
          }
        })();

        changeSummaryFilter(
          ad,
          bd,
          regionKey,
          facilityKey
        );
      }
    };

    const beforeDateSelection = (bd) => {
      //maximum afterDate date is beforeDate - 1 day
      //set accordingly

      if (bd !== beforeDate) {
        var ad = (() => {
          const maxAfterDate = bd.clone().subtract(1, 'day');
          if ( afterDate >= maxAfterDate ) {
            return maxAfterDate;
          }
          else {
            return afterDate;
          }
        })();

        changeSummaryFilter(
          ad,
          bd,
          regionKey,
          facilityKey
        );
      }
    };

    return (
      <div className="pure-g">
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>Regions</span>
          <SummaryFilterVerticalMenu menuRecords={regionsList} currentlySelected={regionKey} onSelection={regionSelection}/>
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>Facilities</span>
          <SummaryFilterVerticalMenu menuRecords={facilitiesList} currentlySelected={facilityKey} onSelection={facilitySelection}/>
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>After Date</span>
          <br/>
          <DatePicker
            selected={afterDate}
            maxDate={Moment().subtract(1, 'day')}
            onChange={afterDateSelection} />
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>Before Date</span>
          <br/>
          <DatePicker
            selected={beforeDate}
            maxDate={Moment()}
            onChange={beforeDateSelection} />
        </div>
      </div>
    );
  }
});

export default SummaryFilter;
