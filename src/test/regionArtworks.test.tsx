import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRegionArtworks } from '../hooks/useRegionArtworks'

function createResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as Response
}

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function QueryWrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('region artwork hook', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (input) => {
      const url = new URL(String(input))
      if (url.pathname.endsWith('/search')) {
        return createResponse({ total: 1, objectIDs: [45734] })
      }

      return createResponse({ objectID: 45734, title: 'Quail and Millet' })
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads a bounded set of details for a continent', async () => {
    const { result } = renderHook(() => useRegionArtworks('africa'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([
      { objectID: 45734, title: 'Quail and Millet' },
    ])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('uses country-level searches for North America and deduplicates IDs', async () => {
    const { result } = renderHook(() => useRegionArtworks('north-america'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const searchUrls = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .filter((url) => url.pathname.endsWith('/search'))

    expect(searchUrls).toHaveLength(6)
    expect(searchUrls.map((url) => url.searchParams.get('geoLocation'))).toContain('Canada')
    expect(result.current.data).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledTimes(7)
  })
})