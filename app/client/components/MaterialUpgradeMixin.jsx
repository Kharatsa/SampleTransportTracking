'use strict'

/* global componentHandler */

import Material from '../util/material.js';

export const componentHandler = window.componentHandler;

export default {
  componentWillUpdate: function() {
    componentHandler.upgradeDom();
  }
};
