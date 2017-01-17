import React from 'react';
import {getDisplayName} from '../../util/hoc';

/**
 * @callback onMountCallback
 * @param {Object} props
 */

/*
 * Calls the specified function with props on mount.
 * @param {onMountCallback} onMount
 * @returns {Function}
 */
export const callOnMount = (onMount) => {
  return Component => {
    class Wrapped extends React.Component {
      componentDidMount() {
        onMount.call(this, this.props);
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    Wrapped.displayName = `CallOnMount(${getDisplayName(Component)})`;

    return Wrapped;
  };
};

export default callOnMount;
