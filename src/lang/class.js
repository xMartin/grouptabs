export default function (properties) {
  var ctor = properties.constructor;

  for (var key in properties) {
    if (key === 'constructor') {
      continue;
    }

    ctor.prototype[key] = properties[key];
  }

  return ctor;
};
