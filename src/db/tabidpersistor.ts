import PouchDB from "pouchdb";
// @ts-ignore
import allDbs from "pouchdb-all-dbs";

allDbs(PouchDB, { noCache: true });

const TABS_KEY = "tabs";

// Migrate from PouchDB.allDbs to localStoage.
// Remove after a while.
export const migrateFromPouchDbAllDbsToLocalStorage = async () => {
  if (localStorage.getItem(TABS_KEY) !== null) {
    return;
  }

  try {
    // @ts-ignore
    const dbNames: string[] = await PouchDB.allDbs();
    const tabIds: string[] = [];
    dbNames.forEach((dbName) => {
      if (dbName.length > 10 && dbName.startsWith("tab/")) {
        const tabId = dbName.substring(4); // strip "tab/"
        tabIds.push(tabId);
      } else {
        console.warn(`Invalid DB name "${dbName}"`);
      }
    });
    if (tabIds.length) {
      tabIds.forEach((tabId) => addTabId(tabId));
      console.info(
        `Migrated ${tabIds.length} tab(s) to local storage: ${tabIds.join(
          ", "
        )}.`
      );
    }
    try {
      // @ts-ignore
      await PouchDB.resetAllDbs();
    } catch (error) {
      console.error("Error destroying PouchDB.allDbs:");
      console.error(error);
    }
  } catch (error) {
    if (error.name !== "indexed_db_went_bad") {
      console.warn("Error loading previously used tabs.");
      console.error(error);
      console.error(
        "Could not fetch PouchDB's allDbs while trying to migrate to local storage."
      );
    }
  }
};

export const loadTabIds = (): string[] => {
  const raw = localStorage.getItem(TABS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.error(
        "Could not read tab IDs from local storage. Falling back to empty list."
      );
    }
  } catch (error) {
    console.error(error);
    console.error("Could not read tab IDs. Falling back to empty list.");
  }
  return [];
};

export const addTabId = (tabId: string): void => {
  if (tabId.length < 7) {
    throw new Error(`Invalid Tab ID "${tabId}"`);
  }
  const tabIds = loadTabIds();
  if (!tabIds.includes(tabId)) {
    tabIds.push(tabId);
    localStorage.setItem(TABS_KEY, JSON.stringify(tabIds));
  }
};

export const clearTabIds = (): void => {
  localStorage.clear();
};
