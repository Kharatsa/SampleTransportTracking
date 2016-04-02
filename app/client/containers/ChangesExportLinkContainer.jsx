'use strict';

import {connect} from 'react-redux';
import {ChangesExportLink} from '../components';

export const ChangesExportLinkContainer = connect(
  state => ({summaryFilter: state.summaryFilter})
)(ChangesExportLink);

export default ChangesExportLinkContainer;
