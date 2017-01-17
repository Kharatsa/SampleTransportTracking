import {compose} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {queryValue} from '../util/router';
import {fetchChanges} from '../actions/actioncreators';
import {callOnMount, callOnPropChanged} from '../components/Utils';
import {intFromString} from '../util/convert';

const pageValue = queryValue('page', intFromString);

// TODO: get filter from router

export const ChangesDataContainer = compose(
  connect(
    state => ({
      filter: state.summaryFilter,
    }),
    {fetchChanges}),
  withRouter,
  callOnMount(
    ({fetchChanges, filter, router}) => {
      const page = pageValue(router);
      return fetchChanges(filter, page);
    }),
  callOnPropChanged(
    ({router}) => pageValue(router),
    (page, {fetchChanges, filter}) => fetchChanges(filter, page)),
)(() => null);

export default ChangesDataContainer;
