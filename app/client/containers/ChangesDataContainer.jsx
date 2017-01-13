import {compose} from 'redux';
import {connect} from 'react-redux';
import {changePage, fetchChanges} from '../actions/actioncreators';
import {getCurrentPage} from '../selectors/uiselectors';
import {callOnMount, callOnProps, watchRouter} from '../components/Utils';

export const ChangesDataContainer = compose(
  connect(
    state => ({
      filter: state.summaryFilter,
      page: getCurrentPage(state),
    }),
    {changePage, fetchChanges}),
  watchRouter(
    ({location: {query}}) => query.page && Number(query.page) || 1,
    (page, {changePage}) => changePage(page),
  ),
  callOnMount(
    ({fetchChanges, filter, page}) => fetchChanges(filter, page)),
  callOnProps(
    ({fetchChanges}, {filter, page}) => fetchChanges(filter, page),
    ({filter, page}, {filter: nextFilter, page: nextPage}) => {
      return filter !== nextFilter || page !== nextPage;
    }),
)(() => null);

export default ChangesDataContainer;
