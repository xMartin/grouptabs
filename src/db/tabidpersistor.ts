import PouchDB from 'pouchdb';
// @ts-ignore
import allDbs from 'pouchdb-all-dbs';

allDbs(PouchDB, {noCache: true});

const KEY = 'tabs';

// Migrate from PouchDB.allDbs to localStoage.
// Remove after a while.
export const migrateFromPouchDbAllDbsToLocalStorage = async () => {
  if (localStorage.getItem(KEY) !== null) {
    return;
  }

  try {
    // @ts-ignore
    const dbNames: string[] = await PouchDB.allDbs();
    const tabIds = dbNames.map((dbName) => dbName.substring(4));  // strip "tab/"
    localStorage.setItem(KEY, JSON.stringify(tabIds));
    console.info(`Migrated ${tabIds.length} tab(s) to local storage: ${tabIds.join(', ')}.`);
    try {
      // @ts-ignore
      await PouchDB.resetAllDbs();
    } catch (error) {
      console.error('Error destroying PouchDB.allDbs:');
      console.error(error);
    }
  } catch (error) {
    if (error.name !== 'indexed_db_went_bad') {
      console.warn('Error loading previously used tabs.');
      console.error(error);
      console.error('Could not fetch PouchDB\'s allDbs while trying to migrate to local storage.');
    }
  }
}

export const loadTabIds = (): string[] => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.error('Could not read tab IDs from local storage. Falling back to empty list.');
    }
  } catch (error) {
    console.error(error);
    console.error('Could not read tab IDs. Falling back to empty list.');
  }
  return [];
};

export const addTabId = (tabId: string): void => {
  const tabIds = loadTabIds();
  if (!tabIds.includes(tabId)) {
    tabIds.push(tabId);
    localStorage.setItem(KEY, JSON.stringify(tabIds));
  }
};

export const clearTabIds = (): void => {
  localStorage.clear();
};
