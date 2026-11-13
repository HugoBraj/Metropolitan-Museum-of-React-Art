import { useState } from 'react'
import type { FormEvent } from 'react'
import { FilterX } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Results } from '../../components/Results/Results'
import type { SearchObjectsParams } from '../../api/metMuseumClient'
import { findArtworkRegion } from '../../constants/artworkRegions'
import { useDepartments } from '../../hooks/useDepartments'
import styles from './CollectionPage.module.css'

type SortOrder = 'date-asc' | 'date-desc'

function parseInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined
  }

  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) ? parsedValue : undefined
}

function getSearchFilters(searchParams: URLSearchParams): SearchObjectsParams {
  const dateBegin = parseInteger(searchParams.get('dateBegin'))
  const dateEnd = parseInteger(searchParams.get('dateEnd'))
  const departmentId = parseInteger(searchParams.get('departmentId'))

  return {
    q: searchParams.get('q') || undefined,
    departmentId: departmentId && departmentId > 0 ? departmentId : undefined,
    medium: searchParams.get('medium') || undefined,
    geoLocation: searchParams.get('geoLocation') || undefined,
    dateBegin: dateBegin !== undefined && dateEnd !== undefined ? dateBegin : undefined,
    dateEnd: dateBegin !== undefined && dateEnd !== undefined ? dateEnd : undefined,
    artistOrCulture: searchParams.get('artistOrCulture') === 'true' || undefined,
    isHighlight: searchParams.get('isHighlight') !== 'false',
    isOnView: searchParams.get('isOnView') === 'true' || undefined,
    hasImages: searchParams.get('hasImages') === 'true' || undefined,
  }
}

export function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterError, setFilterError] = useState('')
  const departmentsQuery = useDepartments()
  const region = findArtworkRegion(searchParams.get('region') ?? undefined)
  const sortOrder: SortOrder = searchParams.get('sort') === 'date-asc' ? 'date-asc' : 'date-desc'
  const searchFilters = getSearchFilters(searchParams)
  if (region) {
    searchFilters.geoLocation = undefined
  }
  const collectionHref = searchParams.size > 0 ? `/collection?${searchParams.toString()}` : '/collection'

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const dateBegin = String(formData.get('dateBegin') ?? '').trim()
    const dateEnd = String(formData.get('dateEnd') ?? '').trim()

    if ((dateBegin === '') !== (dateEnd === '')) {
      setFilterError('Enter both years to filter by creation date.')
      return
    }

    if (dateBegin !== '' && dateEnd !== '') {
      const startYear = Number(dateBegin)
      const endYear = Number(dateEnd)
      if (!Number.isInteger(startYear) || !Number.isInteger(endYear) || startYear > endYear) {
        setFilterError('The start year must be a whole number no later than the end year.')
        return
      }
    }

    const nextSearchParams = new URLSearchParams()
    for (const name of ['q', 'medium', 'geoLocation']) {
      const value = String(formData.get(name) ?? '').trim()
      if (name === 'geoLocation' && region && value.toLocaleLowerCase() === region.label.toLocaleLowerCase()) {
        nextSearchParams.set('region', region.slug)
      } else if (value !== '') {
        nextSearchParams.set(name, value)
      }
    }

    const departmentId = String(formData.get('departmentId') ?? '')
    if (departmentId !== '') {
      nextSearchParams.set('departmentId', departmentId)
    }
    if (dateBegin !== '' && dateEnd !== '') {
      nextSearchParams.set('dateBegin', dateBegin)
      nextSearchParams.set('dateEnd', dateEnd)
    }

    for (const name of ['artistOrCulture', 'isOnView', 'hasImages']) {
      if (formData.get(name) === 'on') {
        nextSearchParams.set(name, 'true')
      }
    }
    nextSearchParams.set('isHighlight', String(formData.get('isHighlight') === 'on'))

    nextSearchParams.set('sort', sortOrder)
    setFilterError('')
    setSearchParams(nextSearchParams)
  }

  function clearFilters() {
    setFilterError('')
    setSearchParams(new URLSearchParams({ sort: 'date-desc', isHighlight: 'true' }))
  }

  return (
    <main className={styles.collectionPage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All objects</h1>
        <p className={styles.pageDescription}>
          {region
            ? `Search and filter artworks associated with ${region.label}.`
            : 'Search and filter artworks from across the collection.'}
        </p>
      </header>

      <form className={styles.searchPanel} key={searchParams.toString()} onSubmit={handleSearchSubmit}>
        <div className={styles.searchRow}>
          <label className={styles.visuallyHidden} htmlFor="collection-query">Search all objects</label>
          <input
            className={styles.queryInput}
            defaultValue={searchParams.get('q') ?? ''}
            id="collection-query"
            name="q"
            placeholder="Search titles, artists, cultures..."
            type="search"
          />
          <button className={styles.searchButton} type="submit">Search collection</button>
        </div>

        <div className={styles.filtersBar}>
          <details className={styles.filtersDisclosure}>
            <summary>Filters</summary>
            <div className={styles.filterGrid}>
            <label className={styles.filterField}>
              <span>Department</span>
              <select defaultValue={searchParams.get('departmentId') ?? ''} name="departmentId">
                <option value="">All departments</option>
                {departmentsQuery.data?.map((department) => (
                  <option key={department.departmentId} value={department.departmentId}>
                    {department.displayName}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.filterField}>
              <span>Medium or object type</span>
              <input defaultValue={searchParams.get('medium') ?? ''} name="medium" placeholder="e.g. Paintings" />
            </label>
            <label className={styles.filterField}>
              <span>Place of origin</span>
              <input defaultValue={region?.label ?? searchParams.get('geoLocation') ?? ''} name="geoLocation" placeholder="e.g. France" />
            </label>
            <label className={styles.filterField}>
              <span>Created from</span>
              <input defaultValue={searchParams.get('dateBegin') ?? ''} name="dateBegin" placeholder="Year (BCE as negative)" type="number" step="1" />
            </label>
            <label className={styles.filterField}>
              <span>Created to</span>
              <input defaultValue={searchParams.get('dateEnd') ?? ''} name="dateEnd" placeholder="Year (BCE as negative)" type="number" step="1" />
            </label>
            </div>

            <fieldset className={styles.checkboxFilters}>
              <legend>Object attributes</legend>
              <label><input defaultChecked={searchParams.get('artistOrCulture') === 'true'} name="artistOrCulture" type="checkbox" /> Search artist or culture</label>
              <label><input defaultChecked={searchParams.get('isHighlight') !== 'false'} name="isHighlight" type="checkbox" /> Highlights</label>
              <label><input defaultChecked={searchParams.get('isOnView') === 'true'} name="isOnView" type="checkbox" /> Currently on view</label>
              <label><input defaultChecked={searchParams.get('hasImages') === 'true'} name="hasImages" type="checkbox" /> Has an image</label>
            </fieldset>
          </details>
          <button
            className={`${styles.clearButton} ${styles.clearFiltersButton}`}
            onClick={clearFilters}
            type="button"
          >
            <FilterX aria-hidden="true" size={15} strokeWidth={1.8} />
            <span>Clear filters</span>
          </button>
        </div>

        {filterError && <p className={styles.filterError} role="alert">{filterError}</p>}
        {departmentsQuery.isError && (
          <p className={styles.filterNotice}>Department filters could not be loaded. Other filters are still available.</p>
        )}
      </form>

      <Results
        breadcrumbItems={[{ label: 'All objects', to: collectionHref }]}
        criteria={searchFilters}
        regionSlug={region?.slug}
      />
    </main>
  )
}