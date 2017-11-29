define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  './loader',
  './overview'
],

function (React, createReactClass, PureRenderMixin, PropTypes, Loader, Overview) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

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
            el('button', {className: 'left', onClick: this.props.handleChangeTabClick},
              el('svg', {height: 16, width: 16},
                el('path', {d: 'm2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z'})
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
