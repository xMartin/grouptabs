import React, { PureComponent, SyntheticEvent } from 'react';
import dateUtils from '../util/date';

interface Props {
  date: string;
  onChange: (date: string) => void;
}

export default class DateInput extends PureComponent<Props> {

  handleTodayClick = () => {
    this.props.onChange(dateUtils.formatDate(new Date()));
  }

  handleYesterdayClick = () => {
    var yesterday = dateUtils.addDays(new Date(), -1);
    this.props.onChange(dateUtils.formatDate(yesterday));
  }

  handleDateChange = (event: SyntheticEvent<HTMLInputElement>) => {
    var value = event.currentTarget.value;
    this.props.onChange(value);
  }

  render() {
    const { date } = this.props;

    return (
      <div className='form-row-input date-input'>
        <button
          type='button'
          className={dateUtils.isToday(date) ? 'selected' : ''}
          onClick={this.handleTodayClick}
        >
          today
        </button>
        <button
          type='button'
          className={dateUtils.isYesterday(date) ? 'selected' : ''}
          onClick={this.handleYesterdayClick}
        >
          yesterday
        </button>
        <input
          type='date'
          value={date}
          onChange={this.handleDateChange}
        />
      </div>
    );
  }

}
