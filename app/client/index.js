'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './containers/Root.jsx';
import store from './store.js';

// Load the memory profiler during development
if (process.env.NODE_ENV !== 'production') {
  (function() {
    const loadError = err => {
      throw new URIError(`The script ${err.target.src} is not accessible.`);
    };

    const importScript = (src, loadFunc) => {
      let debugElem = document.createElement('script');
      debugElem.type = 'text/javascript';
      debugElem.onerror = loadError;
      if (loadFunc) {
        debugElem.onload = loadFunc;
      }
      document.body.appendChild(debugElem);
      debugElem.src = src;
    };

    const loadStats = () => {
      let stats = new window.MemoryStats();

      stats.domElement.style.position = 'fixed';
      stats.domElement.style.right = '0px';
      stats.domElement.style.bottom = '0px';

      document.body.appendChild(stats.domElement);

      requestAnimationFrame(function rAFloop() {
        stats.update();
        requestAnimationFrame(rAFloop);
      });
    };

    importScript('/lib/debug.js', loadStats);
  }());
}

// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
