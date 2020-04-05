import React, { PureComponent } from 'react';
// @ts-ignore
import SmoothScroll from 'smooth-scroll';
import Loader from './loader';
import Summary from './summary';
import TransactionList from './transactionlist';
import TotalSpending from './totalspending';
import LoadError from './loaderror';
import { Account, Transaction, Info } from '../types';

var el = React.createElement;

interface Props {
  tabInfo?: Info;
  tabId?: string;
  accounts: Account[];
  transactions: Transaction[];
  total: number;
  visible?: boolean;
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  importingTab?: boolean;
  onChangeTabClick: () => void;
  onNavigateToAddTransaction: (tabId: string) => void;
  onDetailsClick: (tabId: string, transactionId: string) => void;
}

interface State {
  transactionsHeadingIsOutOfViewport: boolean;
}

export default class Main extends PureComponent<Props, State> {

  private transactionsHeading: React.RefObject<HTMLElement>;

  scroller?: any;

  constructor(props: Props) {
    super(props);

    this.transactionsHeading = React.createRef();

    this.state = {
      transactionsHeadingIsOutOfViewport: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.checkTransactionsHeadingVisibility);
    window.addEventListener('resize', this.checkTransactionsHeadingVisibility);
    this.checkTransactionsHeadingVisibility();
    this.scroller = new SmoothScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkTransactionsHeadingVisibility);
    window.removeEventListener('resize', this.checkTransactionsHeadingVisibility);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.accounts !== this.props.accounts) {
      setTimeout(this.checkTransactionsHeadingVisibility);
    }
  }

  checkTransactionsHeadingVisibility = () => {
    if (!this.transactionsHeading.current) {
      return;
    }

    var scrollBottomY = window.innerHeight + window.scrollY;
    // @ts-ignore
    var headingY = this.transactionsHeading.current.offsetTop;
    var transactionsHeadingIsOutOfViewport = scrollBottomY < headingY + 60;
    if (transactionsHeadingIsOutOfViewport !== this.state.transactionsHeadingIsOutOfViewport) {
      this.setState({
        transactionsHeadingIsOutOfViewport: transactionsHeadingIsOutOfViewport
      });
    }
  }

  handleNewEntryClick = () => {
    if (!this.props.tabId) {
      throw new Error('Tab ID missing.');
    }
    this.props.onNavigateToAddTransaction(this.props.tabId);
  };

  handleTransitionsTeaserClick = () => {
    this.scroller.animateScroll(this.transactionsHeading.current);
  };

  renderHeader(showAddButton?: boolean) {
    return (
      el('div', {className: 'header'},
        el('button', {className: 'left', onClick: this.props.onChangeTabClick},
          el('svg', {height: 16, width: 16},
            el('path', {d: 'm2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z'})
          )
        ),
        el('h2', null, this.props.tabInfo?.name || ''),
        (
          showAddButton &&
          el('button', {className: 'create', onClick: this.handleNewEntryClick},
            '+'
          )
        )
      )
    );
  }

  renderSummary() {
    return (
      el(React.Fragment, null,
        el('div', {className: 'row'},
          el(Summary, {accounts: this.props.accounts})
        ),
        el('div', {className: 'row'},
          el('h3', {ref: this.transactionsHeading, className: 'transactions-heading'}, 'Transactions'),
          (
            this.state.transactionsHeadingIsOutOfViewport &&
            el('h3', {
              className: 'transactions-heading transactions-heading-fixed',
              onClick: this.handleTransitionsTeaserClick
            },
              '▾ Transactions'
            )
          ),
          el(TransactionList, {transactions: this.props.transactions, onDetailsClick: this.props.onDetailsClick}),
          el(TotalSpending, {amount: this.props.total})
        ),
        this.renderShareInfo()
      )
    );
  }

  renderEmptyState() {
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
  }

  renderShareInfo() {
    return (
      el('div', {className: 'share-info'},
        el('p', null,
          'Share this tab ID for collaboration with others:',
          el('br'),
          el('code', null, this.props.tabId)
        )
      )
    );
  }

  renderContent() {
    if (!this.props.tabInfo) {
      return el(LoadError, {message: 'Error: Tab data missing. Are you offline? Try refreshing.'});
    }

    if (this.props.remoteTabError) {
      return el(LoadError, {message: this.props.remoteTabError, onOkClick: this.props.onChangeTabClick});
    }

    if (this.props.accounts.length === 0) {
      return this.renderEmptyState();
    }

    return this.renderSummary();
  }

  render() {
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

}
