
export const mapNamedObjects = <T extends { name: string }>(namedObjects: T[]) => {
  const map: { [name: string]: T } = {}
  for (let i = 0; i < namedObjects.length; i++) {
    map[namedObjects[i].name] = namedObjects[i]
  }
  return map
}
