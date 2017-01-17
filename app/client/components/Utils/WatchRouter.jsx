import React from 'react';
import {withRouter} from 'react-router';
import {getDisplayName, NullComponent} from '../../util/hoc';
import {routerPropTypes} from '../../util/proptypes';

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
    let outdatedProps;

    const Wrapped = class WatchRouter extends React.Component {
      constructor(props) {
        super(props);
      }

      componentWillMount() {
        const {router} = this.props;
        const value = getValue(router);
        update(value, this.props);
        outdatedProps = true;
        last = value;
      }

      componentWillReceiveProps({router, ...others}) {
        const value = getValue(router);
        if (last !== value) {
          update(value, {router, ...others});
          last = value;
          outdatedProps = true;
        } else if (last === value && outdatedProps) {
          outdatedProps = false;
        }
      }

      render() {
        if (outdatedProps) {
          return <NullComponent />;
        }
        return <Component {...this.props} />;
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
