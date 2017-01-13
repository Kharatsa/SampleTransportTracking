import React, {PropTypes} from 'react';
import SideMenu from './SideMenu';

export class SideMenuLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {isMenuOpen: false};
  }

  toggleMenu() {
    this.setState({isMenuOpen: !this.state.isMenuOpen});
  }

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
}

SideMenuLayout.propTypes = {
  menuHeader: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.node),
  children: PropTypes.node
};

export default SideMenuLayout;
