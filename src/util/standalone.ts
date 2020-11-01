import { History } from "history";

// Safari on iOS has a "standalone" feature, aka "add to homescreen".
// Every time the user opens this app, it restarts from the URL
// that was originally set as the bookmark.
// The experience we want is that it starts from where the user navigated to last.
// In other similar environments, e.g. Chrome on Android add to homescreen
// the app is not always restarted when re-opened but will get killed after a while as well.

const isStandalone =
  !!(window.navigator as any).standalone ||
  window.matchMedia("(display-mode: standalone)").matches ||
  document.referrer.includes("android-app://");
const storageKey = "grouptabs_last_visited_location";

export function restoreLocation() {
  if (!isStandalone) {
    return;
  }

  let lastVisitedUrl = window.localStorage.getItem(storageKey);
  if (lastVisitedUrl) {
    // convert potnetially legacy hash URL to clean URL
    lastVisitedUrl = lastVisitedUrl.replace("#/tabs/", "tabs");
    window.history.replaceState(null, "", lastVisitedUrl);
  }
}

export function startPersistingLocation(history: History) {
  if (!isStandalone) {
    return;
  }

  history.listen(() =>
    window.localStorage.setItem(storageKey, window.location.href)
  );
}
