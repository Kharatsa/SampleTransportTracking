import React from 'react';
import {getDisplayName, NullComponent} from '../../util/hoc';
import {allTrue} from '../../util/arrays';

const makeCheckProps = (...propNames) => {
  return props => {
    const values = propNames.map((name) => props[name]);
    return allTrue(...values);
  };
};

/**
 * @callback getPropCallback
 * @param {Object} props
 * @returns {Any}
 */

/**
 * @param {string|getPropCallback} prop
 * @returns {Function}
 */
export const waitOnProp = (...propNames) => {
  const arePropsReady = makeCheckProps(...propNames);

  return Component => {
    const Wrapped = (props) => {
      if (arePropsReady(props)) {
        return <Component {...props} />;
      }
      return <NullComponent />;
    };

    Wrapped.displayName = `WaitOnProp(${getDisplayName(Component)})`;

    return Wrapped;
  };
};

export default waitOnProp;
