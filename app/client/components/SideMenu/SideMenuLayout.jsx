import React, {PropTypes} from 'react';
import SideMenu from './SideMenu';

export const SideMenuLayout = React.createClass({
  propTypes: {
    menuHeader: PropTypes.string.isRequired,
    menuItems: PropTypes.array
  },

  getInitialState: function() {
    return {isMenuOpen: false};
  },

  toggleMenu() {
    this.setState({isMenuOpen: !this.state.isMenuOpen});
  },

  render() {
    const {menuHeader, menuItems, children} = this.props;
    const {isMenuOpen} = this.state;

    return (
      <div id='layout' className={isMenuOpen ? 'active' : ''}>
        <SideMenu
            header={menuHeader}
            isMenuOpen={isMenuOpen}
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
