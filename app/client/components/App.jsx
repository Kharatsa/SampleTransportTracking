import React, {PropTypes} from 'react';

const APP_NAME = 'Sample Tracking';

export const AppComponent = React.createClass({
  propTypes: {
    fetchMetadata: PropTypes.func.isRequired,
    children: PropTypes.node,
  },

  componentWillMount() {
    const {fetchMetadata} = this.props;
    fetchMetadata();
  },

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {appName: APP_NAME})
    );
    return <div id='app'>{children}</div>;
  }
});

export default AppComponent;
