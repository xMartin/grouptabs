import { loadTabIds, addTabId, clearTabIds } from "./tabidpersistor";

const KEY = 'tabs';

beforeEach(() => {
  localStorage.clear();
  console.error = jest.fn();
});

describe('loadTabIds', () => {
  it('loads a list', () => {
    localStorage.__STORE__[KEY] = JSON.stringify(['tab1', 'tab2']);
    const tabs = loadTabIds();
    expect(tabs).toEqual(['tab1', 'tab2']);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('returns empty list if empty value', () => {
    expect(loadTabIds()).toEqual([]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('returns empty list if no valid JSON', () => {
    localStorage.__STORE__[KEY] = 'tab1,tab2';
    const tabs = loadTabIds();
    expect(tabs).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('returns empty list if stored data is not a list', () => {
    localStorage.__STORE__[KEY] = '"tab1,tab2"';
    const tabs = loadTabIds();
    expect(tabs).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('addTabId', () => {
  it('stores a name with previously empty store', () => {
    addTabId('tabX');
    expect(JSON.parse(localStorage.__STORE__[KEY])).toEqual(['tabX']);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('adds a name to the existing list', () => {
    localStorage.__STORE__[KEY] = JSON.stringify(['tab1', 'tab2']);
    addTabId('tabX');
    expect(JSON.parse(localStorage.__STORE__[KEY])).toEqual(['tab1', 'tab2', 'tabX']);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('does not add tab ID if it is already stored', () => {
    localStorage.__STORE__[KEY] = JSON.stringify(['tab1', 'tab2']);
    addTabId('tab1');
    expect(JSON.parse(localStorage.__STORE__[KEY])).toEqual(['tab1', 'tab2']);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('overwrites existing tabs if data cannot be loaded', () => {
    localStorage.__STORE__[KEY] = 'tab1,tab2';
    addTabId('tabX');
    expect(JSON.parse(localStorage.__STORE__[KEY])).toEqual(['tabX']);
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe('clearTabIds', () => {
  it('clears', () => {
    localStorage.__STORE__[KEY] = 'tab1,tab2';
    clearTabIds();
    expect(localStorage.getItem(KEY)).toBe(null);
    expect(console.error).not.toHaveBeenCalled();
  });
});
