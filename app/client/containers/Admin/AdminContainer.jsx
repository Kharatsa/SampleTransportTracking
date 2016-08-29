import {connect} from 'react-redux';
import {fetchUsers} from '../../actions/actioncreators.js';
import {AdminParent} from '../../components/Admin';

export const AdminContainer = connect(
  state => ({}),
  {fetchUsers}
)(AdminParent);

export default AdminContainer;
