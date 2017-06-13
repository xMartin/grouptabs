define([
  'react',
  'create-react-class',
  './loader',
  './overview'
],

function (React, createReactClass, Loader, Overview) {
  'use strict';

  var el = React.createElement;
  var PropTypes = React.PropTypes;

  return createReactClass({

    displayName: 'Main',

    propTypes: {
      tabName: PropTypes.string,
      tabId: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      visible: PropTypes.bool,
      importingTab: PropTypes.bool,
      handleChangeTabClick: PropTypes.func.isRequired,
      handleNewEntryClick: PropTypes.func.isRequired,
      handleListClick: PropTypes.func.isRequired
    },

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
          el(Loader, {show: this.props.importingTab},
            (
              this.props.data.length === 0
              ?
              el('div', { className: 'empty-info'},
                el('p', null,
                  'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
                ),
                el('p', null,
                  'Start by adding your first transaction:'
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
        )
      );
    }

  });

});
