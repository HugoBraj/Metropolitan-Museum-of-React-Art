import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { WorldMap } from '../components/WorldMap/WorldMap'

describe('WorldMap', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('lets visitors select a continent by click or keyboard', () => {
    const onSelectRegion = vi.fn()
    render(<WorldMap onSelectRegion={onSelectRegion} />)

    const africaPath = screen.getByRole('link', { name: 'Browse Africa artworks' })
    fireEvent.click(africaPath)
    fireEvent.keyDown(africaPath, { key: 'Enter' })

    expect(onSelectRegion).toHaveBeenNthCalledWith(1, 'africa')
    expect(onSelectRegion).toHaveBeenNthCalledWith(2, 'africa')
  })

  it('navigates from a continent to its artwork list', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(String(input))
      const body = url.pathname.endsWith('/search')
        ? { total: 1, objectIDs: [45734] }
        : { objectID: 45734, title: 'Quail and Millet', artistDisplayName: 'Kiyohara Yukinobu' }

      return {
        ok: true,
        status: 200,
        json: async () => body,
      } as Response
    })
    vi.stubGlobal('fetch', fetchMock)
    window.history.replaceState(null, '', '/continents')
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'Browse Africa artworks' }))

    expect(await screen.findByRole('heading', { name: 'Africa' })).toBeTruthy()
    await waitFor(() => expect(screen.getByRole('link', { name: /Quail and Millet/ })).toBeTruthy())
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})