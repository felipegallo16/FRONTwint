// Sistema simple de caché
const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos

export function getCachedData<T>(key: string): T | null {
  const cachedItem = cache[key]

  if (!cachedItem) return null

  // Verificar si el caché ha expirado
  if (Date.now() - cachedItem.timestamp > CACHE_DURATION) {
    delete cache[key]
    return null
  }

  return cachedItem.data as T
}

export function setCachedData<T>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
  }
}

export function clearCache(keyPrefix?: string): void {
  if (keyPrefix) {
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(keyPrefix)) {
        delete cache[key]
      }
    })
  } else {
    Object.keys(cache).forEach((key) => {
      delete cache[key]
    })
  }
}
