'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import SummaryFilterVerticalMenu from './SummaryFilterVerticalMenu';

const filterValues = filter => ({
  afterDate: filter.get('afterDate'),
  beforeDate: filter.get('beforeDate'),
  regionKey: filter.get('regionKey'),
  facilityKey: filter.get('facilityKey')
});

const calcAfterDate = (beforeDateInput, afterDate) => {
  const maxAfterDate = beforeDateInput.clone().subtract(1, 'day');
  return afterDate >= maxAfterDate ? maxAfterDate : afterDate;
};

const calcBeforeDate = (afterDateInput, beforeDate) => {
  const minBeforeDate = afterDateInput.clone().add(1, 'day');
  return beforeDate <= minBeforeDate ? minBeforeDate : beforeDate;
};

export const SummaryFilter = React.createClass({
  mixins: [PureRenderMixin],

  _selectLocationFilter(selectedKey, type) {
    const {
      afterDate, beforeDate, regionKey, facilityKey
    } = filterValues(this.props.summaryFilter);

    const {changeSummaryFilter} = this.props.actions;

    if (type === 'facility' && selectedKey !== facilityKey) {
      changeSummaryFilter(afterDate, beforeDate, regionKey, selectedKey);
    } else if (type === 'region') {
      changeSummaryFilter(afterDate, beforeDate, selectedKey, facilityKey);
    }
  },

  selectFacility(selectedKey) {
    this._selectLocationFilter(selectedKey, 'facility');
  },

  selectRegion(selectedKey) {
    this._selectLocationFilter(selectedKey, 'region');
  },

  selectAfterDate(afterDateInput) {
    const {
      afterDate, beforeDate, regionKey, facilityKey
    } = filterValues(this.props.summaryFilter);
    const {changeSummaryFilter} = this.props.actions;

    if (afterDateInput !== afterDate) {
      const nextBeforeDate = calcBeforeDate(afterDateInput, beforeDate);
      return changeSummaryFilter(
        afterDateInput, nextBeforeDate, regionKey, facilityKey);
    }
  },

  selectBeforeDate(beforeDateInput) {
    const {
      afterDate, beforeDate, regionKey, facilityKey
    } = filterValues(this.props.summaryFilter);
    const {changeSummaryFilter} = this.props.actions;

    if (beforeDateInput !== beforeDate) {
      const nextAfterDate = calcAfterDate(beforeDateInput, afterDate);
      return changeSummaryFilter(
        nextAfterDate, beforeDateInput, regionKey, facilityKey);
    }
  },

  render() {
    const {
      afterDate, beforeDate, regionKey, facilityKey
    } = filterValues(this.props.summaryFilter);

    const {filteredMetaFacilities, metaRegions} = this.props;

    return (
      <div className="pure-g">
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>Regions</span>
          <SummaryFilterVerticalMenu
              menuRecords={metaRegions}
              currentlySelected={regionKey}
              onSelection={this.selectRegion} />
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>Facilities</span>
          <SummaryFilterVerticalMenu
              menuRecords={filteredMetaFacilities}
              currentlySelected={facilityKey}
              onSelection={this.selectFacility} />
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>After Date</span>
          <br/>
          <DatePicker
            selected={afterDate}
            maxDate={Moment().subtract(1, 'day')}
            onChange={this.selectAfterDate} />
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
          <span>Before Date</span>
          <br/>
          <DatePicker
            selected={beforeDate}
            maxDate={Moment()}
            onChange={this.selectBeforeDate} />
        </div>
      </div>
    );
  }
});

export default SummaryFilter;
