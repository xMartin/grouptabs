# Grouptabs app

> Track expenses in a group of people!

[![Subscribe to Release Notes](https://release-notes.com/badges/v1.svg)](https://release-notes.com/@xMartin/Grouptabs)

[Grouptabs](https://grouptabs.net/) lets you track shared expenses in a group of friends in a fun way.

It is an offline-capable installable web app, currently with a mobile (small screens) focus.

It uses PouchDB for persistence and to sync data to a central CouchDB data storage. Collaboration works without user accounts. Just share the tab ID.

The UI is built using ReactJS and Redux.

The app is based on [Create React App](https://github.com/facebook/create-react-app) with TypeScript.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Config

Environment variable `REACT_APP_BACKEND_URL` (default "https://grouptabs-app.xmartin.de:5984").

## License

Grouptabs is licensed under [GPL v3 or any later version](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>). Basically you are free to use, modify, share and improve it for any purpose, as long as you include the original changes and also publish any changes you make under the same license. Contributions are very welcome! :)

For more details and the full license, see the [COPYRIGHT.txt](COPYRIGHT.txt) and [LICENSE.txt](LICENSE.txt) files.
