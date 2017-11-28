define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  './loader',
  './summary',
  './transactionlist'
],

function (React, createReactClass, PureRenderMixin, PropTypes, Loader, Summary, TransactionList) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'Main',

    propTypes: {
      tabName: PropTypes.string,
      tabId: PropTypes.string,
      accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
      transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
      visible: PropTypes.bool,
      importingTab: PropTypes.bool,
      handleChangeTabClick: PropTypes.func.isRequired,
      handleNewEntryClick: PropTypes.func.isRequired,
      handleDetailsClick: PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        transactionsHeadingIsOutOfViewport: false
      };
    },

    componentDidMount: function () {
      window.addEventListener('scroll', this.checkTransactionsHeadingVisibility);
      this.checkTransactionsHeadingVisibility();
    },

    componentWillUnmount: function () {
      window.removeEventListener('scroll', this.checkTransactionsHeadingVisibility);
    },

    componentWillReceiveProps: function (nextProps) {
      if (nextProps.accounts !== this.props.accounts) {
        setTimeout(this.checkTransactionsHeadingVisibility);
      }
    },

    checkTransactionsHeadingVisibility: function () {
      if (!this.refs.transactionsHeading) {
        return;
      }

      var scrollBottomY = window.innerHeight + window.scrollY;
      var headingY = this.refs.transactionsHeading.offsetTop;
      var transactionsHeadingIsOutOfViewport = scrollBottomY < headingY + 60;
      if (transactionsHeadingIsOutOfViewport !== this.state.transactionsHeadingIsOutOfViewport) {
        this.setState({
          transactionsHeadingIsOutOfViewport: transactionsHeadingIsOutOfViewport
        });
      }
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
            el('h2', null, this.props.tabName),
            el('button', {className: 'create', onClick: this.props.handleNewEntryClick},
              '+'
            )
          ),
          el(Loader, {show: this.props.importingTab},
            (
              this.props.accounts.length === 0
              ?
              el('div', { className: 'empty-info'},
                el('p', null,
                  'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
                ),
                el('p', null,
                  'Start by adding your first transaction:'
                ),
                el('div', {className: 'row'},
                  el('button', {className: 'full-width-margin create', onClick: this.props.handleNewEntryClick},
                    'Add transaction'
                  )
                )
              )
              :
              null
            ),
            (
              this.props.accounts.length
              ?
              el('div', {className: 'row'},
                el(Summary, {data: this.props.accounts})
              )
              :
              null
            ),
            (
              this.props.transactions.length
              ?
              el('div', {className: 'row'},
                el('h3', {ref: 'transactionsHeading', className: 'transactions-heading', id: 'transactions-heading'}, 'Transactions'),
                (
                  this.state.transactionsHeadingIsOutOfViewport
                  ?
                  el('h3', {className: 'transactions-heading transactions-heading-fixed'},
                    el('a', {href: '#transactions-heading'}, '▼ Transactions')
                  )
                  :
                  null
                ),
                el(TransactionList, {data: this.props.transactions, handleDetailsClick: this.props.handleDetailsClick})
              )
              :
              null
            ),
            (
              this.props.accounts.length
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
