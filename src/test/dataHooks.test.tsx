import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useArtwork } from '../hooks/useArtwork'
import { useArtworkSearch } from '../hooks/useArtworkSearch'

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

describe('collection data hooks', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches a paginated search through the query hook', async () => {
    fetchMock.mockResolvedValue(createResponse({ total: 1, objectIDs: [45734] }))

    const { result } = renderHook(() => useArtworkSearch({ q: 'quail', limit: 5 }), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({ total: 1, objectIDs: [45734] })
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('fetches an artwork detail through the query hook', async () => {
    fetchMock.mockResolvedValue(createResponse({ objectID: 45734, title: 'Quail and Millet' }))

    const { result } = renderHook(() => useArtwork(45734), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toMatchObject({
      objectID: 45734,
      title: 'Quail and Millet',
    })
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})