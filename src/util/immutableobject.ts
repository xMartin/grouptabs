// immutable object helpers

type dict = {[key: string]: any};

export default class ImmutableObjectHelper {
  static merge(...objects: dict[]): dict {
    var result: dict = {};

    for (var i = 0; i < objects.length; i++) {
      var toBeMerged = objects[i];

      for (var key in toBeMerged) {
        result[key] = toBeMerged[key];
      }
    }

    return result;
  }

  static set(object: dict, key: string, data: any): dict {
    object = ImmutableObjectHelper.merge(object);  // copy
    object[key] = data;
    return object;
  }

  static remove(object: dict, key: string): dict {
    object = ImmutableObjectHelper.merge(object);  // copy
    delete object[key];
    return object;
  }
}
