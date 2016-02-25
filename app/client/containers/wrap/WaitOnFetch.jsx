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
      const {isFetchingData} = this.props;

      if (isFetchingData) {
        return (<LoadingIndicator />);
      }
      return (<Component {...this.props} />);
    }
  });

  return connect(state => ({isFetchingData: state.isFetchingData}))(Wrapped);
};

export default ShowLoading;
