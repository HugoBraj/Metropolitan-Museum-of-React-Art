import { useNavigate } from 'react-router-dom'
import { WorldMap } from '../../components/WorldMap/WorldMap'
import type { ArtworkRegionSlug } from '../../constants/artworkRegions'
import styles from './ContinentsPage.module.css'

export function ContinentsPage() {
  const navigate = useNavigate()

  function handleSelectRegion(region: ArtworkRegionSlug) {
    navigate(`/collection/${region}`)
  }

  return (
    <main className={styles.continentsPage}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore the collection</p>
        <h1 className={styles.pageTitle}>By continent</h1>
        <p>Select a continent to browse artworks connected to that region.</p>
      </header>
      <section aria-label="Interactive map of the continents" className={styles.mapRegion}>
        <WorldMap onSelectRegion={handleSelectRegion} />
      </section>
    </main>
  )
}