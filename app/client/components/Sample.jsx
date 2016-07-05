import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import WaitOnFetch from './WaitOnFetch.jsx';
import SampleDetail from './SampleDetail';

const WrappedSampleDetail = WaitOnFetch(SampleDetail);

export const Sample = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    isLoading: PropTypes.bool.isRequired,
    params: PropTypes.shape({sampleId: PropTypes.string}),
    actions: PropTypes.shape({fetchSampleDetail: PropTypes.func.isRequired})
  },

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
