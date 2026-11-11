import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'

function createResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as Response
}

describe('application routes', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders the home page and main navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Explore the collection.' })).toBeTruthy()
    const discoveryNavigation = screen.getByRole('navigation', { name: 'Explore the collection' })
    const discoveryLinks = within(discoveryNavigation).getAllByRole('link')
    expect(discoveryLinks).toHaveLength(4)
    expect(discoveryLinks[0].getAttribute('style')).toContain('/bg_home_buttons/by-departments.jpg')
    expect(discoveryLinks[1].getAttribute('style')).toContain('/bg_home_buttons/by-continents.jpg')
    expect(discoveryLinks[2].getAttribute('style')).toContain('/bg_home_buttons/by-chronology.jpg')
    expect(discoveryLinks[3].getAttribute('style')).toContain('/bg_home_buttons/by-statistics.jpg')
    expect(screen.getByText('Browse the collection by department and medium.')).toBeTruthy()
    expect(screen.queryByText('Featured collection')).toBeNull()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy()
  })

  it('opens the dedicated continent map from the home page and navbar', () => {
    const homeView = render(<App />)

    const discoveryNavigation = screen.getByRole('navigation', { name: 'Explore the collection' })
    fireEvent.click(within(discoveryNavigation).getByRole('link', { name: 'By continents' }))
    expect(screen.getByRole('heading', { name: 'By continent' })).toBeTruthy()
    homeView.unmount()

    window.history.replaceState(null, '', '/')
    render(<App />)

    const mainNavigation = screen.getByRole('navigation', { name: 'Main navigation' })
    fireEvent.click(within(mainNavigation).getByRole('link', { name: 'By continents' }))
    expect(screen.getByRole('heading', { name: 'By continent' })).toBeTruthy()
  })

  it('opens All objects with the selected department filter', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(String(input))
      const body = url.pathname.endsWith('/departments')
        ? { departments: [{ departmentId: 11, displayName: 'European Paintings' }] }
        : url.pathname.endsWith('/search')
          ? { total: 1, objectIDs: [436524] }
          : { objectID: 436524, title: 'Sunflowers', artistDisplayName: 'Vincent van Gogh' }

      return createResponse(body)
    })
    vi.stubGlobal('fetch', fetchMock)
    window.history.replaceState(null, '', '/departments')
    render(<App />)

    fireEvent.click(await screen.findByRole('link', { name: 'Browse European Paintings' }))

    expect(await screen.findByRole('heading', { name: 'All objects' })).toBeTruthy()
    await screen.findByRole('link', { name: /Sunflowers/ })

    const searchUrl = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .find((url) => url.pathname.endsWith('/search'))
    expect(searchUrl?.searchParams.get('departmentId')).toBe('11')
    expect(searchUrl?.searchParams.has('q')).toBe(false)
  })

  it('renders the not-found page for an unknown route', () => {
    window.history.replaceState(null, '', '/unknown')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
  })

  it('renders the collection and artwork routes', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input) => {
      const url = new URL(String(input))
      if (url.pathname.endsWith('/departments')) {
        return createResponse({ departments: [] })
      }
      if (url.pathname.endsWith('/search')) {
        return createResponse({ total: 0, objectIDs: [] })
      }
      return createResponse({ objectID: 45734 })
    }))

    window.history.replaceState(null, '', '/collection')
    const collectionView = render(<App />)

    expect(screen.getByRole('heading', { name: 'All objects' })).toBeTruthy()
    collectionView.unmount()

    window.history.replaceState(null, '', '/objects/45734')
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Untitled artwork' })).toBeTruthy()
  })

  it('opens the mobile navigation and submits a search to All objects', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input) => {
      const url = new URL(String(input))
      return createResponse(url.pathname.endsWith('/departments')
        ? { departments: [] }
        : { total: 0, objectIDs: [] })
    }))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const navigationToggle = screen.getByRole('button', { name: 'Close navigation' })
    expect(navigationToggle.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    expect(screen.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('button', { name: 'Dismiss navigation overlay' })).toBeNull()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search artworks' }), {
      target: { value: 'blue flowers' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit artwork search' }))

    expect(await screen.findByRole('heading', { name: 'All objects' })).toBeTruthy()
    expect(new URLSearchParams(window.location.search).get('q')).toBe('blue flowers')
  })

  it('switches between search and the mobile menu without overlapping panels', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search artworks' }), {
      target: { value: 'art' },
    })
    expect(screen.getByRole('button', { name: 'Close search' }).querySelector('.lucide-search')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy()

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Open navigation' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.queryByRole('searchbox', { name: 'Search artworks' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('button', { name: 'Open search' }).getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    expect(screen.queryByRole('button', { name: 'Dismiss navigation overlay' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded')).toBe('false')
    expect((screen.getByRole('searchbox', { name: 'Search artworks' }) as HTMLInputElement).value).toBe('')
  })

  it('closes the menu and search with Escape and restores focus', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    fireEvent.keyDown(screen.getByRole('button', { name: 'Close navigation' }), { key: 'Escape' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.queryByRole('button', { name: 'Dismiss navigation overlay' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    fireEvent.keyDown(screen.getByRole('searchbox', { name: 'Search artworks' }), { key: 'Escape' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open search' }))
    expect(screen.queryByRole('searchbox', { name: 'Search artworks' })).toBeNull()
  })

  it('closes search on an outside click without blocking the clicked page link', () => {
    vi.stubGlobal('fetch', vi.fn(async (input) => {
      const url = new URL(String(input))
      return createResponse(url.pathname.endsWith('/departments')
        ? { departments: [] }
        : { total: 0, objectIDs: [] })
    }))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    const searchInput = screen.getByRole('searchbox', { name: 'Search artworks' })
    fireEvent.change(searchInput, { target: { value: 'art' } })
    fireEvent.pointerDown(searchInput)
    expect(screen.getByRole('searchbox', { name: 'Search artworks' })).toBeTruthy()

    const closeToggle = screen.getByRole('button', { name: 'Close search' })
    fireEvent.pointerDown(closeToggle)
    expect(screen.getByRole('button', { name: 'Close search' })).toBeTruthy()

    const collectionLink = screen.getByRole('link', { name: 'Start exploring' })
    fireEvent.pointerDown(collectionLink)
    fireEvent.click(collectionLink)
    expect(screen.queryByRole('searchbox', { name: 'Search artworks' })).toBeNull()
    expect(window.location.pathname).toBe('/collection')
  })

  it('shows suggestions, clears the input, and opens an artwork', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(String(input))
      if (url.pathname.endsWith('/search')) {
        return createResponse({ total: 2, objectIDs: [901, 902] })
      }
      const objectID = Number(url.pathname.split('/').at(-1))
      return createResponse({ objectID, title: objectID === 901 ? 'Moonlit garden' : '', artistDisplayName: '' })
    })
    vi.stubGlobal('fetch', fetchMock)
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    const searchInput = screen.getByRole('searchbox', { name: 'Search artworks' })
    fireEvent.change(searchInput, { target: { value: 'moon' } })

    expect(await screen.findByRole('link', { name: /Moonlit garden/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Untitled artwork/ })).toBeTruthy()
    expect(screen.getAllByText('Artist unknown')).toHaveLength(2)

    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    expect(clearButton.querySelector('svg')).not.toBeNull()
    fireEvent.click(clearButton)
    expect((searchInput as HTMLInputElement).value).toBe('')
    expect(screen.queryByRole('region', { name: 'Artwork suggestions' })).toBeNull()

    fireEvent.change(searchInput, { target: { value: 'moon' } })
    const artworkSuggestion = await screen.findByRole('link', { name: /Moonlit garden/ })
    fireEvent.pointerDown(artworkSuggestion)
    expect(screen.getByRole('searchbox', { name: 'Search artworks' })).toBeTruthy()
    fireEvent.click(artworkSuggestion)
    expect(await screen.findByRole('heading', { name: 'Moonlit garden' })).toBeTruthy()
    expect(window.location.pathname).toBe('/objects/901')
  })

  it('handles an empty suggestion list and submits the search form', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input) => {
      const url = new URL(String(input))
      return createResponse(url.pathname.endsWith('/departments')
        ? { departments: [] }
        : { total: 0, objectIDs: null })
    }))
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search artworks' }), {
      target: { value: 'no matches' },
    })
    expect(await screen.findByText('No artworks found.')).toBeTruthy()

    fireEvent.submit(screen.getByRole('search'))
    expect(await screen.findByRole('heading', { name: 'All objects' })).toBeTruthy()
    expect(new URLSearchParams(window.location.search).get('q')).toBe('no matches')
  })
})