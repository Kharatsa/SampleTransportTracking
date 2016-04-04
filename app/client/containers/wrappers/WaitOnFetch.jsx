import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LoadingIndicator from '../../components/LoadingIndicator.jsx';

/**
 * Renders a loading indicator in place of Component until loading completes
 *
 * IMPORTANT USAGE NOTE:
 *   Don't wrap the Component responsible for updating isFetchingData/metadata.
 *   The wrapped Component will NOT be mounted in _isLoading() returns true.
 *   In other words, the wrapped Component's lifecyle methods are not called
 *   until after _isLoading() returns true. Any state changes that will update
 *   isFetchingData and metadata must occur above this wrapper Component.
 *
 */
export const ShowLoading = Component => {
  const Wrapped = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      isFetchingData: PropTypes.bool.isRequired
    },

    _isLoading() {
      const {isFetchingData, metadata} = this.props;
      return isFetchingData || metadata.size === 0;
    },

    render() {
      if (this._isLoading()) {
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
