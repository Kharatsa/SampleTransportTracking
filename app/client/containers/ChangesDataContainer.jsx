import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {getCurrentPage} from '../selectors/uiselectors';
import {callOnMount, callOnProps} from '../components/Utils';

export const ChangesDataContainer = compose(
  connect(
    state => ({
      filter: state.summaryFilter,
      page: getCurrentPage(state),
    }),
    {fetchChanges},
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
