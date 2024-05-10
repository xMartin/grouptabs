import { FunctionComponent, memo } from "react";
import Loader from "./loader";
import Summary from "./summary";
import TransactionList from "./transactionlist";
import TotalSpending from "./totalspending";
import LoadError from "./loaderror";
import { Account, Transaction, Info } from "../types";
import useScrollIndicator from "../hooks/scrollindicator";
import SyncStatus from "./syncstatus";

interface Props {
  tabInfo?: Info;
  lastSyncedSuccessfully?: string | null;
  syncError?: boolean;
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

  const isLoading = props.checkingRemoteTab || props.importingTab;

  const handleNewEntryClick = () => {
    if (!props.tabId) {
      throw new Error("Group ID missing.");
    }
    props.onNavigateToAddTransaction(props.tabId);
  };

  const renderHeader = () => (
    <div className="header-container">
      <div className={`header header-app${isScrolled ? " elevated" : ""}`}>
        <button
          className="left"
          aria-label="menu"
          onClick={props.onChangeTabClick}
        >
          <svg height="16" width="16">
            <path d="m2 2c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12zm0 5c-0.554 0-1 0.446-1 1s0.446 1 1 1h12c0.554 0 1-0.446 1-1s-0.446-1-1-1h-12z" />
          </svg>
        </button>
        <h2>{props.tabInfo?.name || ""}</h2>
        <div className="header-slot-sync-status">
          <SyncStatus
            lastSyncedSuccessfully={props.lastSyncedSuccessfully}
            syncError={props.syncError}
          />
        </div>
        <button
          aria-label="Add payment"
          className="create"
          disabled={isLoading || !!props.remoteTabError}
          onClick={handleNewEntryClick}
        >
          <svg width="16" height="16">
            <g>
              <path d="M8 0C8.55228 0 9 0.447715 9 1L9 15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15L7 1C7 0.447715 7.44772 0 8 0Z" />
              <path d="M16 8C16 8.55228 15.5523 9 15 9L1 9C0.447715 9 3.91405e-08 8.55228 8.74228e-08 8C1.35705e-07 7.44771 0.447715 7 1 7L15 7C15.5523 7 16 7.44772 16 8Z" />
            </g>
          </svg>
        </button>
      </div>
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

  return (
    <div className="scene mainScene">
      {renderHeader()}
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
