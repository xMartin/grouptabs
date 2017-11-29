define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  './transactionlist'
],

function (React, createReactClass, PureRenderMixin, PropTypes, TransactionList) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'List',

    propTypes: {
      tabId: PropTypes.string,
      tabName: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      visible: PropTypes.bool,
      handleChangeTabClick: PropTypes.func.isRequired,
      handleNewEntryClick: PropTypes.func.isRequired,
      handlePeopleClick: PropTypes.func.isRequired,
      handleDetailsClick: PropTypes.func.isRequired
    },

    render: function () {
      return (
        el('div', {className: 'scene listScene' + (this.props.visible ? '' : ' hidden')},
          el('div', {className: 'header'},
            el('button', {className: 'left', onClick: this.props.handleChangeTabClick},
              el('svg', {height: 16, width: 16},
                el('path', {d: 'm2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z'})
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
