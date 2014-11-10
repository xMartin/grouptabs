define([
  'react',
  './summary'
],

function (React, SummaryClass) {
  'use strict';

  var Summary = React.createFactory(SummaryClass);

  return React.createClass({

    render: function () {
      return (
        React.createElement('div', {className: 'scene mainScene' + (this.props.visible ? '' : ' hidden')},
          React.createElement('div', {className: 'header'},
            React.createElement('button', null,
              React.createElement('svg', {height: 15, width: 15, style: {opacity: 0.5}},
                React.createElement('path', {d: 'm0 0v3h15v-3h-15zm0 6v3h15v-3h-15zm0 6v3h15v-3h-15z'})
              )
            ),
            React.createElement('h2', null, this.props.tabName)
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('button', {className: 'full-width-margin create', onClick: this.props.handleNewEntryClick},
              'Add transaction'
            )
          ),
          this.props.data.length ?
            React.createElement('div', null,
              React.createElement('div', {className: 'row toggle'},
                React.createElement('button', {disabled: 'disabled'}, 'People'),
                React.createElement('button', {onClick: this.props.handleListClick}, 'Transactions')
              ),
              React.createElement('div', {className: 'row'},
                Summary({data: this.props.data})
              )
            )
            :
            React.createElement('div', {className: 'empty-info'},
              React.createElement('article', null,
                React.createElement('p', null,
                  'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
                )
              )
            )
        )
      );
    }

  });

});
