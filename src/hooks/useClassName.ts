
export type ViewModifiers = string[] | string

const useClassName = (name: string, modifiers: ViewModifiers = []): string =>
  [name].concat(
    (typeof modifiers === 'string' ? modifiers.split(/\s+/) : modifiers)
      .filter(value => value !== '')
      .map(modifier => name + '--' + modifier)
  ).join(' ')

export default useClassName

export const mergeModifiers = (a: ViewModifiers = [], b: ViewModifiers = []): ViewModifiers => {
  const normalizedA = typeof a === 'string' ? a.split(/\s+/) : a
  const normalizedB = typeof b === 'string' ? b.split(/\s+/) : b
  return normalizedA.concat(normalizedB)
}
