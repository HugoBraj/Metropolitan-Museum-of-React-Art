import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CREATION_DATE_STATISTICS } from '../data/creationDateStatistics'
import { StatisticsPage } from '../pages/StatisticsPage/StatisticsPage'

describe('StatisticsPage', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders the complete static dataset without API requests', () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    render(<StatisticsPage />)

    const chart = screen.getByRole('list', { name: 'Number of objects by creation period' })
    const rows = within(chart).getAllByRole('listitem')
    expect(rows.find((row) => row.textContent?.includes('1800–1899'))?.textContent).toContain('141,596')
    expect(screen.getByText('502,273')).toBeTruthy()
    expect(screen.getByText(/1,105 of 503,378 records/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open Access dataset' }).getAttribute('href'))
      .toBe(CREATION_DATE_STATISTICS.sourceUrl)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('accounts for every record in the snapshot', () => {
    const datedCount = CREATION_DATE_STATISTICS.periods.reduce((total, period) => total + period.count, 0)
    expect(datedCount).toBe(502273)
    expect(datedCount + CREATION_DATE_STATISTICS.undatedObjects).toBe(CREATION_DATE_STATISTICS.totalObjects)
  })
})