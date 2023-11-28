import { FunctionComponent, memo } from "react";
import Loader from "./loader";
import Summary from "./summary";
import TransactionList from "./transactionlist";
import TotalSpending from "./totalspending";
import LoadError from "./loaderror";
import { Account, Transaction, Info } from "../types";
import useScrollIndicator from "../hooks/scrollindicator";

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

const Main: FunctionComponent<Props> = (props) => {
  const [isScrolled, scrollContainerRef] = useScrollIndicator();

  const handleNewEntryClick = () => {
    if (!props.tabId) {
      throw new Error("Group ID missing.");
    }
    props.onNavigateToAddTransaction(props.tabId);
  };

  const renderHeader = (showAddButton?: boolean) => (
    <div className={`header header-app${isScrolled ? " elevated" : ""}`}>
      <button className="left" onClick={props.onChangeTabClick}>
        <svg height="16" width="16">
          <path d="m2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z" />
        </svg>
      </button>
      <h2>{props.tabInfo?.name || ""}</h2>
      {showAddButton && (
        <button className="create" onClick={handleNewEntryClick}>
          +
        </button>
      )}
    </div>
  );

  const renderSummary = () => (
    <>
      <div className="row">
        <Summary accounts={props.accounts} />
      </div>
      <div className="row">
        <TransactionList
          transactions={props.transactions}
          onDetailsClick={props.onDetailsClick}
        />
        <TotalSpending amount={props.total} />
      </div>
      {renderShareInfo()}
    </>
  );

  const renderEmptyState = () => (
    <>
      <div className="empty-info">
        <p>
          A group consists of payments. When you add a payment you also define
          the people that are part of it, the participants.
        </p>
        <p>Start by adding your first payment:</p>
        <div className="row">
          <button className="full-width create" onClick={handleNewEntryClick}>
            Add payment
          </button>
        </div>
      </div>
      {renderShareInfo()}
    </>
  );

  const renderShareInfo = () => (
    <div className="share-info">
      <p>
        Share this group ID for collaboration with others:
        <br />
        <code>{props.tabInfo?.tabId || props.tabId}</code>
      </p>
    </div>
  );

  const renderContent = () => {
    if (!props.tabInfo) {
      return (
        <LoadError message="Error: Group data missing. Are you offline? Try refreshing." />
      );
    }

    if (props.remoteTabError) {
      return (
        <LoadError
          message={props.remoteTabError}
          onOkClick={props.onChangeTabClick}
        />
      );
    }

    if (props.accounts.length === 0) {
      return renderEmptyState();
    }

    return renderSummary();
  };

  const isLoading = props.checkingRemoteTab || props.importingTab;

  return (
    <div className="scene mainScene">
      {renderHeader(!isLoading && !props.remoteTabError)}
      <div
        id="main-content"
        className="content"
        ref={scrollContainerRef}
        style={{ position: "relative" }}
      >
        <Loader show={isLoading}>{renderContent()}</Loader>
      </div>
    </div>
  );
};

export default memo(Main);
