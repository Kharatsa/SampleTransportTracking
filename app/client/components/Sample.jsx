import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import WaitOnFetch from '../containers/wrappers/WaitOnFetch.jsx';
import SampleDetail from './SampleDetail';

const WrappedSampleDetail = WaitOnFetch(SampleDetail);

export const Sample = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    const {sampleId} = this.props.params;
    const {fetchSampleDetail} = this.props.actions;
    fetchSampleDetail(sampleId);
  },

  render() {
    return <WrappedSampleDetail {...this.props} />;
  }
});

export default Sample;
