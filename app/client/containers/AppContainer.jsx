import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/actioncreators.js';
import {App} from '../components';

export const AppContainer = connect(
  state => (state),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(App);

export default AppContainer;
