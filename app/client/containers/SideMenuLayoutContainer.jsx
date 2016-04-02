'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleMenu} from '../actions/actioncreators.js';
import SideMenuLayout from '../components/SideMenu/SideMenuLayout';

export const SideMenuLayoutContainer = connect(
  state => ({menuOpen: state.menuOpen}),
  dispatch => ({actions: bindActionCreators({toggleMenu}, dispatch)})
)(SideMenuLayout);

export default SideMenuLayoutContainer;
