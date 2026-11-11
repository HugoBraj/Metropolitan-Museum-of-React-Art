import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Loader } from '../components/Loader/Loader'

describe('Loader', () => {
  afterEach(() => {
    cleanup()
  })

  it('announces its message and hides the decorative spinner from assistive technology', () => {
    const { container } = render(<Loader text="Fetching objects" />)

    const loadingStatus = container.querySelector('[role="status"]')
    expect(loadingStatus?.textContent).toContain('Fetching objects')
    expect(loadingStatus?.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  it('supports a compact loading state', () => {
    const { container } = render(<Loader size="compact" text="Loading artwork count..." />)
    const loadingStatus = container.querySelector('[role="status"]')

    expect(loadingStatus?.textContent).toContain('Loading artwork count...')
    expect(loadingStatus?.className).toContain('compact')
  })
})