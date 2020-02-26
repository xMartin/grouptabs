// Safari on iOS has a "standalone" feature, aka "add to homescreen".
// Every time the user opens this app, it restarts from the URL
// that was originally set as the bookmark.
// The experience we want is that it starts from where the user navigated to last.
// In other similar environments, e.g. Chrome on Android add to homescreen
// the app is not always restarted when re-opened but will get killed after a while as well.

const isStandalone = !!(window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://');
const storageKey = 'grouptabs_last_visited_location';

export function restoreLocation () {
  if (!isStandalone) {
    return;
  }

  const lastVisitedUrl = window.localStorage.getItem(storageKey);
  if (lastVisitedUrl) {
    window.location.replace(lastVisitedUrl);
  }
}

export function startPersistingLocation (history: any) {
  if (!isStandalone) {
    return;
  }

  history.listen(function () {
    window.localStorage.setItem(storageKey, window.location.href);
  });
}
