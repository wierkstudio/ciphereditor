
export type ViewModifiers = string[] | string

export default function useClassName(name: string, modifiers: ViewModifiers = []) {
  return [name].concat(
    (typeof modifiers === 'string' ? modifiers.split(/\s+/) : modifiers)
      .filter(value => !!value)
      .map(modifier => name + '--' + modifier)
  ).join(' ')
}
