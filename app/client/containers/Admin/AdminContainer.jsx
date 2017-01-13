import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchUsers} from '../../actions/actioncreators.js';
import {AdminParent} from '../../components/Admin';
import {callOnMount} from '../../components/Utils';

export const AdminContainer = compose(
  connect(null, {fetchUsers}),
  callOnMount(({fetchUsers}) => fetchUsers()),
)(AdminParent);

export default AdminContainer;
