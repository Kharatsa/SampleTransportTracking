import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
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

export const DateFilters = React.createClass({
  propTypes: {
    afterDateFilter: PropTypes.instanceOf(Moment).isRequired,
    beforeDateFilter: PropTypes.instanceOf(Moment).isRequired,
    actions: PropTypes.object.isRequired
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  selectAfterDate(afterDateInput) {
    const {changeSummaryFilter} = this.props.actions;
    const {afterDateFilter, beforeDateFilter} = this.props;

    if (afterDateInput !== afterDateFilter) {
      const nextBeforeDate = calcBeforeDate(afterDateInput, beforeDateFilter);
      return changeSummaryFilter(
        {afterDate: afterDateInput, beforeDate: nextBeforeDate});
    }
  },

  selectBeforeDate(beforeDateInput) {
    const {changeSummaryFilter} = this.props.actions;
    const {afterDateFilter, beforeDateFilter} = this.props;

    if (beforeDateInput !== beforeDateFilter) {
      const nextAfterDate = calcAfterDate(beforeDateInput, afterDateFilter);
      return changeSummaryFilter(
        {afterDate: nextAfterDate, beforeDate: beforeDateInput});
    }
  },

  render() {
    const {afterDateFilter, beforeDateFilter} = this.props;

    return (
      <form className='pure-form'>
        <label htmlFor='regionFilter'>After Date</label>
        <DatePicker
            selected={afterDateFilter}
            maxDate={Moment().subtract(1, 'day')}
            onChange={this.selectAfterDate}
            className='pure-menu-input'
        />

        <label htmlFor='regionFilter'>Before Date</label>
        <DatePicker
            selected={beforeDateFilter}
            maxDate={Moment()}
            onChange={this.selectBeforeDate}
            className='pure-menu-input'
        />
      </form>);
  }
});

export default DateFilters;
