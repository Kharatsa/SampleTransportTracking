import React, {PropTypes} from 'react';
import SideMenu from './SideMenu';

export const SideMenuLayout = React.createClass({
  propTypes: {
    menuHeader: PropTypes.string.isRequired,
    menuItems: PropTypes.arrayOf(PropTypes.node),
    children: PropTypes.node
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

    const items = menuItems.map((item, i) => <span key={i}>{item}</span>);

    return (
      <div id='layout' className={isMenuOpen ? 'active' : ''}>
        <SideMenu
            header={menuHeader}
            isMenuOpen={isMenuOpen}
            openMenu={this.toggleMenu} >
          {items}
        </SideMenu>
        <div id='main'>
          {children}
        </div>
      </div>
    );
  }
});

export default SideMenuLayout;
