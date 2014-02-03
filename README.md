To use it you need the [Dojo Toolkit](http://dojotoolkit.org/) 1.9 (for debugging or creating an optimized build use the source distribution).

Additionally you need [remoteStorage.js 0.8 or 0.9](http://remotestorage.io/integrate/).

Your `js/` directory should look like this:

```
root/
+ js/
  + dijit/
  + dojo/
  + gka/
  + util/  (only part of Dojo source distribution)
    remotestorage.js
    remotestorage.min.js  (only needed for optimized build version)
```

Use `index.dev.html` if you didn't create an optimized build.

To do a build run

    npm install

(only the very first time) and

    ./build.sh

You need [Node.js](http://nodejs.org/) for that. Then you can use `index.html`.
