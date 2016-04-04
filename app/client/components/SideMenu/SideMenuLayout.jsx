import React, {PropTypes} from 'react';
import SideMenu from './SideMenu';

export const SideMenuLayout = React.createClass({
  propTypes: {
    menuHeader: PropTypes.string.isRequired,
    menuItems: PropTypes.array
  },

  getInitialState: function() {
    return {menuOpen: false};
  },

  toggleMenu() {
    this.setState({menuOpen: !this.menuOpen});
  },

  render() {
    const {menuHeader, menuItems, children} = this.props;

    return (
      <div id='layout' className={this.menuOpen ? 'active' : ''}>
        <SideMenu
            header={menuHeader}
            isOpen={this.menuOpen}
            openMenu={this.toggleMenu} >
          {menuItems}
        </SideMenu>
        <div id='main'>
          {children}
        </div>
      </div>
    );
  }
});

export default SideMenuLayout;
