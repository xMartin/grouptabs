define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    formatDate: function (date) {
      date = date || new Date();
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      return '' + date.getFullYear() + '-' + month + '-' + day;
    },

    render: function () {
      var participants = this.props.accounts.map(function (participant) {
        return React.createElement('div', null, participant);
      });

      return (
        React.createElement('form', {onSubmit: this.handleSubmit},
          React.createElement('div', {className: 'form'},
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {type: 'text', name: 'description', placeholder: 'Description', onChange: this.handleDateChange})
              ),
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {type: 'date', name: 'date', defaultValue: this.formatDate(new Date())})
              )
            ),
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                participants
              )
            ),
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('button', null, '+ new participant'),
                React.createElement('button', null, '✓ all joined')
              )
            )
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('button', {className: 'delete'}, 'Delete'),
            React.createElement('input', {type: 'submit', className: 'create full-width-margin', value: 'Save'})
          )
        )
      );
    },

    handleSubmit: function () {
      event.preventDefault();
    }

  });

});
