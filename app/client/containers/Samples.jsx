import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchSampleDetail} from '../actions/actioncreators.js';
import WaitOnFetch from './wrap/WaitOnFetch.jsx';
import LatestSamples from '../components/LatestSamples/LatestSamples.jsx';
import SampleDetail from '../components/SampleDetail/SampleDetail.jsx';

const WrappedLatestSamples = WaitOnFetch(LatestSamples);
const WrappedSampleDetail = WaitOnFetch(SampleDetail);

const Samples = React.createClass({
  // TODO: implement shouldComponentUpdate
  mixins: [PureRenderMixin],

  componentWillMount() {
    const {sampleId} = this.props.params;
    const {fetchSampleDetail} = this.props.actions;
    if (sampleId) {
      fetchSampleDetail(sampleId);
    } else {
      // TODO: fetch sample list
    }
  },

  render() {
    const {sampleId} = this.props.params;

    let child;
    if (sampleId) {
      child = <WrappedSampleDetail {...this.props} />;
    } else {
      child = <WrappedLatestSamples {...this.props} />;
    }

    return child;
  }
});

export default connect(
  state => ({
    isFetchingData: state.isFetchingData,
    selectedSampleId: state.selectedSampleId,
    samplesById: state.samplesById,
    changeIds: state.changeIds,
    changesById: state.changesById,
    artifactIds: state.artifactIds,
    artifactsById: state.artifactsById,
    labTestIds: state.labTestIds,
    labTestsById: state.labTestsById,
    changesByArtifactId: state.changesByArtifactId,
    changesByLabTestId: state.changesByLabTestId,
    metadata: state.metadata
  }),
  dispatch => ({actions: bindActionCreators({fetchSampleDetail}, dispatch)})
)(Samples);
