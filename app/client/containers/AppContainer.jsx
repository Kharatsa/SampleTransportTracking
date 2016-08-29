import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchMetadata} from '../actions/actioncreators.js';
import {App} from '../components';

export const AppContainer = connect(null, {fetchMetadata})(App);

export default AppContainer;
