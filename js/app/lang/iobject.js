define(function () {
  'use strict';

  // immutable object helpers

  function merge (object /*, object1, ...*/) {
    var result = {};

    for (var i = 0; i < arguments.length; i++) {
      var toBeMerged = arguments[i];

      for (var key in toBeMerged) {
        result[key] = toBeMerged[key];
      }
    }

    return result;
  }

  function set (object, key, data) {
    object = merge(object);  // copy
    object[key] = data;
    return object;
  }

  function remove (object, key) {
    object = merge(object);  // copy
    delete object[key];
    return object;
  }

  return {
    copy: merge,
    merge: merge,
    set: set,
    remove: remove
  };

});
