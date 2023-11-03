const TABS_KEY = "tabs";

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
  localStorage.removeItem(TABS_KEY);
};
