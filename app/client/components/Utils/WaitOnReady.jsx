import React, {PropTypes} from 'react';
import LoadingIndicator from '../LoadingIndicator.jsx';
import {getDisplayName} from '../../util/hoc.js';

/**
 * Renders a loading indicator in place of Component until loading completes
 */
export const waitOnReady = Component => {
  class Wrapped extends React.Component {
    render() {
      if (this.props.isReady) {
        return <Component {...this.props} />;
      }
      return <LoadingIndicator />;
    }
  }

  Wrapped.displayName = `WaitOnReady(${getDisplayName(Component)})`;

  Wrapped.propTypes = {
    isReady: PropTypes.bool.isRequired,
  };

  return Wrapped;
};

export default waitOnReady;
