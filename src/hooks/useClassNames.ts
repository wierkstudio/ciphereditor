
export const useClassNames = (name: string, modifiers: string[] = []) =>
[name].concat(
  modifiers
    .filter(value => !!value)
    .map(modifier => name + '--' + modifier)
).join(' ')
