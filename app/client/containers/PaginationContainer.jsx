import {connect} from 'react-redux';
import {Pagination} from '../components';

export const PaginationContainer = connect(
  state => ({
    total: state.paginationTotal,
    perPage: state.paginationPerPage,
    page: state.paginationPage,
  })
)(Pagination);

export default PaginationContainer;
