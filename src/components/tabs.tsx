import React, { FunctionComponent, memo } from "react";
import TabListButton from "./tablistbutton";
import CreateForm from "./createform";
import ImportForm from "./importform";
import { Tab } from "../types";
import logo from "../images/grouptabs-logo.svg";
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
  const [isScrolled, scrollContainerRef] = useScrollIndicator();

  const handleTabClick = (tabId: string) => {
    resetMainContentScrollPosition();
    props.onTabClick(tabId);
  };

  return (
    <div className="scene tabsScene">
      <div className={`header${isScrolled ? " elevated" : ""}`}>
        <img id="logo" src={logo} alt="" />
        <h2>Grouptabs</h2>
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
                <strong>Track expenses in a group of people!</strong>
              </p>
              <p>
                Every group has a tab like "Summer roadtrip" or "Badminton team"
                – start by creating one!
              </p>
            </div>
          )}
          <div className={`row${!props.data.length ? " emptycontent" : ""}`}>
            <CreateForm
              tabName={props.createTabInputValue}
              onTabNameChange={props.onCreateTabInputChange}
              onSubmit={props.onCreateNewTab}
            />
          </div>
          <div className="row">
            <ImportForm
              checkingRemoteTab={props.checkingRemoteTab}
              remoteTabError={props.remoteTabError}
              tabId={props.importTabInputValue}
              onTabIdChange={props.onImportTabInputChange}
              onSubmit={props.onImportTab}
            />
          </div>
        </main>
        <footer>
          Version: {process.env.REACT_APP_GT_VERSION || "VERSION"} ·{" "}
          {/* eslint-disable react/jsx-no-target-blank */}
          <a href="https://grouptabs.net" target="_blank" rel="noopener">
            {/* eslint-enable react/jsx-no-target-blank */}
            grouptabs.net
          </a>
        </footer>
      </div>
    </div>
  );
};

export default memo(Tabs);
