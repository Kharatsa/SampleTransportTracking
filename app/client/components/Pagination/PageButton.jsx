import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';
import classNames from 'classnames';

export const PageButton = ({disabled=false, linkTo, text}) => {
  const pureButton = classNames({
    'pure-button': true,
    'pure-button-disabled': disabled
  });

  // TODO(sean): do this in CSS
  const buttonStyle = {display: 'inline-block'};

  const buttonElem = (
    <button
        className={pureButton}
        style={buttonStyle}>
      {text}
    </button>
  );

  const linkedButtonElem = (
    disabled ?
    <span>{buttonElem}</span> :
    <Link to={linkTo}>{buttonElem}</Link>
  );

  return linkedButtonElem;
};

PageButton.propTypes = {
  disabled: PropTypes.bool,
  linkTo: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default PageButton;
