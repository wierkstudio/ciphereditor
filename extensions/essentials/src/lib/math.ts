
/**
 * Custom modulo function always returning positive values.
 * @see http://stackoverflow.com/questions/1082917
 */
export const mod = (x: number, m: number): number => {
  m = m < 0 ? -m : m
  const r = x % m
  return (r < 0 ? r + m : r)
}

/**
 * Euclidean algorithm for computing the greatest common divisor of two integers
 */
export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const h = a % b
    a = b
    b = h
  }
  return a
}

/**
 * Find the least common multiple, i.e. smallest positive integer that is
 * divisible by both a and b.
 */
export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b)
}
