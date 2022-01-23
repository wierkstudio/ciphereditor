
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

/**
 * Recursively compare the given arrays with each other.
 */
export const arrayEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }
  if (typeof a !== typeof b) {
    return false
  }
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false
    }
    let i = -1
    let equal = true
    while (equal && ++i < a.length) {
      equal = arrayEqual(a[i], b[i])
    }
    return equal
  }
  return false
}

/**
 * Apply the Fisher–Yates shuffle algorithm to the given array using a PRNG.
 * The array is shuffled in place.
 * @param array Array to be shuffled
 * @param prng PRNG function to be used (uses Math.random by default)
 * @returns Shuffled array
 */
export const shuffleArray = <E>(array: E[], prng: () => number = Math.random) => {
  let m = array.length
  let t
  let i
  while (m) {
    i = Math.floor(prng() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
