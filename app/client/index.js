import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './containers/Root';
import store from './store';
import './util/memorystats';


// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
