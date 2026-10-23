import { cleanup, render, screen } from '@testing-library/react'
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

    expect(screen.getByRole('heading', { name: 'Metropolitan Museum of Art' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy()
  })

  it('renders the not-found page for an unknown route', () => {
    window.history.replaceState(null, '', '/unknown')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
  })
})