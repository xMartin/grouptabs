# uneven app

> Track expenses in a group of people!

_(Old name "Grouptabs", so you will still find references to that name.)_

[![Subscribe to Release Notes](https://release-notes.com/badges/v1.svg)](https://release-notes.com/@xMartin/Grouptabs)

[uneven](https://getuneven.com/) lets you track shared expenses in a group of friends in a fun way.

It is an offline-capable installable web app, currently with a mobile (small screens) focus.

It uses PouchDB for persistence and to sync data to a central CouchDB data storage. Collaboration works without user accounts. Just share the tab ID.

The UI is built using ReactJS and Redux.

The app is built using [Vite](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) with TypeScript.

## Setup

Run `yarn` in the project directory to install dependecies.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.

### `yarn test`

Launches the vitest runner in the interactive watch mode.

### `yarn test:ui`

Launches the vitest runner in the browser.

### `yarn build`

Builds the app for production to the `dist` folder.

## Config

Environment variable `VITE_BACKEND_URL` (default "https://backend.grouptabs.net").

## License

uneven is licensed under [GPL v3 or any later version](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>). Basically you are free to use, modify, share and improve it for any purpose, as long as you include the original changes and also publish any changes you make under the same license. Contributions are very welcome! :)

For more details and the full license, see the [COPYRIGHT.txt](COPYRIGHT.txt) and [LICENSE.txt](LICENSE.txt) files.
