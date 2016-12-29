import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import WaitOnFetch from './WaitOnFetch.jsx';
import SampleDetail from './SampleDetail';

// const WrappedSampleDetail = WaitOnFetch(SampleDetail);

export const Sample = React.createClass({
  propTypes: {
    isReady: PropTypes.bool.isRequired,
    params: PropTypes.shape({sampleId: PropTypes.string}),
    fetchSampleDetail: PropTypes.func.isRequired,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentWillMount() {
    const {sampleId} = this.props.params;
    const {fetchSampleDetail} = this.props;
    fetchSampleDetail(sampleId);
  },

  render() {
    return <SampleDetail {...this.props} />;
  }
});

export default Sample;
