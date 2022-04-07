import React, { Component } from "react";
import Tabs from "./tabs";
import Main from "./main";
import EditEntry from "./editentry";
import ErrorView from "./error";
import { PropsFromRedux } from "../app";
import {
  ROUTE_NEW_TRANSACTION,
  ROUTE_TAB,
  ROUTE_TABS,
  ROUTE_TRANSACTION,
} from "../redux/actioncreators";

const titleBase = "Grouptabs";

function setTitle(input?: string) {
  const documentTitle = document.title;
  const result = input ? input + " – " + titleBase : titleBase;

  if (result !== documentTitle) {
    document.title = result;
  }
}

function getSceneIndex(routeName: string) {
  switch (routeName) {
    case ROUTE_TAB:
      return 2;
    case ROUTE_TRANSACTION:
    case ROUTE_NEW_TRANSACTION:
      return 3;
    default:
      return 1;
  }
}

interface Props extends PropsFromRedux {}

export default class App extends Component<Props> {
  componentDidCatch(error: any, info: any) {
    this.props.onError(error, info);
  }

  componentDidUpdate(prevProps: Props) {
    this.setPageTitle();
  }

  setPageTitle() {
    const tabName = this.props.tabInfo?.name || "";

    switch (this.props.location.type) {
      case ROUTE_TAB:
        setTitle(tabName);
        break;
      case ROUTE_NEW_TRANSACTION:
        setTitle(tabName ? "New transaction (" + tabName + ")" : "");
        break;
      case ROUTE_TRANSACTION:
        const transaction = this.props.transaction;
        setTitle(
          transaction ? transaction.description + " (" + tabName + ")" : ""
        );
        break;
      default:
        setTitle();
    }
  }

  private getShowEditEntry() {
    const location = this.props.location;
    const locationIsOrWasTransaction =
      location.type === ROUTE_NEW_TRANSACTION ||
      location.type === ROUTE_TRANSACTION ||
      location.prev?.type === ROUTE_NEW_TRANSACTION ||
      location.prev?.type === ROUTE_TRANSACTION;
    return !!this.props.initialLoadingDone && locationIsOrWasTransaction;
  }

  private getEditEntryMode() {
    const location = this.props.location;
    return location.type === ROUTE_NEW_TRANSACTION ||
      location.prev?.type === ROUTE_NEW_TRANSACTION
      ? "new"
      : "edit";
  }

  render() {
    if (this.props.error) {
      return (
        <div className="scenes">
          <ErrorView error={this.props.error} />
        </div>
      );
    }

    return (
      <React.StrictMode>
        <div className="scenes">
          <div
            className={`scenes-container scenes-container-active-${getSceneIndex(
              this.props.location.type
            )}`}
          >
            <Tabs
              data={this.props.tabs}
              visible={this.props.currentLocation === ROUTE_TABS}
              checkingRemoteTab={this.props.checkingRemoteTab}
              remoteTabError={this.props.remoteTabError}
              createTabInputValue={this.props.createTabInputValue}
              importTabInputValue={this.props.importTabInputValue}
              onTabClick={this.props.onSelectTab}
              onCreateTabInputChange={this.props.onCreateTabInputChange}
              onCreateNewTab={this.props.onCreateTab}
              onImportTabInputChange={this.props.onImportTabInputChange}
              onImportTab={this.props.onImportTab}
            />
            <Main
              tabInfo={this.props.tabInfo}
              tabId={this.props.location.payload.tabId}
              accounts={this.props.accounts}
              transactions={this.props.transactions}
              total={this.props.total}
              visible={this.props.currentLocation === ROUTE_TAB}
              checkingRemoteTab={this.props.checkingRemoteTab}
              remoteTabError={this.props.remoteTabError}
              importingTab={this.props.importingTab}
              onChangeTabClick={this.props.onNavigateToTabs}
              onNavigateToAddTransaction={this.props.onNavigateToAddTransaction}
              onDetailsClick={this.props.onNavigateToUpdateTransaction}
            />
            <div className="scene editEntryScene">
              {this.getShowEditEntry() && (
                <EditEntry
                  visible={
                    this.props.currentLocation === ROUTE_TRANSACTION ||
                    this.props.currentLocation === ROUTE_NEW_TRANSACTION
                  }
                  mode={this.getEditEntryMode()}
                  formState={this.props.transactionFormState}
                  checkingRemoteTab={this.props.checkingRemoteTab}
                  remoteTabError={this.props.remoteTabError}
                  importingTab={this.props.importingTab}
                  onChangeTabClick={this.props.onNavigateToTabs}
                  onCloseClick={this.props.onCloseTransaction}
                  onSave={this.props.onAddOrUpdateTransaction}
                  onDelete={this.props.onRemoveTransaction}
                  onUpdateForm={this.props.onUpdateTransactionForm}
                  onUpdateSharedForm={this.props.onUpdateTransactionSharedForm}
                  onUpdateDirectForm={this.props.onUpdateTransactionDirectForm}
                  onUpdateParticipant={
                    this.props.onUpdateTransactionParticipant
                  }
                  onAddParticipant={this.props.onAddParticipant}
                  onSetAllJoined={this.props.onSetAllJoined}
                />
              )}
            </div>
          </div>
        </div>
      </React.StrictMode>
    );
  }
}
