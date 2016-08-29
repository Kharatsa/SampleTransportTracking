import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export const Admin = React.createClass({
  propTypes: {
    actions: PropTypes.object,
    children: PropTypes.node,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentWillMount() {
    const {fetchUsers} = this.props;
    fetchUsers();
  },

  render() {
    if (this.props.children) {
      return this.props.children;
    } else {
      return <div></div>;
    }
  }
});

export default Admin;
