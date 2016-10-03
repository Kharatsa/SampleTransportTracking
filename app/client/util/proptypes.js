import {PropTypes} from 'react';

/**
 * Probably unnecessary to check React Router's props, but why not?
 * via https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/API.md#route-components
 **/
const routerRoutes = {
  childRoutes: PropTypes.arrayOf(PropTypes.shape(routerRoutes)),
  component: PropTypes.func,
  path: PropTypes.string,
};

export const routerLocationPropTypes = {
  hash: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  key: PropTypes.key,
  query: PropTypes.object,
  state: PropTypes.object,
};

export const routerPropTypes = {
  location: PropTypes.shape(routerLocationPropTypes),
  route: PropTypes.shape(routerRoutes),
};

/**
 * Probably unnecessary to check React Virtualized's props
 * https://github.com/bvaughn/react-virtualized/blob/8.0.11/docs/Column.md#cellrenderer
 **/
export const cellRendererPropTypes = {
  cellData: PropTypes.any.isRequired,
  columnData: PropTypes.any.isRequired,
  dataKey: PropTypes.string.isRequired,
  isScrolling: PropTypes.bool.isRequired,
  rowData: PropTypes.any.isRequired,
  rowIndex: PropTypes.number.isRequired,
  key: PropTypes.any.isRequired,
  style: PropTypes.object.isRequired,
};

/**
 * via https://facebook.github.io/react/tips/children-props-type.html
 **/
export const childrenPropType = PropTypes.node;
