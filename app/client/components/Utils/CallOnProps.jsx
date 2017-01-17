import React from 'react';
import {getDisplayName} from '../../util/hoc.js';

/**
 * @callback updateCallback
 * @param {Object} props
 * @param {Object} nextProps
 */

/**
 * @callback shouldUpdateCallback
 * @param {Object} props
 * @param {Object} nextProps
 */

const alwaysUpdate = () => true;

/**
 * @param {updateCallback} update
 * @param {shouldUpdateCallback} shouldUpdate
 * @returns {Function}
 */
export const callOnProps = (update, shouldUpdate=alwaysUpdate) => {
  return Component => {
    class Wrapped extends React.Component {
      componentWillReceiveProps(nextProps) {
        if (shouldUpdate.call(this, this.props, nextProps)) {
          return update.call(this, this.props, nextProps);
        }
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    Wrapped.displayName = `CallForProps(${getDisplayName(Component)})`;

    return Wrapped;
  };
};

export default callOnProps;
