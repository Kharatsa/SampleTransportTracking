import React from 'react';
import {getDisplayName} from '../../util/hoc';

/**
 * Returns the target value from props
 * @callback getValueCallback
 * @param {Object} props - componentWillReceiveProps nextProps
 * @returns {Any}
 */

/**
 * Does something with the latest target value
 * @callback updateCallback
 * @param {Any} value
 * @param {Object} props
 */

/**
 * @param {getValueCallback} getValue
 * @param {updateCallback} update
 * @returns {Function}
 */
export const callOnPropChanged = (getValue, update) => {
  return Component => {

    let last;

    class Wrapped extends React.Component {
      componentWillReceiveProps(nextProps) {
        const next = getValue(nextProps);
        if (last !== next) {
          update.call(this, next, nextProps);
          last = next;
        }
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    Wrapped.displayName = `CallOnPropChanged(${getDisplayName(Component)})`;

    return Wrapped;
  };
};

export default callOnPropChanged;

