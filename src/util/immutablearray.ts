// immutable array helpers

export default class ImmutableArrayHelper {
  static add(array: any[], item: any): any[] {
    return array.concat(item);
  }

  static addUniq(array: any[], item: any): any[] {
    var index = array.indexOf(item);
    if (index !== -1) {
      return array;
    }

    return ImmutableArrayHelper.add(array, item);
  }

  static remove(array: any[], index: number): any[] {
    array = array.slice();  // copy
    array.splice(index, 1);
    return array;
  }

  static removeItem(array: any[], item: any): any[] {
    var index = array.indexOf(item);

    if (index !== -1) {
      return ImmutableArrayHelper.remove(array, index);
    }

    return array;
  }
}
