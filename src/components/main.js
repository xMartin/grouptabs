import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types'; 
import SmoothScroll from 'smooth-scroll';
import Loader from './loader';
import Summary from './summary';
import TransactionList from './transactionlist';
import TotalSpending from './totalspending';
import LoadError from './loaderror';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'Main',

  propTypes: {
    tabName: PropTypes.string,
    tabId: PropTypes.string,
    accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired,
    visible: PropTypes.bool,
    checkingRemoteTab: PropTypes.bool,
    remoteTabError: PropTypes.string,
    importingTab: PropTypes.bool,
    onChangeTabClick: PropTypes.func.isRequired,
    onNavigateToAddTransaction: PropTypes.func.isRequired,
    onDetailsClick: PropTypes.func.isRequired
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

  componentDidUpdate: function (prevProps) {
    if (prevProps.accounts !== this.props.accounts) {
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

  handleTransitionsTeaserClick: function () {
    this.scroller.animateScroll(this.refs.transactionsHeading);
  },

  renderHeader: function (showAddButton) {
    return (
      el('div', {className: 'header'},
        el('button', {className: 'left', onClick: this.props.onChangeTabClick},
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

  renderSummary: function () {
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
              onClick: this.handleTransitionsTeaserClick
            },
              '▾ Transactions'
            )
          ),
          el(TransactionList, {data: this.props.transactions, onDetailsClick: this.props.onDetailsClick}),
          el(TotalSpending, {amount: this.props.total})
        ),
        this.renderShareInfo()
      )
    );
  },

  renderEmptyState: function () {
    return (
      el(React.Fragment, null,
        el('div', {className: 'empty-info'},
          el('p', null,
            'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
          ),
          el('p', null,
            'Start by adding your first transaction:'
          ),
          el('div', {className: 'row'},
            el('button', {className: 'full-width create', onClick: this.handleNewEntryClick},
              'Add transaction'
            )
          )
        ),
        this.renderShareInfo()
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
      return el(LoadError, {message: this.props.remoteTabError, onOkClick: this.props.onChangeTabClick});
    }

    if (this.props.accounts.length === 0) {
      return this.renderEmptyState();
    }

    return this.renderSummary();
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
