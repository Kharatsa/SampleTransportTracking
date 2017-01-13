import {compose} from 'redux';
import {connect} from 'react-redux';
import {changePage, fetchMetadata} from '../actions/actioncreators.js';
import {getCurrentPage} from '../selectors/uiselectors';
import {App} from '../components';
import {callOnMount, watchQuery} from '../components/Utils';

export const AppContainer = compose(
  connect(
    state => ({
      pageNum: getCurrentPage(state),
    }),
    {changePage, fetchMetadata}
  ),
  watchQuery(
    params => params.page && Number(params.page) || 1,
    (page, {changePage}) => changePage(page),
  ),
  callOnMount(function() {
    this.props.fetchMetadata();
  }),
)(App);

export default AppContainer;
