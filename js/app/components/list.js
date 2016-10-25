define([
  'react',
  './transactionlist'
],

function (React, TransactionList) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'List',

    getDefaultProps: function () {
      return {
        data: []
      };
    },

    render: function () {
      return (
        el('div', {className: 'scene listScene' + (this.props.visible ? '' : ' hidden')},
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
          el('div', {className: 'row toggle'},
            el('button', {className: 'tab', onClick: this.props.handlePeopleClick}, 'People'),
            el('button', {className: 'tab active', disabled: 'disabled'}, 'Transactions')
          ),
          el('div', {className: 'row'},
            el(TransactionList, {data: this.props.data, handleDetailsClick: this.props.handleDetailsClick})
          ),
          el('div', {className: 'share-info'},
            el('p', null,
              'Share this tab ID for collaboration with others:',
              el('br'),
              el('code', null, this.props.tabId)
            )
          )
        )
      );
    }

  });

});
