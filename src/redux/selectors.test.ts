import selectors from "./selectors";

describe("getTabInfo", () => {
  it("selects tab info", () => {
    const state: any = {
      location: {
        payload: {
          tabId: "TAB_ID",
        },
      },
      app: {
        tabs: ["TAB_ID", "XXX"],
        docsById: {
          "info-TAB_ID": {
            id: "info-TAB_ID",
            name: "TAB_NAME",
          },
          XXX: {
            id: "XXX",
          },
        },
        transactionsByTab: {},
      },
    };

    const result = selectors.getTabInfo(state);

    expect(result).toEqual({
      id: "info-TAB_ID",
      name: "TAB_NAME",
    });
  });

  it("returns undefined if no tab is currently active", () => {
    const state: any = {
      location: {
        payload: {},
      },
      app: {
        tabs: ["TAB_ID"],
        docsById: {
          "info-TAB_ID": {
            id: "info-TAB_ID",
            name: "TAB_NAME",
          },
        },
        transactionsByTab: {},
      },
    };

    const result = selectors.getTabInfo(state);

    expect(result).toBe(undefined);
  });

  it("returns undefined if tab info is missing", () => {
    const state: any = {
      location: {
        payload: {
          tabId: "TAB_ID",
        },
      },
      app: {
        tabs: ["TAB_ID"],
        docsById: {},
        transactionsByTab: {},
      },
    };

    const result = selectors.getTabInfo(state);

    expect(result).toBe(undefined);
  });
});
