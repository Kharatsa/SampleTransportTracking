import {connect} from 'react-redux';
import {getCurrentPage} from '../selectors/uiselectors';
import {Pagination} from '../components';

export const PaginationContainer = connect(
  state => ({
    total: state.paginationTotal,
    perPage: state.paginationPerPage,
    currentPage: getCurrentPage(state),
  })
)(Pagination);

export default PaginationContainer;
