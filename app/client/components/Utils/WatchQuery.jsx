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
export const watchQuery = (getValue, update) => {
  return Component => {

    let last;

    const Wrapped = class WatchQuery extends React.Component {
      constructor(props) {
        super(props);
        const {router: {location: {query}}} = props;
        const value = getValue(query);
        last = value;
        update(value, this.props);
      }

      componentWillReceiveProps({router, ...others}) {
        const value = getValue(router.location.query);
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

    Wrapped.displayName = `WatchQuery(${getDisplayName(Component)})`;

    return withRouter(Wrapped);
  };
};

export default watchQuery;
