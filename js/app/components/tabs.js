define([
  'react',
  './tablistbutton'
],

function (React, TabListButtonClass) {
  'use strict';

  var TabListButton = React.createFactory(TabListButtonClass);

  return React.createClass({

    render: function () {
      return (
        React.createElement('div', {className: 'scene tabsScene' + (this.props.visible ? '' : ' hidden')},
          React.createElement('div', {className: 'header'},
            React.createElement('img', {id: 'logo', src: 'images/favicon-touch.png'}),
            React.createElement('h2', null, 'Grouptabs')
          ),
          React.createElement('div', {className: 'row tabs'},
            this.props.data.map(function (tab) {
              return new TabListButton({key: tab, name: tab, onClick: this.props.handleTabClick})
            }.bind(this))
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('form', {onSubmit: this.handleSubmit},
              React.createElement('input', {type: 'text', className: 'full-width', placeholder: 'New tab …', ref: 'input'}),
              React.createElement('button', {className: 'create'}, 'Create')
            )
          )
        )
      );
    },

    handleSubmit: function (event) {
      event.preventDefault();
      var input = this.refs.input.getDOMNode();
      var tab = input.value.trim();
      input.value = '';
      tab && this.props.handleTabClick(tab);
    }

  });

});
