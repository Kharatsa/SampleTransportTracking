'use strict'

/* global componentHandler */

export default {
  componentWillUpdate: function() {
    componentHandler.upgradeDom();
  }
};
