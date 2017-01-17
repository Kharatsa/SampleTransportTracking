import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchMetadata} from '../actions/actioncreators.js';
import {App} from '../components';
import {callOnMount} from '../components/Utils';

export const AppContainer = compose(
  connect(null, {fetchMetadata}),
  callOnMount(({fetchMetadata}) => fetchMetadata()),
)(App);

export default AppContainer;
