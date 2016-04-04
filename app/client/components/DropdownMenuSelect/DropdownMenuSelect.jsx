import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DropdownParent from './DropdownParent';

// const PREFIX = 'pure-';
// const ACTIVE_CLASS_NAME = PREFIX + 'menu-active';
// const MENU_PARENT_CLASS_NAME = 'pure-menu-has-children';
// const MENU_ACTIVE_SELECTOR = '.pure-menu-active';
// const MENU_LINK_SELECTOR = '.pure-menu-link';
// const MENU_SELECTOR = '.pure-menu-children';
// const DISMISS_EVENT = (
//   window.hasOwnProperty && window.hasOwnProperty('ontouchstart') ?
//   'touchstart' :
//   'mousedown');

// const DOWN_ARROW_KEY_CODE = 40;
// const UP_ARROW_KEY_CODE = 38;
// const ESC_KEY_CODE = 27;

// const haltEvent = (e) => {
//   e.stopPropagation();
//   e.preventDefault();
// };

export const DropdownMenuSelect = React.createClass({
  propTypes: {
    children: PropTypes.arrayOf(PropTypes.any).isRequired
  },

  shouldComponentUpdate(nextProps, nextState) {
    const {children} = this.props;
    const {children: nextChildren} = nextProps;
    const {menuOpen: nextMenuOpen} = nextState;
    return (!(
      this.state.menuOpen === nextMenuOpen &&
      children.length === nextChildren.length &&
      children === nextChildren
    ));
  },

  getInitialState: function() {
    return {menuOpen: false};
  },

  _toggleMenu() {
    this.setState({menuOpen: !this.state.menuOpen});
  },

  render() {
    // receives "onSelect"
    //  onSelect called with index (of children)
    //
    // require a function that returns a label/value for each child?
    // then, when selected, it would update selectedName
    //
    // alternatively, force children to by of some special component type
    //
    // children should all have display "value"
    // this value used to update the "selected name"
    // also need "default name" when none is selected

    const selectedName = 'TODO';

    const menuItems = this.props.children.map((child, index) => {
      return (
        <li className='pure-menu-item' key={index}>
          <div className='pure-menu-link'>{child}</div>
        </li>);
    });

    return (
      <div
          className='pure-menu custom-restricted-width black-bg'
          onClick={this._toggleMenu}>
        <ul className='pure-menu-list'>
            <DropdownParent
                selectedName={selectedName}
                menuOpen={this.state.menuOpen} >
              {menuItems}
            </DropdownParent>
        </ul>
      </div>);
  }
});

export default DropdownMenuSelect;

