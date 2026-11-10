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
    expect(discoveryLinks[0].getAttribute('style')).toContain('/bg_home_buttons/by-categories.jpg')
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

  it('opens All objects with the selected category filters', async () => {
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
    window.history.replaceState(null, '', '/categories')
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'Browse Van Gogh paintings' }))

    expect(await screen.findByRole('heading', { name: 'All objects' })).toBeTruthy()
    await screen.findByRole('link', { name: /Sunflowers/ })

    const searchUrl = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .find((url) => url.pathname.endsWith('/search'))
    expect(searchUrl?.searchParams.get('departmentId')).toBe('11')
    expect(searchUrl?.searchParams.get('q')).toBe('Van Gogh')
    expect(searchUrl?.searchParams.get('artistOrCulture')).toBe('true')
    expect(searchUrl?.searchParams.get('hasImages')).toBe('true')
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

  it('opens the mobile navigation and submits a search to its route', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const navigationToggle = screen.getByRole('button', { name: 'Close navigation' })
    expect(navigationToggle.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search artworks' }), {
      target: { value: 'blue flowers' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit artwork search' }))

    expect(screen.getByRole('heading', { name: 'Search page' })).toBeTruthy()
  })
})