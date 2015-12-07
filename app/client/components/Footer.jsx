'use strict';

import React, {createClass} from 'react';

export default React.createClass({
  render: function() {
    return (
      <footer className='mdl-mini-footer'>
        <div className='mdl-mini-footer__left-section'>
          <div className='mdl-logo'>Sample Transport Tracking</div>
          <ul className='mdl-mini-footer__link-list'>
            <li><a href='#'>Help</a></li>
          </ul>
        </div>
      </footer>
    );
  }
})
