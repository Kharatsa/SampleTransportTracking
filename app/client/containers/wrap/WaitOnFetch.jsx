'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LoadingIndicator from '../../components/LoadingIndicator.jsx';

export const ShowLoading = Component => {
  const Wrapped = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      isFetchingData: PropTypes.bool.isRequired
    },

    render() {
      const {isFetchingData, metadata} = this.props;

      if (isFetchingData || metadata.size === 0) {
        return (<LoadingIndicator />);
      }
      return (<Component {...this.props} />);
    }
  });

  return connect(state => ({
    isFetchingData: state.isFetchingData,
    metadata: state.metadata
  }))(Wrapped);
};

export default ShowLoading;
