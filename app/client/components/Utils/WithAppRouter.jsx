import React from 'react';
import {withRouter} from 'react-router';
import {getDisplayName} from '../../util/hoc';
import {routerPropTypes} from '../../util/proptypes';
import {AppRouter} from '../../util/router';

const appRouterFactory = router => {
  return new AppRouter(router);
};

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
