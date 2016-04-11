import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Select from 'react-select';

export const SummaryLocationFilters = React.createClass({
  mixins: [PureRenderMixin],

  _selectLocationFilter(selected, type) {

    const {summaryFilter} = this.props;
    const {changeSummaryFilter} = this.props.actions;
    
    const afterDate = summaryFilter.get('afterDate');
    const beforeDate = summaryFilter.get('beforeDate');
    const facilityKey = summaryFilter.get('facilityKey');
    const regionKey = summaryFilter.get('regionKey');

    if (!selected) {
      if (type === 'region') {
        changeSummaryFilter(afterDate, beforeDate, null, null);
      }
      else {
        changeSummaryFilter(afterDate, beforeDate, regionKey, null);
      }
    }
    else {
      const {value: selectedKey} = selected;
      if (type === 'facility' && selectedKey !== facilityKey) {
        changeSummaryFilter(afterDate, beforeDate, regionKey, selectedKey);
      } else if (type === 'region') {
        changeSummaryFilter(afterDate, beforeDate, selectedKey, facilityKey);
      }
    }
  },

  selectFacility(selectedKey) {
    this._selectLocationFilter(selectedKey, 'facility');
  },

  selectRegion(selectedKey) {
    this._selectLocationFilter(selectedKey, 'region');
  },

  render() {
    const {
      isFetchingData,
      metaRegionsByKey, metaRegions,
      metaFacilitiesByKey, filteredMetaFacilities,
      summaryFilter
    } = this.props;
    const facilityKey = summaryFilter.get('facilityKey');
    const regionKey = summaryFilter.get('regionKey');

    const regionOptions = metaRegions.map(region =>
      ({value: region.get('key'), label: region.get('value')}
    )).toJS();

    const facilityOptions = filteredMetaFacilities.map(facility =>
      ({value: facility.get('key'), label: facility.get('value')}
    )).toJS();

    return (
      <div>
        <label htmlFor='regionFilter'>Region Filter</label>
        <Select
            id='regionFilter'
            isLoading={isFetchingData}
            matchPos='any'
            matchProp='label'
            placeholder='Select Region...'
            value={regionKey}
            options={regionOptions}
            onChange={this.selectRegion}
        />
        <label htmlFor='facilityFilter'>Facility Filter</label>
        <Select
            id='facilityFilter'
            disabled={regionKey === null}
            isLoading={isFetchingData}
            matchPos='any'
            matchProp='label'
            placeholder='Select Facility...'
            value={facilityKey}
            options={facilityOptions}
            onChange={this.selectFacility}
        />
      </div>
      );
  }
});

export default SummaryLocationFilters;
