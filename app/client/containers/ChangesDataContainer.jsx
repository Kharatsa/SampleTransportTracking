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
  callOnMount(function() {
    this.props.fetchChanges(this.props.filter, this.props.page);
  }),
  callOnProps(
    function(nextProps) {
      this.props.fetchChanges(nextProps.filter, nextProps.page);
    },
    function(nextProps) {
      return (
        this.props.filter !== nextProps.filter ||
        this.props.page !== nextProps.page
      );
    }),
)(() => null);

export default ChangesDataContainer;
