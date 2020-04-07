import React, { PureComponent } from "react";
import TabListButton from "./tablistbutton";
import CreateForm from "./createform";
import ImportForm from "./importform";
import { Tab } from "../types";
import logo from "../images/logo.png";

interface Props {
  data: Tab[];
  visible?: boolean;
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  createTabInputValue?: string;
  importTabInputValue?: string;
  onTabClick: (id: string) => void;
  onCreateTabInputChange: (value: string) => void;
  onCreateNewTab: (name: string) => void;
  onImportTabInputChange: (value: string) => void;
  onImportTab: (id: string) => void;
}

interface State {
  hideImportForm: boolean;
}

export default class Tabs extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hideImportForm: true,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.visible && prevProps.visible) {
      this.setState({
        hideImportForm: true,
      });
    }
  }

  handleShowImportFormClick = () => {
    this.setState({
      hideImportForm: false,
    });
  };

  render() {
    return (
      <div
        className={
          "scene scene-with-footer tabsScene" +
          (this.props.visible ? "" : " hidden")
        }
      >
        <main>
          <div className="header">
            <img id="logo" src={logo} alt="" />
            <h2>Grouptabs</h2>
          </div>
          {this.props.data.length ? (
            <div className="row tabs">
              {this.props.data.map((tab) => {
                return (
                  <TabListButton
                    key={tab.id}
                    data={tab}
                    onClick={this.props.onTabClick}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-info">
              <p>
                Track shared expenses in a group of people. Every group has its
                own tab like "Summer roadtrip" or "Badminton".
              </p>
              <p>Start by creating your first tab:</p>
            </div>
          )}
          <div className="row">
            <CreateForm
              tabName={this.props.createTabInputValue}
              onTabNameChange={this.props.onCreateTabInputChange}
              onSubmit={this.props.onCreateNewTab}
            />
          </div>
          <div className="row">
            {this.state.hideImportForm ? (
              <p className="fake-link" onClick={this.handleShowImportFormClick}>
                Open shared tab
              </p>
            ) : (
              <ImportForm
                checkingRemoteTab={this.props.checkingRemoteTab}
                remoteTabError={this.props.remoteTabError}
                tabId={this.props.importTabInputValue}
                onTabIdChange={this.props.onImportTabInputChange}
                onSubmit={this.props.onImportTab}
              />
            )}
          </div>
        </main>
        <footer>
          {/* eslint-disable react/jsx-no-target-blank */}
          <a
            className="mini-link"
            href="https://grouptabs.net/"
            target="_blank"
            rel="noopener"
          >
            {/* eslint-enable react/jsx-no-target-blank */}
            More info about Grouptabs
          </a>
        </footer>
      </div>
    );
  }
}
