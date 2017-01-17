import {compose} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {paramValue} from '../util/router';
import {fetchSampleDetail} from '../actions/actioncreators.js';
import {callOnMount} from '../components/Utils';
import {NullComponent} from '../util/hoc';

const sampleIdValue = paramValue('sampleId');

export const SampleDetailDataContainer = compose(
  connect(null, {fetchSampleDetail}),
  withRouter,
  callOnMount(
    ({fetchSampleDetail, router}) => {
      const sampleId = sampleIdValue(router);
      return fetchSampleDetail(sampleId);
    }),
)(NullComponent);

export default SampleDetailDataContainer;
