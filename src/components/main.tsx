import React, { PureComponent } from 'react';
// @ts-ignore
import SmoothScroll from 'smooth-scroll';
import Loader from './loader';
import Summary from './summary';
import TransactionList from './transactionlist';
import TotalSpending from './totalspending';
import LoadError from './loaderror';
import { Account, Transaction, Info } from '../types';

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

  private transactionsHeading: React.RefObject<HTMLHeadingElement>;

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
      <div className='header'>
        <button className='left' onClick={this.props.onChangeTabClick}>
          <svg height='16' width='16'>
            <path d='m2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z' />
          </svg>
        </button>
        <h2>{this.props.tabInfo?.name || ''}</h2>
        {
          showAddButton &&
          <button className='create' onClick={this.handleNewEntryClick}>+</button>
        }
      </div>
    );
  }

  renderSummary() {
    return (
      <React.Fragment>
        <div className='row'>
          <Summary accounts={this.props.accounts} />
        </div>
        <div className='row'>
          <h3 ref={this.transactionsHeading} className='transactions-heading'>Transactions</h3>
          {
            this.state.transactionsHeadingIsOutOfViewport &&
            <h3
              className='transactions-heading transactions-heading-fixed'
              onClick={this.handleTransitionsTeaserClick}
            >
              ▾ Transactions
            </h3>
          }
          <TransactionList transactions={this.props.transactions} onDetailsClick={this.props.onDetailsClick} />
          <TotalSpending amount={this.props.total} />
        </div>
        {this.renderShareInfo()}
      </React.Fragment>
    );
  }

  renderEmptyState() {
    return (
      <React.Fragment>
        <div className='empty-info'>
          <p>
            A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.
          </p>
          <p>
            Start by adding your first transaction:
          </p>
          <div className='row'>
            <button className='full-width create' onClick={this.handleNewEntryClick}>
              Add transaction
            </button>
          </div>
        </div>
        {this.renderShareInfo()}
      </React.Fragment>
    );
  }

  renderShareInfo() {
    return (
      <div className='share-info'>
        <p>
          Share this tab ID for collaboration with others:
          <br />
          <code>{this.props.tabId}</code>
        </p>
      </div>
    );
  }

  renderContent() {
    if (!this.props.tabInfo) {
      return <LoadError message='Error: Tab data missing. Are you offline? Try refreshing.' />;
    }

    if (this.props.remoteTabError) {
      return <LoadError message={this.props.remoteTabError} onOkClick={this.props.onChangeTabClick} />;
    }

    if (this.props.accounts.length === 0) {
      return this.renderEmptyState();
    }

    return this.renderSummary();
  }

  render() {
    var isLoading = this.props.checkingRemoteTab || this.props.importingTab;

    return (
      <div className={'scene mainScene' + (this.props.visible ? '' : ' hidden')}>
        {this.renderHeader(!isLoading && !this.props.remoteTabError)}
        <Loader show={isLoading}>
          {this.renderContent()}
        </Loader>
      </div>
    );
  }

}
