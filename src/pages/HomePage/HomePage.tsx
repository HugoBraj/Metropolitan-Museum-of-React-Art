import { useNavigate } from 'react-router-dom'
import { WorldMap } from '../../components/WorldMap/WorldMap'
import type { ArtworkRegionSlug } from '../../constants/artworkRegions'
import styles from './HomePage.module.css'

export function HomePage() {
  const navigate = useNavigate()

  function handleSelectRegion(region: ArtworkRegionSlug) {
    navigate(`/collection/${region}`)
  }

  return (
    <main className={styles.homePage}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore the collection</p>
        <h1 className={styles.pageTitle}>Art from around the world</h1>
        <p>Select a continent to browse artworks connected to that region.</p>
      </header>
      <section aria-labelledby="continent-map-heading" className={styles.mapSection}>
        <h2 className={styles.mapHeading} id="continent-map-heading">Continents</h2>
        <WorldMap onSelectRegion={handleSelectRegion} />
      </section>
    </main>
  )
}