import { loadTabIds, addTabId, clearTabIds } from "./tabidpersistor";

const KEY = "tabs";

beforeEach(() => {
  localStorage.clear();
  console.error = vi.fn();
});

describe("loadTabIds", () => {
  it("loads a list", () => {
    localStorage.setItem(KEY, JSON.stringify(["1111111", "2222222"]));
    const tabs = loadTabIds();
    expect(tabs).toEqual(["1111111", "2222222"]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("returns empty list if empty value", () => {
    expect(loadTabIds()).toEqual([]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("returns empty list if no valid JSON", () => {
    localStorage.setItem(KEY, "1111111,2222222");
    const tabs = loadTabIds();
    expect(tabs).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("returns empty list if stored data is not a list", () => {
    localStorage.setItem(KEY, '"1111111,2222222"');
    const tabs = loadTabIds();
    expect(tabs).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe("addTabId", () => {
  it("stores a name with previously empty store", () => {
    addTabId("1111111");
    expect(JSON.parse(localStorage.getItem(KEY) || "")).toEqual(["1111111"]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("adds a name to the existing list", () => {
    localStorage.setItem(KEY, JSON.stringify(["1111111", "2222222"]));
    addTabId("3333333");
    expect(JSON.parse(localStorage.getItem(KEY) || "")).toEqual([
      "1111111",
      "2222222",
      "3333333",
    ]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("does not add tab ID if it is already stored", () => {
    localStorage.setItem(KEY, JSON.stringify(["1111111", "2222222"]));
    addTabId("1111111");
    expect(JSON.parse(localStorage.getItem(KEY) || "")).toEqual([
      "1111111",
      "2222222",
    ]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("throws an error if tab ID is empty", () => {
    expect(() => addTabId("")).toThrow();
  });

  it("throws an error if tab ID is too short", () => {
    expect(() => addTabId("123456")).toThrow();
  });

  it("overwrites existing tabs if data cannot be loaded", () => {
    localStorage.setItem(KEY, "1111111,2222222");
    addTabId("3333333");
    expect(JSON.parse(localStorage.getItem(KEY) || "")).toEqual(["3333333"]);
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe("clearTabIds", () => {
  it("clears", () => {
    localStorage.setItem(KEY, "1111111,2222222");
    clearTabIds();
    expect(localStorage.getItem(KEY)).toBe(null);
    expect(console.error).not.toHaveBeenCalled();
  });
});
