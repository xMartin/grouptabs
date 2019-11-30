const KEY = 'tabs';

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
  const tabs = loadTabIds();
  if (!tabs.includes(tabId)) {
    tabs.push(tabId);
    localStorage.setItem(KEY, JSON.stringify(tabs));
  }
};

export const clearTabIds = (): void => {
  localStorage.clear();
};
