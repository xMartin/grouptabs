import React, { PureComponent, SyntheticEvent } from 'react';
import dateUtils from '../util/date';

var el = React.createElement;

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
      el('div', {className: 'form-row-input date-input'},
        el('button', {
          type: 'button',
          className: dateUtils.isToday(date) ? 'selected' : '',
          onClick: this.handleTodayClick
        }, 'today'),
        el('button', {
          type: 'button',
          className: dateUtils.isYesterday(date) ? 'selected' : '',
          onClick: this.handleYesterdayClick
        }, 'yesterday'),
        el('input', {
          type: 'date',
          value: date,
          onChange: this.handleDateChange
        })
      )
    );
  }

}
