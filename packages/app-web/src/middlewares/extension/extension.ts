
import { ContributionExports, contributionExportsSchema } from '@ciphereditor/library'
import { ProcessorWorker } from '@ciphereditor/processor'
import { extensionContext } from './context'
import { z } from 'zod'

export interface ContributionInstance {
  worker: ProcessorWorker
  exports: ContributionExports
}

interface ExtensionInstance {
  worker: ProcessorWorker
  contributionExportsMap: Map<string, ContributionExports>
}

// We need 'unsafe-eval' for backwards compatibility
const contentSecurityPolicy =
  'default-src https:; script-src data: https: \'unsafe-eval\' \'wasm-unsafe-eval\';'

const extensionInstanceMap = new Map<string, Promise<ExtensionInstance>>()

/**
 * Lazily resolve the given contribution name to an extension, activate it and
 * retrieve the extension exports it provides.
 * @param contributionName Name uniquely identifying a contribution
 * @param fallbackUrl Fallback extension url to be used when the contribution
 * name could not be resolved
 * @throws {Error} If the contribution name could not be resolved to an
 * extension url
 * @throws {Error} If the contribution was not exported by the extension its
 * name resolved to
 * @returns Contribution exports and extension worker
 */
export const getContributionInstance = async (
  contributionName: string,
  fallbackUrl?: string
): Promise<ContributionInstance> => {
  const extensionUrl = await resolveExtensionUrl(contributionName, fallbackUrl)
  if (extensionUrl === undefined) {
    throw new Error(`Contribution ${contributionName} could not be resolved to an extension`)
  }
  const extensionInstance = await getExtensionInstance(extensionUrl)
  const contributionExports = extensionInstance.contributionExportsMap.get(contributionName)
  if (contributionExports === undefined) {
    throw new Error(`Contribution ${contributionName} was not exported by the extension ${extensionUrl}`)
  }
  return { worker: extensionInstance.worker, exports: contributionExports }
}

/**
 * Resolve the given contribution name to an extension url.
 */
const resolveExtensionUrl = async (
  contributionName: string,
  fallbackUrl: string | undefined
): Promise<string | undefined> => {
  // TODO: Resolve the contribution name to an extension url using the directory
  return fallbackUrl
}

/**
 * Lazily create and activate an extension using the given extension url and
 * return its instance.
 */
const getExtensionInstance = async (url: string): Promise<ExtensionInstance> => {
  let instancePromise = extensionInstanceMap.get(url)
  if (instancePromise !== undefined) {
    return await instancePromise
  } else {
    instancePromise = createExtensionInstance(url)
    extensionInstanceMap.set(url, instancePromise)
  }
  return await instancePromise
}

/**
 * Create an extension instance for the given url.
 */
const createExtensionInstance = async (url: string): Promise<ExtensionInstance> => {
  const worker = new ProcessorWorker(contentSecurityPolicy)
  const contributionExportsMap = new Map<string, ContributionExports>()

  worker.setInitializeHandler(async (worker) => {
    // Import extension bundle
    await worker.initializeWithImportScripts([url])

    // Call activate extension module export and await its result
    const untrustedContributions = await worker.initializeWithCallModuleExport(
      'index', 'activate', extensionContext)

    // Validate the untrusted result (originating from third-party code)
    const contributionsExports =
      z.array(contributionExportsSchema).parse(untrustedContributions)

    // Gather contribution exports
    for (const contributionExports of contributionsExports) {
      if (typeof contributionExports.contribution.name === 'string') {
        const name = contributionExports.contribution.name
        contributionExportsMap.set(name, contributionExports)
      }
    }
  })

  worker.setResetHandler(worker => {
    // Delete instance from the register
    extensionInstanceMap.delete(url)
  })

  await worker.activate()
  return { worker, contributionExportsMap }
}
