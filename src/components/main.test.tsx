import renderer from "react-test-renderer";
import Main from "./main";
import { DocumentType, TransactionType } from "../types";

it("renders empty view with no tab selected", () => {
  const tree = renderer
    .create(
      <Main
        accounts={[]}
        transactions={[]}
        total={0}
        onChangeTabClick={vi.fn()}
        onNavigateToAddTransaction={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders tab with no transactions", () => {
  const tree = renderer
    .create(
      <Main
        tabId="6"
        tabInfo={{
          id: "info-6",
          type: DocumentType.INFO,
          tabId: "6",
          name: "My Tab",
        }}
        accounts={[]}
        transactions={[]}
        total={0}
        onChangeTabClick={vi.fn()}
        onNavigateToAddTransaction={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders summary and transaction list", () => {
  const tree = renderer
    .create(
      <Main
        tabId="2"
        tabInfo={{
          id: "info-2",
          type: DocumentType.INFO,
          tabId: "2",
          name: "My Tab",
        }}
        accounts={[
          {
            participant: "Jan",
            amount: -11.7,
          },
          {
            participant: "Martin",
            amount: 11.7,
          },
        ]}
        transactions={[
          {
            id: "T4",
            tabId: "2",
            type: DocumentType.TRANSACTION,
            transactionType: TransactionType.SHARED,
            timestamp: "2020-09-19T23:59:59.999Z",
            date: "2020-09-20",
            description: "Gummibärchen",
            participants: [
              {
                participant: "Martin",
                amount: 22.8,
              },
              {
                participant: "Jan",
                amount: 0,
              },
            ],
          },
        ]}
        total={22.8}
        onChangeTabClick={vi.fn()}
        onNavigateToAddTransaction={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders missing tab info error", () => {
  const tree = renderer
    .create(
      <Main
        tabId="1"
        accounts={[]}
        transactions={[]}
        total={0}
        onChangeTabClick={vi.fn()}
        onNavigateToAddTransaction={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
