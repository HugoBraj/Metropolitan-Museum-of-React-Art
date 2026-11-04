import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

const DISCOVERY_LINKS = [
  {
    id: 'categories',
    label: 'By categories',
    href: '/categories',
    image: '/bg_home_buttons/by-categories.jpg',
    description: 'Browse the collection by department and medium.',
  },
  {
    id: 'continents',
    label: 'By continents',
    href: '/continents',
    image: '/bg_home_buttons/by-continents.jpg',
    description: 'Explore artworks connected to six world regions.',
  },
  {
    id: 'chronology',
    label: 'By chronology',
    href: '/chronology',
    image: '/bg_home_buttons/by-chronology.jpg',
    description: 'Follow art across centuries and movements.',
  },
  {
    id: 'statistics',
    label: 'See statistics',
    href: '/statistics',
    image: '/bg_home_buttons/by-statistics.jpg',
    description: 'Explore patterns across the collection.',
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
              aria-describedby={`discovery-description-${discoveryLink.id}`}
              aria-label={discoveryLink.label}
              className={styles.discoveryLink}
              key={discoveryLink.label}
              style={{
                backgroundImage: `linear-gradient(180deg, var(--color-preview-overlay-light) 15%, var(--color-preview-overlay-strong) 100%), url("${discoveryLink.image}")`,
              }}
              to={discoveryLink.href}
            >
              <span className={styles.discoveryContent}>
                <span className={styles.discoveryLabel}>{discoveryLink.label}</span>
                <span className={styles.discoveryDescription} id={`discovery-description-${discoveryLink.id}`}>
                  {discoveryLink.description}
                </span>
              </span>
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