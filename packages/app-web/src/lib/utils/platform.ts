
export type Platform = 'windows' | 'macos' | 'unknown'

const navigatorUserAgentPlatformMap: Record<string, Platform> = {
  macOS: 'macos',
  Windows: 'windows'
}

const navigatorPlatformMap: Record<string, Platform> = {
  MacIntel: 'macos',
  Win32: 'windows'
}

let platform: Platform | undefined

/**
 * Lazily identify the platform using User-Agent Client Hints
 */
export const identifyPlatform = (): Platform => {
  if (platform === undefined) {
    // Try to identify using `navigator.userAgentData.platform`
    platform = navigatorUserAgentPlatformMap[(navigator as any).userAgentData?.platform] ?? 'unknown'
    // Fallback: Try to identify using `navigator.platform`
    if (platform === 'unknown') {
      platform = navigatorPlatformMap[navigator.platform] ?? 'unknown'
    }
  }
  return platform
}

/**
 * Match the identified platform with the given one
 */
export const checkPlatform = (platform: Platform): boolean => {
  return identifyPlatform() === platform
}
