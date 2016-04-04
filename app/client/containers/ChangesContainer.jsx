import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {Changes} from '../components';

export const ChangesContainer = connect(
  state => ({
    changeIds: state.changeIds,
    changesById: state.changesById,
    changesTotal: state.changesTotal,
    samplesById: state.samplesById,
    artifactsById: state.artifactsById,
    labTestsById: state.labTestsById,
    isFetchingData: state.isFetchingData,
    metadata: state.metadata,
    page: state.page,
    summaryFilter: state.summaryFilter
  }),
  dispatch => ({actions: bindActionCreators({fetchChanges}, dispatch)})
)(Changes);

export default ChangesContainer;
