import React from 'react';
import {withRouter} from 'react-router';
import {getDisplayName} from '../../util/hoc.js';
import {routerPropTypes} from '../../util/proptypes.js';

/**
 * Returns the target value from the router's query parameters.
 * @callback getValueCallback
 * @param {Object}  - Router query parameters
 * @returns {Any}
 */

/**
 * Does something with the latest target value
 * @callback updateCallback
 * @param {Any} value
 * @param {Object} props
 */

/**
 * @param {getValueCallback} get
 * @param {updateCallback} update
 * @returns {Function}
 */
export const watchRouter = (getValue, update) => {
  return Component => {

    let last;

    const Wrapped = class WatchRouter extends React.Component {
      constructor(props) {
        super(props);
        const {router} = props;
        const value = getValue(router);
        last = value;
        update(value, this.props);
      }

      componentWillReceiveProps({router, ...others}) {
        const value = getValue(router);
        if (last !== value) {
          update(value, {router, ...others});
          last = value;
        }
      }

      render() {
        return (
          <Component {...this.props} />
        );
      }
    };
    Wrapped.propTypes = {
      ...routerPropTypes,
    };

    Wrapped.displayName = `WatchRouter(${getDisplayName(Component)})`;

    return withRouter(Wrapped);
  };
};

export default watchRouter;
