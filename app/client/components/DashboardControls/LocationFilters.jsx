import React, {PropTypes} from 'react';
import Select from 'react-select';
import {routerPropTypes} from '../../util/proptypes';

export class LocationFilters extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _selectLocationFilter(router, selected, type) {
    const {filterRegionKey, filterFacilityKey} = this.props;
    const {changeSummaryFilter} = this.props;

    if (!selected) {
      if (type === 'region') {
        router.pushWithQuery({
          query: {region: null, facility: null},
        });
        return changeSummaryFilter({
          regionKey: null, facilityKey: null,
        });

      } else {
        router.pushWithQuery({
          query: {region: filterRegionKey, facility: null},
        });
        return changeSummaryFilter({
          regionKey: filterRegionKey, facilityKey: null,
        });

      }

    } else {
      const {value: selectedKey} = selected;
      if (type === 'facility' && selectedKey !== filterFacilityKey) {
        router.pushWithQuery({
          query: {region: filterRegionKey, facility: selectedKey},
        });
        return changeSummaryFilter({
          regionKey: filterRegionKey, facilityKey: selectedKey,
        });

      } else if (type === 'region') {
        router.pushWithQuery({
          query: {region: selectedKey, facility: filterFacilityKey},
        });
        return changeSummaryFilter({
          regionKey: selectedKey, facilityKey: filterFacilityKey,
        });

      }
    }
  }

  selectFacility(router, selectedKey) {
    this._selectLocationFilter(router, selectedKey, 'facility');
  }

  selectRegion(router, selectedKey) {
    this._selectLocationFilter(router, selectedKey, 'region');
  }

  render() {
    const {
      isReady, metaRegions, filteredMetaFacilities, filterRegionKey,
      filterFacilityKey, router,
    } = this.props;

    const regionKey = filterRegionKey;
    const facilityKey = filterFacilityKey;

    const regionOptions = metaRegions.map(region =>
      ({value: region.get('key'), label: region.get('value')}
    )).toJS();

    const facilityOptions = filteredMetaFacilities.map(facility =>
      ({value: facility.get('key'), label: facility.get('value')}
    )).toJS();

    return (
      <div>
        <label htmlFor='regionFilter'>Laboratory</label>
        <Select
            id='regionFilter'
            isLoading={!isReady}
            matchPos='any'
            matchProp='label'
            placeholder='Select Laboratory...'
            value={regionKey}
            options={regionOptions}
            onChange={this.selectRegion.bind(this, router)}
        />
        <label htmlFor='facilityFilter'>Facility</label>
        <Select
            id='facilityFilter'
            disabled={regionKey === null}
            isLoading={!isReady}
            matchPos='any'
            matchProp='label'
            placeholder='Select Facility...'
            value={facilityKey}
            options={facilityOptions}
            onChange={this.selectFacility.bind(this, router)}
        />
      </div>
    );
  }
}

LocationFilters.propTypes = {
  isReady: PropTypes.bool.isRequired,
  metaRegions: PropTypes.object.isRequired,
  filteredMetaFacilities: PropTypes.object.isRequired,
  filterRegionKey: PropTypes.string,
  filterFacilityKey: PropTypes.string,
  changeSummaryFilter: PropTypes.func.isRequired,
  ...routerPropTypes,
};

export default LocationFilters;
