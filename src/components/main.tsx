import React, {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  memo,
  RefObject,
} from "react";
// @ts-ignore
import SmoothScroll from "smooth-scroll";
import Loader from "./loader";
import Summary from "./summary";
import TransactionList from "./transactionlist";
import TotalSpending from "./totalspending";
import LoadError from "./loaderror";
import { Account, Transaction, Info } from "../types";

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

const useTransactionHeadingScroller = (
  transactionsHeadingRef: RefObject<HTMLElement>,
  recheckDependencies: any[]
): {
  transactionsHeadingIsOutOfViewport: boolean;
  scrollToTransactionHeading: () => void;
} => {
  const [
    transactionsHeadingIsOutOfViewport,
    setTransactionsHeadingIsOutOfViewport,
  ] = useState(false);

  // this ref is needed as the state updates unreliably
  const transactionsHeadingIsOutOfViewportRef = useRef(false);

  const checkTransactionsHeadingVisibilityRef = useRef(() => {
    if (!transactionsHeadingRef.current) {
      return;
    }

    const scrollBottomY = window.innerHeight + window.scrollY;
    const headingY = transactionsHeadingRef.current.offsetTop;
    const newTransactionsHeadingIsOutOfViewport = scrollBottomY < headingY + 60;
    if (
      newTransactionsHeadingIsOutOfViewport !==
      transactionsHeadingIsOutOfViewportRef.current
    ) {
      transactionsHeadingIsOutOfViewportRef.current = newTransactionsHeadingIsOutOfViewport;
      setTransactionsHeadingIsOutOfViewport(
        newTransactionsHeadingIsOutOfViewport
      );
    }
  });

  const scroller = useRef<any>(new SmoothScroll());

  useEffect(() => {
    const handler = checkTransactionsHeadingVisibilityRef.current;
    window.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    handler();

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  useEffect(() => {
    setTimeout(checkTransactionsHeadingVisibilityRef.current);
  }, recheckDependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    transactionsHeadingIsOutOfViewport,
    scrollToTransactionHeading: () => {
      scroller.current.animateScroll(transactionsHeadingRef.current);
    },
  };
};

const Main: FunctionComponent<Props> = (props) => {
  const transactionsHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    transactionsHeadingIsOutOfViewport,
    scrollToTransactionHeading,
  } = useTransactionHeadingScroller(transactionsHeadingRef, [props.accounts]);

  const handleNewEntryClick = () => {
    if (!props.tabId) {
      throw new Error("Tab ID missing.");
    }
    props.onNavigateToAddTransaction(props.tabId);
  };

  const renderHeader = (showAddButton?: boolean) => (
    <div className="header">
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
    <div className="content">
      <div className="row">
        <Summary accounts={props.accounts} />
      </div>
      <div className="row">
        <h3 ref={transactionsHeadingRef} className="transactions-heading">
          Transactions
        </h3>
        {transactionsHeadingIsOutOfViewport && (
          <h3
            className="transactions-heading transactions-heading-fixed"
            onClick={scrollToTransactionHeading}
          >
            ▾ Transactions
          </h3>
        )}
        <TransactionList
          transactions={props.transactions}
          onDetailsClick={props.onDetailsClick}
        />
        <TotalSpending amount={props.total} />
      </div>
      {renderShareInfo()}
    </div>
  );

  const renderEmptyState = () => (
    <React.Fragment>
      <div className="empty-info">
        <p>
          A tab consists of transactions. When you add a transaction you also
          define the people that are part of it, the participants.
        </p>
        <p>Start by adding your first transaction:</p>
        <div className="row">
          <button className="full-width create" onClick={handleNewEntryClick}>
            Add transaction
          </button>
        </div>
      </div>
      {renderShareInfo()}
    </React.Fragment>
  );

  const renderShareInfo = () => (
    <div className="share-info">
      <p>
        Share this tab ID for collaboration with others:
        <br />
        <code>{props.tabId}</code>
      </p>
    </div>
  );

  const renderContent = () => {
    if (!props.tabInfo) {
      return (
        <LoadError message="Error: Tab data missing. Are you offline? Try refreshing." />
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
    <div className={"scene mainScene" + (props.visible ? "" : " hidden")}>
      {renderHeader(!isLoading && !props.remoteTabError)}
      <Loader show={isLoading}>{renderContent()}</Loader>
    </div>
  );
};

export default memo(Main);
