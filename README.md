# Grouptabs app (#nologin)

[Grouptabs](http://grouptabs.xmartin.de/) lets you track shared expenses in a group of friends in a fun way.

It is an offline-capable installable web app, currently with a mobile (small screens) focus.

The no-login variant is currently in alpha and is supposed to replace the [remoteStorage](http://remotestorage.io/) variant soon. It uses PouchDB for persistence and to sync data to a central CouchDB data storage. Collaboration works without user accounts. Just share the tab ID.

The UI is built using ReactJS and Redux.

## Setup

    npm install

Just serve the files in this directory with any static web server.

For development, open `index.dev.html` in the browser.

For production, run `npm run build` and then use `index.html`.
