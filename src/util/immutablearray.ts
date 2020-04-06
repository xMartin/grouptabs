// immutable array helpers

export default class ImmutableArrayHelper {
  static addUniq<T>(array: T[], item: T): T[] {
    var index = array.indexOf(item);
    if (index !== -1) {
      return array;
    }

    return array.concat(item);
  }

  static remove<T>(array: T[], index: number): T[] {
    array = array.slice();  // copy
    array.splice(index, 1);
    return array;
  }

  static removeItem<T >(array: T[], item: T): T[] {
    var index = array.indexOf(item);

    if (index !== -1) {
      return ImmutableArrayHelper.remove(array, index);
    }

    return array;
  }
}
