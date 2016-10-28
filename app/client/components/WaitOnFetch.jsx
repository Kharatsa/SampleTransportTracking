import React, {PropTypes} from 'react';
import LoadingIndicator from './LoadingIndicator.jsx';

/**
 * Renders a loading indicator in place of Component until loading completes
 *
 * IMPORTANT USAGE NOTES:
 *   1) Don't wrap the Component responsible for updating isFetchingData/metadata.
 *      The wrapped Component will NOT be mounted in _isLoading() returns true.
 *      In other words, the wrapped Component's lifecyle methods are not called
 *      until after _isLoading() returns true. Any state changes that will update
 *      isFetchingData and metadata must occur above this wrapper Component.
 *
 *   2) The component wrapped by WaitOnFetch MUST receive one of isLoading,
 *      isFetchingData, or isFetchingMetadata as props.
 *
 */
export const WaitOnFetch = Component => {
  return React.createClass({
    displayName: `WaitOnFetch(${Component.displayName})`,

    propTypes: {
      isLoading: PropTypes.bool,
      isFetchingData: PropTypes.bool,
      isFetchingMetadata: PropTypes.bool
    },

    getDefaultProps() {
      return {
        isLoading: false,
        isFetchingData: false,
        isFetchingMetadata: false
      };
    },

    componentWillReceiveProps(nextProps) {
      if (process.env.NODE_ENV !== 'production') {
        if (nextProps.isLoading !== undefined) {
          return;
        }
        if (nextProps.isFetchingData !== undefined) {
          return;
        }
        if (nextProps.isFetchingMetadata !== undefined) {
          return;
        }
        console.error('WaitOnFetch must be passed one of isLoading, ' +
                      'isFetchingData, or isFetchingMetadata as props!');
      }
    },

    shouldComponentUpdate(nextProps) {
      return this.props !== nextProps;
    },

    _isLoading() {
      const {isLoading, isFetchingData, isFetchingMetadata} = this.props;
      return isLoading || isFetchingData || isFetchingMetadata;
    },

    render() {
      if (this._isLoading()) {
        return (<LoadingIndicator />);
      }
      return (<Component {...this.props} />);
    }
  });
};

export default WaitOnFetch;
