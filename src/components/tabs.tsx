import React, { FunctionComponent, useState, useEffect, memo } from "react";
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

const Tabs: FunctionComponent<Props> = (props) => {
  const [hideImportForm, setHideImportForm] = useState(true);

  useEffect(() => {
    if (props.visible) {
      setHideImportForm(true);
    }
  }, [props.visible]);

  const handleShowImportFormClick = () => {
    setHideImportForm(false);
  };

  return (
    <div
      className={
        "scene scene-with-footer tabsScene" + (props.visible ? "" : " hidden")
      }
    >
      <main>
        <div className="header">
          <img id="logo" src={logo} alt="" />
          <h2>Grouptabs</h2>
        </div>
        {props.data.length ? (
          <div className="row tabs">
            {props.data.map((tab) => {
              return (
                <TabListButton
                  key={tab.id}
                  data={tab}
                  onClick={props.onTabClick}
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
            tabName={props.createTabInputValue}
            onTabNameChange={props.onCreateTabInputChange}
            onSubmit={props.onCreateNewTab}
          />
        </div>
        <div className="row">
          {hideImportForm ? (
            <p className="fake-link" onClick={handleShowImportFormClick}>
              Open shared tab
            </p>
          ) : (
            <ImportForm
              checkingRemoteTab={props.checkingRemoteTab}
              remoteTabError={props.remoteTabError}
              tabId={props.importTabInputValue}
              onTabIdChange={props.onImportTabInputChange}
              onSubmit={props.onImportTab}
            />
          )}
        </div>
      </main>
      <footer>
        Version: {process.env.REACT_APP_GT_VERSION || "VERSION"} –{" "}
        {/* eslint-disable react/jsx-no-target-blank */}
        <a href="https://grouptabs.net/" target="_blank" rel="noopener">
          {/* eslint-enable react/jsx-no-target-blank */}
          grouptabs.net
        </a>
      </footer>
    </div>
  );
};

export default memo(Tabs);
