import React, {PropTypes} from 'react';
import LoadingIndicator from '../LoadingIndicator.jsx';
import {getDisplayName} from '../../util/hoc.js';

/**
 * Renders a loading indicator in place of Component until loading completes
 */
export const waitOnReady = Component => {
  return React.createClass({
    displayName: `WaitOnReady(${getDisplayName(Component)})`,

    propTypes: {
      isReady: PropTypes.bool.isRequired,
    },

    render() {
      if (this.props.isReady) {
        return <Component {...this.props} />;
      }
      return <LoadingIndicator />;
    }
  });
};

export default waitOnReady;
