
export type ViewModifiers = string[] | string

const useClassName = (name: string, modifiers: ViewModifiers = []): string =>
  [name].concat(
    (typeof modifiers === 'string' ? modifiers.split(/\s+/) : modifiers)
      .filter(value => value !== '')
      .map(modifier => name + '--' + modifier)
  ).join(' ')

export default useClassName
