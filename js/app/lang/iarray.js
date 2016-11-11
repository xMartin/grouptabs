define(function () {
  'use strict';

  // immutable array helpers

  function add (array, item) {
    return array.concat(item);
  }

  function addUniq (array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
      return array;
    }

    return add(array, item);
  }

  function remove (array, index) {
    array = array.slice();  // copy
    array.splice(index, 1);
    return array;
  }

  function removeItem (array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      return remove(array, index);
    }

    return array;
  }

  return {
    add: add,
    addUniq: addUniq,
    remove: remove,
    removeItem: removeItem
  };

});
