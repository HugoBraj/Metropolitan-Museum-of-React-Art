import { useSearchParams } from 'react-router-dom'
import { MAX_SEARCH_WINDOW } from '../../api/metMuseumClient'
import type { SearchObjectsParams } from '../../api/metMuseumClient'
import type { BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs'
import type { ArtworkRegionSlug } from '../../constants/artworkRegions'
import { findArtworkRegion } from '../../constants/artworkRegions'
import { COLLECTION_PAGE_SIZE, useCollectionArtworks } from '../../hooks/useCollectionArtworks'
import { ArtworkCard } from '../ArtworkCard/ArtworkCard'
import { Loader } from '../Loader/Loader'
import styles from './Results.module.css'

type SortOrder = 'date-asc' | 'date-desc'

interface ResultsProps {
  criteria: SearchObjectsParams
  regionSlug?: ArtworkRegionSlug
  breadcrumbItems?: BreadcrumbItem[]
}

function parseInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined
  }

  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) ? parsedValue : undefined
}

function getCreationYear(artwork: { objectBeginDate?: number | null; objectEndDate?: number | null }): number | undefined {
  return artwork.objectBeginDate ?? artwork.objectEndDate ?? undefined
}

export function Results({ criteria, regionSlug, breadcrumbItems }: ResultsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const region = findArtworkRegion(regionSlug)
  const perLocationPageSize = Math.ceil(COLLECTION_PAGE_SIZE / (region?.geoLocations.length ?? 1))
  const maximumPage = Math.ceil(MAX_SEARCH_WINDOW / perLocationPageSize) - 1
  const page = Math.min(Math.max(0, parseInteger(searchParams.get('page')) ?? 0), maximumPage)
  const sortOrder: SortOrder = searchParams.get('sort') === 'date-asc' ? 'date-asc' : 'date-desc'
  const artworksQuery = useCollectionArtworks(criteria, page, regionSlug)
  const artworks = artworksQuery.data?.artworks.slice().sort((firstArtwork, secondArtwork) => {
    const firstYear = getCreationYear(firstArtwork)
    const secondYear = getCreationYear(secondArtwork)

    if (firstYear === undefined || secondYear === undefined) {
      return firstYear === secondYear ? 0 : firstYear === undefined ? 1 : -1
    }

    return sortOrder === 'date-asc' ? firstYear - secondYear : secondYear - firstYear
  }) ?? []
  const matchCount = Math.min(artworksQuery.data?.total ?? 0, MAX_SEARCH_WINDOW)
  const maximumAvailableResults = region
    ? maximumPage * COLLECTION_PAGE_SIZE
      + Math.min(COLLECTION_PAGE_SIZE, (MAX_SEARCH_WINDOW - maximumPage * perLocationPageSize) * region.geoLocations.length)
    : MAX_SEARCH_WINDOW
  const pageCount = Math.ceil(Math.min(matchCount, maximumAvailableResults) / COLLECTION_PAGE_SIZE)
  const firstResult = artworks.length > 0 ? page * COLLECTION_PAGE_SIZE + 1 : 0
  const lastResult = firstResult + artworks.length - 1

  function changePage(nextPage: number) {
    const nextSearchParams = new URLSearchParams(searchParams)
    if (nextPage === 0) {
      nextSearchParams.delete('page')
    } else {
      nextSearchParams.set('page', String(nextPage))
    }
    setSearchParams(nextSearchParams)
  }

  function changeSortOrder(nextSortOrder: SortOrder) {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('sort', nextSortOrder)
    setSearchParams(nextSearchParams, { replace: true })
  }

  return (
    <section aria-label="Collection results" className={styles.resultsSection}>
      {artworksQuery.isPending && <Loader text="Loading artworks..." />}
      {artworksQuery.isError && (
        <div aria-live="polite" className={styles.statusMessage}>
          <p>Artworks could not be loaded.</p>
          <button className={styles.clearButton} onClick={() => void artworksQuery.refetch()} type="button">Try again</button>
        </div>
      )}
      {artworksQuery.isSuccess && (
        <>
          <div className={styles.resultsToolbar}>
            <p aria-live="polite" className={styles.resultCount}>
              {artworks.length === 0
                ? 'No objects found'
                : `Showing ${firstResult.toLocaleString()}–${lastResult.toLocaleString()} of ${artworksQuery.data.total.toLocaleString()} objects`}
            </p>
            <label className={styles.sortControl}>
              <span>Sort this page by creation date</span>
              <select onChange={(event) => changeSortOrder(event.target.value as SortOrder)} value={sortOrder}>
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
              </select>
            </label>
          </div>

          {artworksQuery.data.total > MAX_SEARCH_WINDOW && (
            <p className={styles.filterNotice}>Only the first 10,000 matches are available through the search API. Refine your filters to explore further.</p>
          )}

          {artworksQuery.data.failedGeoLocations && artworksQuery.data.failedGeoLocations.length > 0 && (
            <p className={styles.filterNotice} role="status">
              Some geographic searches were unavailable, so results may be incomplete: {artworksQuery.data.failedGeoLocations.join(', ')}.
            </p>
          )}

          {artworks.length > 0 && (
            <div className={styles.artworkGrid}>
              {artworks.map((artwork) => (
                <ArtworkCard artwork={artwork} breadcrumbItems={breadcrumbItems} key={artwork.objectID} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <nav aria-label="Collection result pages" className={styles.pagination}>
              <button className={styles.clearButton} disabled={page === 0} onClick={() => changePage(page - 1)} type="button">Previous</button>
              <span>Page {page + 1} of {pageCount}</span>
              <button className={styles.clearButton} disabled={page + 1 >= pageCount} onClick={() => changePage(page + 1)} type="button">Next</button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}