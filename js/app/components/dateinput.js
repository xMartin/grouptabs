define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  '../util/date'
],

function (React, createReactClass, PureRenderMixin, PropTypes, dateUtils) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'DateInput',

    propTypes: {
      date: PropTypes.string
    },

    getInitialState: function () {
      var inputDate = this.props.date && dateUtils.parseDate(this.props.date);
      return {
        date: dateUtils.formatDate(inputDate || new Date())
      };
    },

    handleTodayClick: function () {
      this.setState({
        date: dateUtils.formatDate(new Date())
      });
    },

    handleYesterdayClick: function () {
      var yesterday = dateUtils.addDays(new Date(), -1);
      this.setState({
        date: dateUtils.formatDate(yesterday)
      });
    },

    handleDateChange: function (event) {
      var value = event.target.value;
      this.setState({
        date: value
      });
    },

    getValue: function () {
      return this.state.date;
    },

    render: function () {
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

  });

});
