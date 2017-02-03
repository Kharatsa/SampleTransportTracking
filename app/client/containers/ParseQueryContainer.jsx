import {compose} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {changePage, changeSummaryFilter} from '../actions/actioncreators.js';
import {ParseQuery} from '../components';
import {
  callOnMount, callOnPropChanged, waitOnReady, withAppRouter,
} from '../components/Utils';
import {queryValue, manyValues} from '../util/router';

/**
 * Returns an in-order array of strings parsed from the query.
 * @param {Object} router
 * @returns {string[]}
 */
const loadQuery = manyValues(
  queryValue('after'),
  queryValue('before'),
  queryValue('region'),
  queryValue('facility'),
  queryValue('page'),
);

/**
 * Returns the updated location filter object, or null when no update is
 * necessary.
 * @param {string} regionQuery
 * @param {string} facilityQuery
 * @param {string} regionFilter
 * @param {string} facilityFilter
 * @returns {Object|null}
 */
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

/**
 * Returns the updated date filter object, or null when no update is
 * necessary.
 * @param {string} afterQuery
 * @param {string} beforeQuery
 * @param {string} afterDate
 * @param {string} beforeDate
 * @returns {Object|null}
 */
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

/**
 * @param {string} pageQuery
 * @param {string} pageNum
 * @returns {number|null}
 */
const loadPageQuery = ({pageQuery, pageNum}) => {
  const parsed = Number(pageQuery);
  if (!Number.isNaN(parsed) && parsed !== pageNum) {
    return parsed;
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
      page: state.paginationPage.get('current', null),
    }),
    {changeSummaryFilter, changePage},
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
      [afterQuery, beforeQuery, regionQuery, facilityQuery, pageQuery],
      {after, before, region, facility, page, changeSummaryFilter, changePage},
    ) => {
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
        return changeSummaryFilter({...dateFilter, ...locationFilter});
      }

      const changedPageNum = loadPageQuery({pageQuery, pageNum: page});

      if (changedPageNum) {
        changePage(changedPageNum);
      }

    }),

  waitOnReady,

)(ParseQuery);

export default ParseQueryContainer;
