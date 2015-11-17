'use strict';

var redux = require('redux');
var actions = require('app/client/actions/actions.js');

const initialState = {
  name: '',
};

var stApp = function(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case actions.SOMETHING:
      return 'something';
    case actions.SOMETHING_ELSE:
      return 'else';
    default:
      return state;
  }
};

var todoApp = redux.combineReducers({stApp: stApp});

module.exports = todoApp;
