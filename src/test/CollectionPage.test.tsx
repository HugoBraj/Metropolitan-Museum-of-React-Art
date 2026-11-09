import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CollectionPage } from '../pages/CollectionPage/CollectionPage'

function createResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as Response
}

function createWrapper(initialRoute = '/collection') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return function CollectionPageWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('CollectionPage', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (input) => {
      const url = new URL(String(input))
      if (url.pathname.endsWith('/departments')) {
        return createResponse({ departments: [{ departmentId: 6, displayName: 'Asian Art' }] })
      }
      if (url.pathname.endsWith('/search')) {
        return createResponse({ total: 2, objectIDs: [1002, 1001] })
      }

      const objectID = Number(url.pathname.split('/').at(-1))
      return createResponse({
        objectID,
        title: objectID === 1001 ? 'Older vessel' : 'Newer vessel',
        objectBeginDate: objectID === 1001 ? 1200 : 1800,
      })
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('searches with selected filters and sorts the visible page by date', async () => {
    render(<CollectionPage />, { wrapper: createWrapper() })

    const results = screen.getByRole('region', { name: 'Collection results' })
    await screen.findByRole('link', { name: /Newer vessel/ })

    fireEvent.click(screen.getByText('Filters'))
    fireEvent.change(screen.getByLabelText('Search all objects'), { target: { value: 'vessel' } })
    fireEvent.change(screen.getByLabelText('Department'), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText('Medium or object type'), { target: { value: 'Ceramics' } })
    fireEvent.change(screen.getByLabelText('Place of origin'), { target: { value: 'Japan' } })
    fireEvent.change(screen.getByLabelText('Created from'), { target: { value: '1000' } })
    fireEvent.change(screen.getByLabelText('Created to'), { target: { value: '1900' } })
    fireEvent.click(screen.getByLabelText('Highlights'))
    fireEvent.click(screen.getByLabelText('Has an image'))
    fireEvent.click(screen.getByRole('button', { name: 'Search collection' }))

    await waitFor(() => {
      const searchCalls = fetchMock.mock.calls.filter(([input]) =>
        new URL(String(input)).pathname.endsWith('/search'),
      )
      expect(searchCalls).toHaveLength(2)
    })

    const searchCalls = fetchMock.mock.calls.filter(([input]) =>
      new URL(String(input)).pathname.endsWith('/search'),
    )
    const lastSearchUrl = new URL(String(searchCalls.at(-1)?.[0]))
    expect(lastSearchUrl.searchParams.get('q')).toBe('vessel')
    expect(lastSearchUrl.searchParams.get('departmentId')).toBe('6')
    expect(lastSearchUrl.searchParams.get('medium')).toBe('Ceramics')
    expect(lastSearchUrl.searchParams.get('geoLocation')).toBe('Japan')
    expect(lastSearchUrl.searchParams.get('dateBegin')).toBe('1000')
    expect(lastSearchUrl.searchParams.get('dateEnd')).toBe('1900')
    expect(lastSearchUrl.searchParams.get('isHighlight')).toBe('true')
    expect(lastSearchUrl.searchParams.get('hasImages')).toBe('true')

    await screen.findByText(/Showing 1–2 of 2 objects/)
    fireEvent.change(screen.getByLabelText('Sort this page by creation date'), {
      target: { value: 'date-asc' },
    })
    const artworkLinks = within(results).getAllByRole('link').filter((link) =>
      link.getAttribute('href')?.startsWith('/objects/'),
    )
    expect(artworkLinks[0].getAttribute('href')).toBe('/objects/1001')
  })

  it('requires both creation years when either date bound is entered', async () => {
    render(<CollectionPage />, { wrapper: createWrapper() })

    await screen.findByText(/Showing 1–2 of 2 objects/)
    fireEvent.click(screen.getByText('Filters'))
    fireEvent.change(screen.getByLabelText('Created from'), { target: { value: '1000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search collection' }))

    expect(screen.getByRole('alert').textContent).toBe('Enter both years to filter by creation date.')
  })

  it('searches the selected continent with its geographic terms', async () => {
    render(<CollectionPage />, { wrapper: createWrapper('/collection?region=north-america') })

    expect(screen.getByRole('heading', { name: 'All objects' })).toBeTruthy()
    await screen.findByRole('link', { name: /Newer vessel/ })

    const searchUrls = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .filter((url) => url.pathname.endsWith('/search'))
    const locations = searchUrls.map((url) => url.searchParams.get('geoLocation'))

    expect(searchUrls).toHaveLength(6)
    expect(locations).toContain('United States')
    expect(locations).toContain('Canada')
    expect(locations).not.toContain('North America')
    expect(fetchMock).toHaveBeenCalledTimes(9)
  })
})