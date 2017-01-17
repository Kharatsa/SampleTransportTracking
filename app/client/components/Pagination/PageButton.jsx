import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';
import classNames from 'classnames';

export const PageButton = ({to, text, pageNum, disabled=false}) => {
  const pureButton = classNames({
    'pure-button': true,
    'pure-button-disabled': disabled,
    'stt-page-button': true,
  });

  const button = (
    <button className={pureButton} >
      {text}
    </button>
  );

  if (disabled) {
    return <span>{button}</span>;
  } else {
    const linkTo = {
      pathname: to,
      query: {page: pageNum},
    };
    return <Link to={linkTo}>{button}</Link>;
  }
};

PageButton.propTypes = {
  disabled: PropTypes.bool,
  pageNum: PropTypes.number.isRequired,
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default PageButton;
