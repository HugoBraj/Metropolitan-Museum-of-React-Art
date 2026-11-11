import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useArtwork } from '../hooks/useArtwork'
import { useArtworkSearch } from '../hooks/useArtworkSearch'
import { useArtworkSuggestions } from '../hooks/useArtworkSuggestions'
import { useCollectionArtworks } from '../hooks/useCollectionArtworks'
import { useDepartments } from '../hooks/useDepartments'

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

  it('debounces suggestion searches and fetches at most eight object details', async () => {
    fetchMock.mockImplementation(async (input) => {
      const url = new URL(String(input))
      if (url.pathname.endsWith('/search')) {
        return createResponse({ total: 10, objectIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9] })
      }
      return createResponse({ objectID: Number(url.pathname.split('/').at(-1)), title: 'Artwork' })
    })

    const { result, rerender } = renderHook(({ term }) => useArtworkSuggestions(term), {
      initialProps: { term: 'c' },
      wrapper: createQueryWrapper(),
    })
    rerender({ term: 'cat' })

    await waitFor(() => expect(result.current.isReady).toBe(true))
    expect(result.current.suggestions).toHaveLength(8)
    expect(fetchMock).toHaveBeenCalledTimes(9)
    const searchUrl = new URL(String(fetchMock.mock.calls[0][0]))
    expect(searchUrl.searchParams.get('q')).toBe('cat')
    expect(searchUrl.searchParams.get('limit')).toBe('8')

    rerender({ term: '' })
    expect(result.current.suggestions).toEqual([])
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

  it('fetches and caches collection departments', async () => {
    fetchMock.mockResolvedValue(createResponse({
      departments: [{ departmentId: 1, displayName: 'American Decorative Arts' }],
    }))

    const { result } = renderHook(() => useDepartments(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([
      { departmentId: 1, displayName: 'American Decorative Arts' },
    ])
  })

  it('hydrates a bounded paginated collection result page', async () => {
    fetchMock.mockImplementation(async (input) => {
      const url = new URL(String(input))
      if (url.pathname.endsWith('/search')) {
        return createResponse({ total: 25, objectIDs: [45734] })
      }

      return createResponse({ objectID: 45734, title: 'Quail and Millet' })
    })

    const { result } = renderHook(
      () => useCollectionArtworks({ q: 'quail', hasImages: true }, 1),
      { wrapper: createQueryWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const searchUrl = new URL(String(fetchMock.mock.calls[0][0]))
    expect(searchUrl.searchParams.get('offset')).toBe('12')
    expect(searchUrl.searchParams.get('limit')).toBe('12')
    expect(result.current.data).toMatchObject({
      total: 25,
      artworks: [{ objectID: 45734, title: 'Quail and Millet' }],
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})