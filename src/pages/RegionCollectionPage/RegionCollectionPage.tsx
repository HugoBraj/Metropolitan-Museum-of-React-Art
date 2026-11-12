import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Results } from '../../components/Results/Results'
import { findArtworkRegion } from '../../constants/artworkRegions'
import styles from './RegionCollectionPage.module.css'

export function RegionCollectionPage() {
  const { region: regionSlug } = useParams()
  const region = findArtworkRegion(regionSlug)

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
      <Breadcrumbs current={region.label} items={[{ label: 'By continent', to: '/continents' }]} />
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore by continent</p>
        <h1 className={styles.pageTitle}>{region.label}</h1>
      </header>
      <Results
        breadcrumbItems={[
          { label: 'By continent', to: '/continents' },
          { label: region.label, to: `/continents?region=${region.slug}` },
        ]}
        criteria={{}}
        regionSlug={region.slug}
      />
    </main>
  )
}