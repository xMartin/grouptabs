To use it you need the [Dojo Toolkit](http://dojotoolkit.org/) 1.8.

Additionally you need the [dropbox.js library](https://github.com/dropbox/dropbox-js) (HEAD of master at this point, 1.6.1 should work fine, too).

Your `js/` directory should look like this:

```
root/
+ js/
  + dijit/
  + dojo/
  + dojox/
  + gka/
  + util/
    dropbox.js
    dropbox.min.js
```

Use `index.dev.html` for development.

To do a build run

    ./build.sh

You need [Node.js](http://nodejs.org/) or Java 6 for that. Then you can use `index.html`.
