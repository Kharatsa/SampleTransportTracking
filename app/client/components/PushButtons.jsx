import React, {PropTypes} from 'react';
import classnames from 'classnames';

export class PushButtons extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {selectedIndex: 0};
  }

  render() {
    const {labels, handleClick, className=''} = this.props;
    const {selectedIndex} = this.state;

    const buttons = labels.map((label, i) => {
      const buttonClass = classnames({
        'widget-buttons-pressed': i === selectedIndex,
        'pure-button': true
      });

      const buttonClick = () => {
        this.setState({selectedIndex: i});
        if (typeof handleClick !== 'undefined') {
          handleClick(i, label);
        }
      };

      return (
        <button className={buttonClass} onClick={buttonClick} key={i}>
          {label}
        </button>
      );
    });

    return <div className={className}>{buttons}</div>;
  }
}

PushButtons.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  handleClick: PropTypes.func.isRequired,
  className: PropTypes.any
};

export default PushButtons;
