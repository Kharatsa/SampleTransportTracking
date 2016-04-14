import React, {PropTypes} from 'react';

const APP_NAME = 'Sample Tracking';

export const AppComponent = React.createClass({
  propTypes: {
    actions: PropTypes.object,
    children: PropTypes.any
  },

  componentWillMount() {
    const {fetchMetadata} = this.props.actions;
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
