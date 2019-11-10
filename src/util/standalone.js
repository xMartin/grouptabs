// Safari on iOS has a "standalone" feature, aka "add to homescreen".
// Every time the user opens this app, it restarts from the URL
// that was originally set as the bookmark.
// The experience we want is that it starts from where the user navigated to last.
// In other similar environments, e.g. Chrome on Android add to homescreen
// the app is not restarted when re-opened.

var isStandaloneSafari = !!window.navigator.standalone && window.navigator.userAgent.indexOf('Safari') >= 0;
var storageKey = 'grouptabs_last_visited_location';

export function restoreLocation () {
  if (!isStandaloneSafari) {
    return;
  }

  var lastVisitedUrl = window.localStorage.getItem(storageKey);
  if (lastVisitedUrl) {
    window.location.replace(lastVisitedUrl);
  }
}

export function startPersistingLocation (history) {
  if (!isStandaloneSafari) {
    return;
  }

  history.listen(function () {
    window.localStorage.setItem(storageKey, window.location.href);
  });
}
