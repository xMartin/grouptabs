// Prevent warning about switching from uncoltrolled to controlled inputs
// https://github.com/facebook/react/issues/6222
export function control(value: any) /* TODO return type any but undefined */ {
  return value === undefined ? "" : value;
}
