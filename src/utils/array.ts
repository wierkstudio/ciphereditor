
/**
 * Return a new array having the given element at the front
 */
 export const arrayUniqueUnshift = <E>(array: E[], element: E) => {
  const newArray = array.filter(e => e !== element)
  newArray.unshift(element)
  return newArray
}

/**
 * Return a new array having the given element at the end
 */
export const arrayUniquePush = <E>(array: E[], element: E) => {
  const newArray = array.filter(e => e !== element)
  newArray.push(element)
  return newArray
}

/**
 * Return a new array having the given element removed
 */
export const arrayRemove = <E>(array: E[], element: E) =>
  array.filter(e => e !== element)
