import React from 'react';
import {getDisplayName} from '../../util/hoc.js';

/*
 * Calls the prop function specified by the onMountFunc prop.
 */
export const callOnMount = (onMountFunc) => {
  return Component => {
    return React.createClass({
      displayName: `CallOnMount(${getDisplayName(Component)})`,

      componentDidMount() {
        onMountFunc.call(this);
      },

      render() {
        return <Component {...this.props} />;
      }
    });
  };
};

export default callOnMount;
