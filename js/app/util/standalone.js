define(function () {
  'use strict';

  // Safari on iOS has a "standalone" feature, aka "add to homescreen".
  // Everytime the user opens this app, it restarts from the URL
  // that was originally set as the bookmark.
  // The experience we want is that it starts from where the user navigated to last.
  // In other similar environments, e.g. Chrome on Android add to homescreen
  // the app is not restarted when re-opened.

  return function (history) {
    var isStandaloneSafari = !!window.navigator.standalone && window.navigator.userAgent.indexOf('Safari') >= 0;

    if (!isStandaloneSafari) {
      return;
    }

    var storageKey = 'grouptabs_last_visited_location';

    var lastVisitedUrl = window.localStorage.getItem(storageKey);
    if (lastVisitedUrl) {
      window.location.replace(lastVisitedUrl);
    }

    history.listen(function () {
      window.localStorage.setItem(storageKey, window.location.href);
    });
  };

});
