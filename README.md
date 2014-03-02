To use it you need the [Dojo Toolkit](http://dojotoolkit.org/) 1.9 (for debugging or creating an optimized build use the source distribution).

Your `js/` directory should look like this:

```
root/
+ js/
  + dijit/
  + dojo/
  + app/
  + remotestorage/
  + util/  (only part of Dojo source distribution)
```

Use `index.dev.html` if you didn't create an optimized build.

To do a build run

    npm install

(only the very first time) and

    ./build.sh

You need [Node.js](http://nodejs.org/) for that. Then you can use `index.html`.
