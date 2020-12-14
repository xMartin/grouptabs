import { DocumentType, Transaction, TransactionType } from "../types";
import { getTabInfo, getTransactions } from "./selectors";

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

    const result = getTabInfo(state);

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

    const result = getTabInfo(state);

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

    const result = getTabInfo(state);

    expect(result).toBe(undefined);
  });
});

describe("getTransactions", () => {
  test("sorts and converts legacy direct transactions' transaction type to DIRECT", () => {
    const state: any = {
      location: {
        payload: {
          tabId: "TAB_ID",
        },
      },
      app: {
        tabs: ["TAB_ID"],
        docsById: {
          "1": {
            id: "1",
            type: DocumentType.TRANSACTION,
            tabId: "TAB_ID",
            transactionType: TransactionType.SHARED,
            date: "2020-08-02",
            participants: [
              {
                participant: "Simon",
                amount: 12,
              },
              {
                participant: "Jan",
                amount: 0,
              },
            ],
          } as Transaction,
          "2": {
            id: "2",
            type: DocumentType.TRANSACTION,
            tabId: "TAB_ID",
            transactionType: TransactionType.DIRECT,
            date: "2020-08-03",
            participants: [
              {
                participant: "Simon",
                amount: -12,
              },
              {
                participant: "Jan",
                amount: 12,
              },
            ],
          } as Transaction,
          "3": {
            id: "3",
            type: DocumentType.TRANSACTION,
            tabId: "TAB_ID",
            transactionType: TransactionType.SHARED,
            date: "2020-08-01",
            participants: [
              {
                participant: "Jan",
                amount: -12,
              },
              {
                participant: "Simon",
                amount: 12,
              },
            ],
          } as Transaction,
        },
        transactionsByTab: {
          TAB_ID: ["2", "3", "1"],
        },
      },
    };

    const result = getTransactions(state);

    expect(result[0].id).toBe("2");
    expect(result[0].transactionType).toBe(TransactionType.DIRECT);

    expect(result[1].id).toBe("1");
    expect(result[1].transactionType).toBe(TransactionType.SHARED);

    expect(result[2].id).toBe("3");
    expect(result[2].transactionType).toBe(TransactionType.DIRECT);
  });
});
