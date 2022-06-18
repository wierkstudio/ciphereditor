
/**
 * Lightweight AMD loader providing basic `define` and `require` logic to deal
 * with AMD modules.
 */
;((global: any) => {
  // Initialize state
  const discoveredModules: Array<{ id: string, spec: string }> = []
  const listenerMap = new Map<string, Array<((value: any) => void)>>()
  const resolveMap = new Map<string, any>()
  resolveMap.set('require', globalRequire)

  /**
   * Install listeners and call back when all of them have been resolved.
   */
  function req (deps: string[], callback: Function, definingId?: string): void {
    const length = deps.length
    if (length === 0) {
      callback()
    } else {
      const factoryArgs: any[] = new Array(length)
      let depsLoaded = 0
      for (let i = 0; i < length; i++) {
        // Create listener
        const arg = i
        const dep = deps[arg]
        if (typeof dep !== 'string') {
          throw new Error(`Unexpected dependency type '${typeof dep}'`)
        }
        const listener = (value: any): void => {
          factoryArgs[arg] = value
          if (++depsLoaded >= length) {
            callback.apply(0, factoryArgs)
          }
        }
        // Define listener fulfillment
        if (definingId !== undefined && dep === 'exports') {
          listener({})
        } else if (definingId !== undefined && dep === 'module') {
          listener({ definingId })
        } else {
          // Add listener
          if (resolveMap.has(dep)) {
            listener(resolveMap.get(dep))
          } else if (listenerMap.has(dep)) {
            listenerMap.get(dep)?.push(listener)
          } else {
            listenerMap.set(dep, [listener])
          }
        }
      }
    }
  }

  /**
   * Resolve an id to the given value and satisfy listeners.
   */
  function resolve (id: string, value: any): void {
    if (resolveMap.has(id)) {
      throw new Error(`Module '${id}' is already defined`)
    }

    if (value !== undefined && value !== null) {
      resolveMap.set(id, value)
      if (typeof value === 'object' && typeof value.spec === 'string') {
        discoveredModules.push({ id, spec: value.spec })
      }

      // Call listeners and remove them
      const listeners = listenerMap.get(id) ?? []
      for (const listener of listeners) {
        listener(value)
      }
      listenerMap.delete(id)
    }
  }

  /**
   * Global AMD define function
   */
  function globalDefine (
    id: string,
    depsOrFactory: string[] | Function | object,
    factory?: Function | object
  ): void {
    // Handle optional module id
    if (typeof id !== 'string') {
      id = 'default'
    } else if (id === 'default') {
      throw new Error('Module id \'default\' is reserved.')
    }

    // Handle optional dependencies
    let deps: string[]
    if (Array.isArray(depsOrFactory)) {
      deps = depsOrFactory
    } else {
      deps = ['require', 'exports', 'module']
      factory = depsOrFactory
    }

    // Run factory
    if (typeof factory === 'object') {
      resolve(id, factory)
    } else if (typeof factory === 'function') {
      req(deps, function () {
        const value = (factory as Function).apply(0, arguments)
        const exportsArg = deps.indexOf('exports')
        resolve(id, exportsArg !== -1 ? arguments[exportsArg] : value)
      }, id)
    } else {
      throw new Error(`Unexpected factory type '${typeof factory}'`)
    }
  }

  // Set `amd` property as required by the AMD spec
  globalDefine.amd = {}

  /**
   * Global AMD require function
   */
  function globalRequire (
    deps: string | string[],
    callback?: Function
  ): any | undefined {
    if (typeof deps === 'string') {
      // Require single module in sync (function call with one string arg)
      const module = resolveMap.get(deps)
      if (module === undefined) {
        throw new Error(`Requiring module '${deps}' in sync failed`)
      }
      return module
    } else if (callback !== undefined) {
      req(deps, callback)
    } else {
      throw new Error('Called require without callback')
    }
  }

  // Set global functions
  global.define = globalDefine
  global.require = globalRequire

  // Export
  return {
    define: globalDefine,
    require: globalRequire
  }
})(globalThis)
