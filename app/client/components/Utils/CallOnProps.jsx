import React from 'react';
import {getDisplayName} from '../../util/hoc.js';

const alwaysUpdate = () => true;

export const callOnProps = (updateFunc, shouldUpdateFunc=alwaysUpdate) => {
  return Component => {
    return React.createClass({
      displayName: `CallForProps(${getDisplayName(Component)})`,

      componentWillReceiveProps(nextProps) {
        if (shouldUpdateFunc.call(this, nextProps)) {
          return updateFunc.call(this, nextProps);
        }
      },

      render() {
        return <Component {...this.props} />;
      }
    });
  };
};

export default callOnProps;
