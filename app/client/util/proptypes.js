import {PropTypes} from 'react';

/**
 * Probably unnecessary to check React Router's props, but why not?
 * via https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/API.md#route-components
 **/
const routerRoutes = {
  childRoutes: PropTypes.arrayOf(PropTypes.shape(routerRoutes)),
  component: PropTypes.func,
  path: PropTypes.string,
}

export const routerPropTypes = {
  location: PropTypes.shape({
    action: PropTypes.string,
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    query: PropTypes.object,
    search: PropTypes.string,
    state: PropTypes.object,
  }),
  route: PropTypes.shape(routerRoutes),
}
