import { Link, useParams } from 'react-router-dom'
import { ArtworkCard } from '../../components/ArtworkCard/ArtworkCard'
import { findArtworkRegion } from '../../constants/artworkRegions'
import { useRegionArtworks } from '../../hooks/useRegionArtworks'
import styles from './RegionCollectionPage.module.css'

export function RegionCollectionPage() {
  const { region: regionSlug } = useParams()
  const region = findArtworkRegion(regionSlug)
  const artworksQuery = useRegionArtworks(regionSlug)

  if (!region) {
    return (
      <main className={styles.regionPage}>
        <h1 className={styles.pageTitle}>Continent not found</h1>
        <Link className={styles.backLink} to="/">Return to the world map</Link>
      </main>
    )
  }

  return (
    <main className={styles.regionPage}>
      <Link className={styles.backLink} to="/">Back to the world map</Link>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore by continent</p>
        <h1 className={styles.pageTitle}>{region.label}</h1>
      </header>

      {artworksQuery.isPending && <p aria-live="polite">Loading artworks...</p>}
      {artworksQuery.isError && (
        <section aria-live="polite" className={styles.message}>
          <p>Artworks could not be loaded.</p>
          <button className={styles.retryButton} onClick={() => void artworksQuery.refetch()} type="button">
            Try again
          </button>
        </section>
      )}
      {artworksQuery.isSuccess && artworksQuery.data.length === 0 && (
        <p>No artworks were found for this continent.</p>
      )}
      {artworksQuery.isSuccess && artworksQuery.data.length > 0 && (
        <section aria-label={`${region.label} artworks`} className={styles.artworkGrid}>
          {artworksQuery.data.map((artwork) => (
            <ArtworkCard artwork={artwork} key={artwork.objectID} />
          ))}
        </section>
      )}
    </main>
  )
}