import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getObjectById,
  MetMuseumApiError,
  searchObjects,
} from '../api/metMuseumClient'

function createResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

describe('Met Museum API client', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses paginated v1.1 search and normalizes empty object IDs', async () => {
    fetchMock.mockResolvedValue(createResponse({ total: 0, objectIDs: null }))
    const controller = new AbortController()

    const result = await searchObjects(
      { q: '  sunflowers  ', geoLocation: 'Europe', hasImages: true, offset: 20, limit: 10 },
      controller.signal,
    )

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0]
    const url = new URL(String(requestUrl))

    expect(url.pathname).toBe('/public/collection/v1.1/search')
    expect(url.searchParams.get('q')).toBe('sunflowers')
    expect(url.searchParams.get('geoLocation')).toBe('Europe')
    expect(url.searchParams.get('hasImages')).toBe('true')
    expect(url.searchParams.get('offset')).toBe('20')
    expect(url.searchParams.get('limit')).toBe('10')
    expect(requestOptions?.signal).toBe(controller.signal)
    expect(result).toEqual({ total: 0, objectIDs: [] })
  })

  it('requests a single object from the v1 endpoint', async () => {
    fetchMock.mockResolvedValue(createResponse({ objectID: 45734, title: 'Quail and Millet' }))

    await expect(getObjectById(45734)).resolves.toMatchObject({
      objectID: 45734,
      title: 'Quail and Millet',
    })

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/45734',
    )
  })

  it('rejects invalid pagination before making a request', async () => {
    await expect(searchObjects({ q: 'art', offset: 10_000, limit: 1 })).rejects.toThrow(RangeError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('converts HTTP failures into a typed API error', async () => {
    fetchMock.mockResolvedValue(createResponse({}, 503))

    await expect(getObjectById(45734)).rejects.toMatchObject({
      name: 'MetMuseumApiError',
      status: 503,
    } satisfies Partial<MetMuseumApiError>)
  })
})