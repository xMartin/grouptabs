import { render, screen } from "@testing-library/react";
import App from "./app";

it("renders empty text", () => {
  const props: any = {
    location: {
      type: "",
      payload: {},
    },
    tabs: [],
    accounts: [],
    transactions: [],
    total: 0,
    onNavigateToTabs: vi.fn(),
    onCreateTabInputChange: vi.fn(),
    onCreateTab: vi.fn(),
    onImportTabInputChange: vi.fn(),
    onImportTab: vi.fn(),
    onSelectTab: vi.fn(),
    onNavigateToAddTransaction: vi.fn(),
    onNavigateToUpdateTransaction: vi.fn(),
    onCloseTransaction: vi.fn(),
    onAddOrUpdateTransaction: vi.fn(),
    onRemoveTransaction: vi.fn(),
    onError: vi.fn(),
    onInitTransactionForm: vi.fn(),
    onResetTransactionForm: vi.fn(),
    onUpdateTransactionForm: vi.fn(),
    onUpdateTransactionSharedForm: vi.fn(),
    onUpdateTransactionDirectForm: vi.fn(),
    onUpdateTransactionParticipant: vi.fn(),
    onAddParticipant: vi.fn(),
    onSetAllJoined: vi.fn(),
  };
  render(<App {...props} />);
  expect(
    screen.getAllByText("Start by creating your first group:")[0],
  ).toBeInTheDocument();
});
