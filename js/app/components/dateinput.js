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
        date: this.formatDate(inputDate || new Date())
      };
    },

    formatDate: function (date) {
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      return '' + date.getFullYear() + '-' + month + '-' + day;
    },

    handleTodayClick: function () {
      this.setState({
        date: this.formatDate(new Date())
      });
    },

    handleYesterdayClick: function () {
      var yesterday = dateUtils.addDays(new Date(), -1);
      this.setState({
        date: this.formatDate(yesterday)
      });
    },

    handleDateChange: function (event) {
      var value = event.target.value;
      this.setState({
        date: value
      });
    },

    isToday: function () {
      return this.state.date === this.formatDate(new Date());
    },

    isYesterday: function () {
      var yesterday = dateUtils.addDays(new Date(), -1);
      return this.state.date === this.formatDate(yesterday);
    },

    getValue: function () {
      return this.state.date;
    },

    render: function () {
      return (
        el('div', {className: 'form-row-input date-input'},
          el('button', {
            type: 'button',
            className: this.isToday() ? 'selected' : '',
            onClick: this.handleTodayClick
          }, 'today'),
          el('button', {
            type: 'button',
            className: this.isYesterday() ? 'selected' : '',
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
