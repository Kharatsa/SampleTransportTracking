import React from 'react';
import {withRouter} from 'react-router';
import {getDisplayName} from '../../util/hoc';
import {routerPropTypes} from '../../util/proptypes';

const appRouterFactory = router => {
  return new AppRouter(router);
}

/** Extended React Router helper class */
class AppRouter {
  /**
   * Create a new AppRouter
   * @param {Object} router - React Router router instance
   */
  constructor(router) {
    this._router = router;

    this.location = router.location;

    // Expose router methods on this object
    this.push = router.push.bind(router);
    this.replace = router.replace.bind(router);
    this.go = router.go.bind(router);
    this.goBack = router.goBack.bind(router);
    this.goForward = router.goForward.bind(router);
    this.setRouteLeaveHook = router.setRouteLeaveHook.bind(router);
    this.go = router.go.bind(router);
    this.createPath = router.createPath.bind(router);
    this.createHref = router.createHref.bind(router);
    this.isActive = router.isActive.bind(router);
  }

  getDefaultQuery(afterDate, beforeDate) {
    const defaults = {};

    if (afterDate) {
      defaults.after = afterDate;
    }
    if (beforeDate) {
      defaults.before = beforeDate;
    }

    return defaults;
  }

  /**
   * Supplements the existing location with the new query parameters.
   * Any existing query keys represented in the new query will be overwritten.
   * @param {Object} query - New query parameters.
   * @param {Object} [state] - new history state
   */
  locationFromQuery(query, state) {
    const {location: {pathname}} = this._router;
    return {
      pathname: pathname,
      query: Object.assign({}, location.query, query),
      state,
    };
  }

  /**
   * @param {Object} query - New query parameters.
   * @param {Object} [state] - new history state
   */
  replaceWithQuery(query, state) {
    return this.replace(this.locationFromQuery(query, state));
  }

  /**
   * @param {Object} query - New query parameters.
   * @param {Object} [state] - new history state
   */
  pushWithQuery(query, state) {
    return this.push(this.locationFromQuery(query, state));
  }
}

export const withAppRouter = Component => {

  let router;

  class Wrapped extends React.Component {
    constructor(props) {
      super(props);
      router = appRouterFactory(props.router);
    }

    componentWillReceiveProps(nextProps) {
      router = appRouterFactory(nextProps.router);
    }

    render() {
      return <Component {...this.props} router={router} />;
    }
  }

  Wrapped.displayName = `WithAppRouter(${getDisplayName(Component)})`;

  Wrapped.propTypes = {
    ...routerPropTypes,
  };

  return withRouter(Wrapped);
};

export default withAppRouter;
