import React, {PropTypes} from 'react';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import {shortFormatDate} from '../../util/stringformat';
import {routerPropTypes} from '../../util/proptypes';

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

  selectAfterDate(router, afterDateInput) {
    const {changeSummaryFilter} = this.props;
    const {afterDate, beforeDate} = this.props;

    if (afterDateInput !== afterDate) {
      const nextBeforeDate = calcBeforeDate(afterDateInput, beforeDate);
      router.pushWithQuery({
        query: {
          after: shortFormatDate(afterDateInput),
          before: shortFormatDate(nextBeforeDate),
        },
      });

      return changeSummaryFilter({
        afterDate: afterDateInput, beforeDate: nextBeforeDate,
      });
    }
  }

  selectBeforeDate(router, beforeDateInput) {
    const {changeSummaryFilter} = this.props;
    const {afterDate, beforeDate} = this.props;

    if (beforeDateInput !== beforeDate) {
      const nextAfterDate = calcAfterDate(beforeDateInput, afterDate);
      router.pushWithQuery({
        query: {
          after: shortFormatDate(nextAfterDate),
          before: shortFormatDate(beforeDateInput),
        },
      });

      return changeSummaryFilter({
        afterDate: nextAfterDate, beforeDate: beforeDateInput
      });
    }
  }

  render() {
    const {afterDate, beforeDate, router} = this.props;

    return (
      <form className='pure-form'>
        <label htmlFor='regionFilter'>From</label>
        <DatePicker
              selected={afterDate}
              maxDate={Moment().subtract(1, 'day')}
            onChange={this.selectAfterDate.bind(this, router)}
            className='pure-menu-input'
        />

        <label htmlFor='regionFilter'>To</label>
        <DatePicker
            selected={beforeDate}
            maxDate={Moment()}
            onChange={this.selectBeforeDate.bind(this, router)}
            className='pure-menu-input'
        />
      </form>);
  }
}

DateFilters.propTypes = {
  afterDate: PropTypes.instanceOf(Moment).isRequired,
  beforeDate: PropTypes.instanceOf(Moment).isRequired,
  changeSummaryFilter: PropTypes.func.isRequired,
  ...routerPropTypes,
};

export default DateFilters;
