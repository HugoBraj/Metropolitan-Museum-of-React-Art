import { Link } from 'react-router-dom'
import continentMapPreview from '../../assets/continentsLow.svg'
import styles from './HomePage.module.css'

const DISCOVERY_LINKS = [
  {
    label: 'By categories',
    href: '/categories',
    image: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT2163.jpg',
  },
  {
    label: 'By continents',
    href: '/continents',
    image: continentMapPreview,
    isMap: true,
  },
  {
    label: 'By chronology',
    href: '/chronology',
    image: 'https://images.metmuseum.org/CRDImages/gr/web-large/DP-26340-001.jpg',
  },
  {
    label: 'See statistics',
    href: '/statistics',
    image: 'https://images.metmuseum.org/CRDImages/ad/web-large/DT1551.jpg',
  },
] as const

export function HomePage() {
  return (
    <main className={styles.homePage}>
      <section aria-labelledby="home-heading" className={styles.homeContent}>
        <div className={styles.heroCopy}>
          <h1 className={styles.pageTitle} id="home-heading">Explore the collection.</h1>
          <p className={styles.heroDescription}>
            Browse objects through categories, geography, or time.
          </p>
          <Link className={styles.primaryAction} to="/collection">Start exploring</Link>
        </div>

        <nav aria-label="Explore the collection" className={styles.discoveryGrid}>
          {DISCOVERY_LINKS.map((discoveryLink) => (
            <Link
              aria-label={discoveryLink.label}
              className={styles.discoveryLink}
              key={discoveryLink.label}
              style={{
                backgroundImage: `linear-gradient(180deg, var(--color-preview-overlay-light) 15%, var(--color-preview-overlay-strong) 100%), url("${discoveryLink.image}")`,
                backgroundSize: 'isMap' in discoveryLink ? 'cover, contain' : 'cover, cover',
              }}
              to={discoveryLink.href}
            >
              <span className={styles.discoveryLabel}>{discoveryLink.label}</span>
              <span aria-hidden="true" className={styles.discoveryArrow}>→</span>
            </Link>
          ))}
        </nav>
      </section>
      <footer className={styles.pageFooter}>
        <span>Collection data from The Metropolitan Museum of Art.</span>
      </footer>
    </main>
  )
}