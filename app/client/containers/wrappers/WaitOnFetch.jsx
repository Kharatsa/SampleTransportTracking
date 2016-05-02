import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {getIsLoading} from '../../selectors/uiselectors';
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
      isLoading: PropTypes.bool.isRequired
    },

    _isLoading() {
      return this.props.isLoading;
    },

    render() {
      if (this._isLoading()) {
        return (<LoadingIndicator />);
      }
      return (<Component {...this.props} />);
    }
  });

  return connect(state => ({
    isLoading: getIsLoading(state)
  }))(Wrapped);
};

export default ShowLoading;
