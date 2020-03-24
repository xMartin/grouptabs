import React, { PureComponent, SyntheticEvent, ReactFragment } from 'react';
import dateUtils from '../util/date';

var el = React.createElement;

interface Props {
  date?: string;
}

interface State {
  date: string;
}

export default class DateInput extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    var inputDate = this.props.date && dateUtils.parseDate(this.props.date);
    this.state = {
      date: dateUtils.formatDate(inputDate || new Date())
    };
  }

  handleTodayClick() {
    this.setState({
      date: dateUtils.formatDate(new Date())
    });
  }

  handleYesterdayClick() {
    var yesterday = dateUtils.addDays(new Date(), -1);
    this.setState({
      date: dateUtils.formatDate(yesterday)
    });
  }

  handleDateChange(event: SyntheticEvent<HTMLInputElement>) {
    var value = event.currentTarget.value;
    this.setState({
      date: value
    });
  }

  getValue() {
    return this.state.date;
  }

  render(): ReactFragment {
    return (
      el('div', {className: 'form-row-input date-input'},
        el('button', {
          type: 'button',
          className: dateUtils.isToday(this.state.date) ? 'selected' : '',
          onClick: this.handleTodayClick
        }, 'today'),
        el('button', {
          type: 'button',
          className: dateUtils.isYesterday(this.state.date) ? 'selected' : '',
          onClick: this.handleYesterdayClick
        }, 'yesterday'),
        el('input', {
          type: 'date',
          value: this.state.date,
          onChange: this.handleDateChange
        })
      )
    );
  }

}
