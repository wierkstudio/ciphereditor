
/**
 * Check if an array only contains unique elements (no duplicates).
 */
export const hasUniqueElements =
  <ElementType>(array: ElementType[]): boolean =>
    array.findIndex((element, index) =>
      array.indexOf(element) !== index) === -1
