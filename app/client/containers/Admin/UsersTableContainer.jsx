import {connect} from 'react-redux';
import {UsersTable} from '../../components/Admin';

export const UsersTableContainer = connect(
  state => ({
    userIds: state.userIds,
    usersById: state.usersById,
  })
)(UsersTable);

export default UsersTableContainer;
