import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Results } from '../../components/Results/Results'
import { findArtworkRegion } from '../../constants/artworkRegions'
import { WorldMap } from '../../components/WorldMap/WorldMap'
import type { ArtworkRegionSlug } from '../../constants/artworkRegions'
import { useRegionArtworkCounts } from '../../hooks/useRegionArtworkCounts'
import styles from './ContinentsPage.module.css'

export function ContinentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const region = findArtworkRegion(searchParams.get('region') ?? undefined)
  const { counts, isLoading: isRegionCountLoading, isError: isRegionCountError } = useRegionArtworkCounts()

  function handleSelectRegion(region: ArtworkRegionSlug) {
    setSearchParams(new URLSearchParams({ region }))
  }

  return (
    <main className={styles.continentsPage}>
      {region && (
        <Breadcrumbs current={region.label} items={[{ label: 'By continent', to: '/continents' }]} />
      )}
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore the collection</p>
        <h1 className={styles.pageTitle}>{region?.label ?? 'By continent'}</h1>
        {/* <p>{region ? `Browse artworks connected to ${region.label}.` : 'Select a continent to browse artworks connected to that region.'}</p> */}
      </header>
      {region ? (
        <Results
          breadcrumbItems={[
            { label: 'By continent', to: '/continents' },
            { label: region.label, to: `/continents?region=${region.slug}` },
          ]}
          criteria={{}}
          regionSlug={region.slug}
        />
      ) : (
        <section aria-label="Interactive map of the continents" className={styles.mapRegion}>
          <WorldMap
            isRegionCountError={isRegionCountError}
            isRegionCountLoading={isRegionCountLoading}
            onSelectRegion={handleSelectRegion}
            regionArtworkCounts={counts}
          />
        </section>
      )}
    </main>
  )
}