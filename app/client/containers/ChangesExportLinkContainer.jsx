import {connect} from 'react-redux';
import {ChangesExportLink} from '../components/Changes';

export const ChangesExportLinkContainer = connect(
  state => ({summaryFilter: state.summaryFilter})
)(ChangesExportLink);

export default ChangesExportLinkContainer;
