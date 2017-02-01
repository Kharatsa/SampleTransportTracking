import {compose} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {changeSummaryFilter} from '../actions/actioncreators.js';
import {ParseQuery} from '../components';
import {
  callOnMount, callOnPropChanged, waitOnReady, withAppRouter,
} from '../components/Utils';
import {queryValue, manyValues} from '../util/router';

const loadQuery = manyValues(
  queryValue('after'),
  queryValue('before'),
  queryValue('region'),
  queryValue('facility'),
  // queryValue('page'),
);

const loadLocationQuery = ({
  regionQuery, facilityQuery, regionFilter, facilityFilter,
}) => {
  const changes = {};

  if (regionQuery !== regionFilter) {
    if (regionQuery) {
      changes.regionKey = regionQuery;
    } else if (regionFilter) {
      // Explicit null for erasing a populated region filter
      changes.regionKey = regionQuery || null;
    }
  }
  if (facilityQuery !== facilityFilter) {
    if (facilityQuery) {
      changes.facilityKey = facilityQuery;
    } else if (facilityFilter) {
      // Explicit null for erasing a populated facility filter
      changes.facilityKey = facilityQuery || null;
    }
  }

  if (Object.keys(changes).length) {
    return changes;
  }
  return null;
};

const loadDateQuery = ({
  afterQuery, beforeQuery, afterDate, beforeDate,
}) => {
  const changes = {};

  const after = moment(afterQuery);
  if (!after.isSame(afterDate, 'day')) {
    changes.afterDate = after;
  }

  const before = moment(beforeQuery);
  if (!before.isSame(beforeDate, 'day')) {
    changes.beforeDate = before;
  }

  if (Object.keys(changes).length) {
    return changes;
  }
  return null;
};

export const ParseQueryContainer = compose(
  connect(
    state => ({
      isReady: state.isQueryProcessed,
      after: state.summaryFilter.get('afterDate', null),
      before: state.summaryFilter.get('beforeDate', null),
      region: state.summaryFilter.get('regionKey', null),
      facility: state.summaryFilter.get('facilityKey', null),
      // page: null,
    }),
    {changeSummaryFilter},
  ),

  withAppRouter,

  callOnMount(({
    router, after, before, region, facility, changeSummaryFilter,
  }) => {
    const [
      afterQuery, beforeQuery, regionQuery, facilityQuery,
    ] = loadQuery(router);

    const queryDateValues = loadDateQuery({
      afterQuery,
      beforeQuery,
      afterDate: after,
      beforeDate: before,
    }) || {};

    const queryLocationValues = loadLocationQuery({
      facilityQuery,
      regionQuery,
      facilityFilter: facility,
      regionFilter: region,
    }) || {};

    changeSummaryFilter({
      queryProcessed: true,
      ...queryDateValues,
      ...queryLocationValues,
    });

  }),

  // Handle changed filters in the query
  callOnPropChanged(
    ({router}) => loadQuery(router),
    (
      [afterQuery, beforeQuery, regionQuery, facilityQuery],
      {router, after, before, region, facility, changeSummaryFilter}
    ) => {
      console.debug(`Checking location ${JSON.stringify(router.location)} for changes`);
      const queryDateChanges = loadDateQuery({
        afterQuery,
        beforeQuery,
        afterDate: after,
        beforeDate: before,
      });

      const queryLocationChanges = loadLocationQuery({
        facilityQuery,
        regionQuery,
        facilityFilter: facility,
        regionFilter: region,
      });

      if (queryDateChanges || queryLocationChanges) {
        // Synchronize these updated filter values with state
        const dateFilter = queryDateChanges || {};
        const locationFilter = queryLocationChanges || {};
        console.debug(`Updating state dates=${JSON.stringify(dateFilter)}, locations=${JSON.stringify(locationFilter)}`);
        return changeSummaryFilter({...dateFilter, ...locationFilter});
      }

    }),

  waitOnReady,

)(ParseQuery);

export default ParseQueryContainer;
