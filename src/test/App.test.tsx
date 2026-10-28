import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../App'

describe('application routes', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the home page and main navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Art from around the world' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy()
  })

  it('renders the not-found page for an unknown route', () => {
    window.history.replaceState(null, '', '/unknown')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
  })

  it('renders the collection and artwork routes', () => {
    window.history.replaceState(null, '', '/collection')
    const collectionView = render(<App />)

    expect(screen.getByRole('heading', { name: 'Collection page' })).toBeTruthy()
    collectionView.unmount()

    window.history.replaceState(null, '', '/objects/45734')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Artwork page' })).toBeTruthy()
  })

  it('opens the mobile navigation and submits a search to its route', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const navigationToggle = screen.getByRole('button', { name: 'Close navigation' })
    expect(navigationToggle.getAttribute('aria-expanded')).toBe('true')

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search artworks' }), {
      target: { value: 'blue flowers' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getByRole('heading', { name: 'Search page' })).toBeTruthy()
  })
})