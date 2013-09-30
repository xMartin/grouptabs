To use it you need the [Dojo Toolkit](http://dojotoolkit.org/) 1.9.

Additionally you need [remoteStorage.js 0.8](http://remotestorage.io/integrate/).

Your `js/` directory should look like this:

```
root/
+ js/
  + dijit/
  + dojo/
  + gka/
  + util/
    remotestorage.js
    remotestorage.min.js
```

Use `index.dev.html` for development.

To do a build run

    ./build.sh

You need [Node.js](http://nodejs.org/) or Java 6 for that. Then you can use `index.html`.
