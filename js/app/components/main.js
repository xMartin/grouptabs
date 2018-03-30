define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  'smooth-scroll',
  './loader',
  './summary',
  './transactionlist',
  './importerror'
],

function (React, createReactClass, PureRenderMixin, PropTypes, SmoothScroll, Loader, Summary, TransactionList, ImportError) {
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
      checkingRemoteTab: PropTypes.bool,
      remoteTabError: PropTypes.string,
      importingTab: PropTypes.bool,
      handleChangeTabClick: PropTypes.func.isRequired,
      onNavigateToAddTransaction: PropTypes.func.isRequired,
      handleDetailsClick: PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        transactionsHeadingIsOutOfViewport: false
      };
    },

    componentDidMount: function () {
      window.addEventListener('scroll', this.checkTransactionsHeadingVisibility);
      window.addEventListener('resize', this.checkTransactionsHeadingVisibility);
      this.checkTransactionsHeadingVisibility();
      this.scroller = new SmoothScroll();
    },

    componentWillUnmount: function () {
      window.removeEventListener('scroll', this.checkTransactionsHeadingVisibility);
      window.removeEventListener('resize', this.checkTransactionsHeadingVisibility);
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

    handleNewEntryClick: function () {
      this.props.onNavigateToAddTransaction(this.props.tabId);
    },

    onTransitionsTeaserClick: function () {
      this.scroller.animateScroll(this.refs.transactionsHeading);
    },

    renderHeader: function (showAddButton) {
      return (
        el('div', {className: 'header'},
          el('button', {className: 'left', onClick: this.props.handleChangeTabClick},
            el('svg', {height: 16, width: 16},
              el('path', {d: 'm2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z'})
            )
          ),
          el('h2', null, this.props.tabName),
          (
            showAddButton &&
            el('button', {className: 'create', onClick: this.handleNewEntryClick},
              '+'
            )
          )
        )
      );
    },

    renderEmptyState: function () {
      return (
        el('div', { className: 'empty-info'},
          el('p', null,
            'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
          ),
          el('p', null,
            'Start by adding your first transaction:'
          ),
          el('div', {className: 'row'},
            el('button', {className: 'full-width-margin create', onClick: this.handleNewEntryClick},
              'Add transaction'
            )
          )
        )
      );
    },

    renderShareInfo: function () {
      return (
        el('div', {className: 'share-info'},
          el('p', null,
            'Share this tab ID for collaboration with others:',
            el('br'),
            el('code', null, this.props.tabId)
          )
        )
      );
    },

    renderContent: function () {
      if (this.props.remoteTabError) {
        return el(ImportError, {remoteTabError: this.props.remoteTabError, onOkClick: this.props.handleChangeTabClick});
      }

      if (this.props.accounts.length === 0) {
        return this.renderEmptyState();
      }

      return (
        el(React.Fragment, null,
          el('div', {className: 'row'},
            el(Summary, {data: this.props.accounts})
          ),
          el('div', {className: 'row'},
            el('h3', {ref: 'transactionsHeading', className: 'transactions-heading'}, 'Transactions'),
            (
              this.state.transactionsHeadingIsOutOfViewport &&
              el('h3', {
                className: 'transactions-heading transactions-heading-fixed',
                onClick: this.onTransitionsTeaserClick
              },
                '▾ Transactions'
              )
            ),
            el(TransactionList, {data: this.props.transactions, handleDetailsClick: this.props.handleDetailsClick})
          ),
          this.renderShareInfo()
        )
      );
    },

    render: function () {
      var isLoading = this.props.checkingRemoteTab || this.props.importingTab;

      return (
        el('div', {className: 'scene mainScene' + (this.props.visible ? '' : ' hidden')},
          this.renderHeader(!isLoading && !this.props.remoteTabError),
          el(Loader, {show: isLoading},
            this.renderContent()
          )
        )
      );
    }

  });

});
