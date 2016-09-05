define([
  'react',
  './summary'
],

function (React, Summary) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    render: function () {
      return (
        el('div', {className: 'scene mainScene' + (this.props.visible ? '' : ' hidden')},
          el('div', {className: 'header'},
            el('button', {onClick: this.props.handleChangeTabClick},
              el('svg', {height: 15, width: 15, style: {opacity: 0.5}},
                el('path', {d: 'm0 0v3h15v-3h-15zm0 6v3h15v-3h-15zm0 6v3h15v-3h-15z'})
              )
            ),
            el('h2', null, this.props.tabName)
          ),
          el('div', {className: 'row'},
            el('button', {className: 'full-width-margin create', onClick: this.props.handleNewEntryClick},
              'Add transaction'
            )
          ),
          el('div', null,
            el('div', {className: 'row toggle'},
              el('button', {className: 'tab active', disabled: 'disabled'}, 'People'),
              el('button', {className: 'tab', onClick: this.props.handleListClick}, 'Transactions')
            ),
            el('div', {className: 'row'},
              el(Summary, {data: this.props.data})
            )
          )
        )
      );
    }

  });

});
