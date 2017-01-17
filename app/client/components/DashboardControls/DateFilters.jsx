import React, {PropTypes} from 'react';
import DatePicker from 'react-datepicker';
import Moment from 'moment';

const calcAfterDate = (beforeDateInput, afterDate) => {
  const maxAfterDate = beforeDateInput.clone().subtract(1, 'day');
  return afterDate >= maxAfterDate ? maxAfterDate : afterDate;
};

const calcBeforeDate = (afterDateInput, beforeDate) => {
  const minBeforeDate = afterDateInput.clone().add(1, 'day');
  return beforeDate <= minBeforeDate ? minBeforeDate : beforeDate;
};

export class DateFilters extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  selectAfterDate(afterDateInput) {
    const {changeSummaryFilter} = this.props;
    const {afterDateFilter, beforeDateFilter} = this.props;

    if (afterDateInput !== afterDateFilter) {
      const nextBeforeDate = calcBeforeDate(afterDateInput, beforeDateFilter);
      return changeSummaryFilter(
        {afterDate: afterDateInput, beforeDate: nextBeforeDate});
    }
  }

  selectBeforeDate(beforeDateInput) {
    const {changeSummaryFilter} = this.props;
    const {afterDateFilter, beforeDateFilter} = this.props;

    if (beforeDateInput !== beforeDateFilter) {
      const nextAfterDate = calcAfterDate(beforeDateInput, afterDateFilter);
      return changeSummaryFilter(
        {afterDate: nextAfterDate, beforeDate: beforeDateInput});
    }
  }

  render() {
    const {afterDateFilter, beforeDateFilter} = this.props;

    return (
      <form className='pure-form'>
        <label htmlFor='regionFilter'>From</label>
        <DatePicker
            selected={afterDateFilter}
            maxDate={Moment().subtract(1, 'day')}
            onChange={this.selectAfterDate.bind(this)}
            className='pure-menu-input'
        />

        <label htmlFor='regionFilter'>To</label>
        <DatePicker
            selected={beforeDateFilter}
            maxDate={Moment()}
            onChange={this.selectBeforeDate.bind(this)}
            className='pure-menu-input'
        />
      </form>);
  }
}

DateFilters.propTypes = {
  afterDateFilter: PropTypes.instanceOf(Moment).isRequired,
  beforeDateFilter: PropTypes.instanceOf(Moment).isRequired,
  changeSummaryFilter: PropTypes.func.isRequired,
};

export default DateFilters;
