import React, { FunctionComponent, useState, useEffect, memo } from "react";
import Brand from "./brand";
import TabListButton from "./tablistbutton";
import CreateForm from "./createform";
import ImportForm from "./importform";
import { Tab } from "../types";
import useScrollIndicator from "../hooks/scrollindicator";
import { resetMainContentScrollPosition } from "../redux/actioncreators";

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

  const [isScrolled, scrollContainerRef] = useScrollIndicator();

  useEffect(() => {
    if (props.visible) {
      setHideImportForm(true);
    }
  }, [props.visible]);

  const handleTabClick = (tabId: string) => {
    resetMainContentScrollPosition();
    props.onTabClick(tabId);
  };

  const handleShowImportFormClick = () => {
    setHideImportForm(false);
  };

  return (
    <div className="scene tabsScene">
      <div className={`header header-brand${isScrolled ? " elevated" : ""}`}>
        <Brand />
      </div>
      <div className="content content-with-footer" ref={scrollContainerRef}>
        <main>
          {props.data.length ? (
            <div className="row tabs">
              {props.data.map((tab) => {
                return (
                  <TabListButton
                    key={tab.id}
                    data={tab}
                    onClick={handleTabClick}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-info">
              <p>
                Track shared expenses in a group of people. You can create
                groups for projects or topics like "Summer roadtrip" or
                "Badminton".
              </p>
              <p>Start by creating your first group:</p>
            </div>
          )}
          <div className="form-row">
            <CreateForm
              tabName={props.createTabInputValue}
              onTabNameChange={props.onCreateTabInputChange}
              onSubmit={props.onCreateNewTab}
            />
          </div>
          <div className="form-row">
            {hideImportForm ? (
              <p className="fake-link" onClick={handleShowImportFormClick}>
                Import group
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
          Version: {process.env.REACT_APP_GT_VERSION || "N/A"} –{" "}
          {/* eslint-disable react/jsx-no-target-blank */}
          <a href="https://grouptabs.net/" target="_blank" rel="noopener">
            {/* eslint-enable react/jsx-no-target-blank */}
            grouptabs.net
          </a>
        </footer>
      </div>
    </div>
  );
};

export default memo(Tabs);
