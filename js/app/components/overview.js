define([
  'react',
  './summary'
],

function (React, Summary) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'Overview',

    render: function () {
      return (
        el('div', null,
          el('div', {className: 'row toggle'},
            el('button', {className: 'tab active', disabled: 'disabled'}, 'People'),
            el('button', {className: 'tab', onClick: this.props.handleListClick}, 'Transactions')
          ),
          el('div', {className: 'row'},
            el(Summary, {data: this.props.data})
          )
        )
      );
    }

  });

});
