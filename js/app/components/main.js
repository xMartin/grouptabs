define([
  'react',
  './overview'
],

function (React, Overview) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'Main',

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
          (
            this.props.data.length === 0
            ?
            el('div', { className: 'empty-info'},
              el('p', null,
                'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
              ),
              el('p', null,
                'You have no transactions, yet. Start by adding one:'
              )
            )
            :
            null
          ),
          el('div', {className: 'row'},
            el('button', {className: 'full-width-margin create', onClick: this.props.handleNewEntryClick},
              'Add transaction'
            )
          ),
          (
            this.props.data.length
            ?
            el(Overview, {data: this.props.data, handleListClick: this.props.handleListClick})
            :
            null
          ),
          (
            this.props.data.length
            ?
            el('div', {className: 'share-info'},
              el('p', null,
                'Share this tab ID for collaboration with others:',
                el('br'),
                el('code', null, this.props.tabId)
              )
            )
            :
            null
          )
        )
      );
    }

  });

});
