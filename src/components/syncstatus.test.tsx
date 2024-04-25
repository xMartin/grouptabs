import { render, screen } from "@testing-library/react";
import SyncStatus from "./syncstatus";

let realNavigator: typeof window.navigator;

beforeEach(() => {
  realNavigator = navigator;
  // eslint-disable-next-line no-global-assign
  navigator = { ...navigator };
});

afterEach(() => {
  window.navigator = realNavigator;
});

function setOnLine(value: boolean) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.navigator.onLine = value;
}

it("renders initial offline status", () => {
  setOnLine(false);
  render(<SyncStatus />);
  expect(screen.queryByText(/❌/i)).toBeInTheDocument();
  expect(screen.queryByText(/not synced, yet/i)).toBeInTheDocument();
});

it("displays error", () => {
  render(<SyncStatus syncError />);
  expect(screen.queryByText("⚠️")).toBeInTheDocument();
});

it("displays no error if recently synced", () => {
  const recentDateString = new Date(new Date().getTime() - 8000).toISOString();
  render(<SyncStatus syncError lastSyncedSuccessfully={recentDateString} />);
  expect(screen.queryByText("⚠️")).not.toBeInTheDocument();
});

it("renders recently synced", () => {
  const recentDateString = new Date(new Date().getTime() - 5000).toISOString();
  render(<SyncStatus lastSyncedSuccessfully={recentDateString} />);
  expect(screen.queryByText("✅")).toBeInTheDocument();
  expect(screen.queryByText(/last synced:/i)).toBeInTheDocument();
});

it("renders last synced timestamp if syncing was a while back", () => {
  const longAgoDateString = new Date(
    new Date().getTime() - 555000,
  ).toISOString();
  render(<SyncStatus lastSyncedSuccessfully={longAgoDateString} />);
  expect(screen.queryByText(/last synced:/i)).toBeInTheDocument();
});
