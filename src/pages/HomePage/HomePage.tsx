import { useState } from 'react'
import { Link } from 'react-router-dom'
import continentMapPreview from '../../assets/continentsLow.svg'
import styles from './HomePage.module.css'

const FEATURED_ARTWORK_IMAGE = 'https://images.metmuseum.org/CRDImages/gr/web-large/DP-26340-001.jpg'
const FEATURED_ARTWORK_URL = 'https://www.metmuseum.org/art/collection/search/249049'

export function HomePage() {
  const [featuredImageFailed, setFeaturedImageFailed] = useState(false)

  return (
    <>
      <main className={styles.homePage}>
        <section aria-labelledby="home-heading" className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The Metropolitan Museum of Art</p>
            <h1 className={styles.pageTitle} id="home-heading">Explore the collections of The Met.</h1>
            <p className={styles.heroDescription}>
              Browse works by category, follow the geography of art across the world, or move through time from ancient civilizations to modern design.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryAction} to="/collection">Start exploring</Link>
              <span className={styles.actionSeparator}>or</span>
              <Link className={styles.secondaryAction} to="/statistics">See statistics</Link>
            </div>
          </div>

          <article className={styles.featuredCard}>
            <a
              aria-label="View Marble bust of a youth on The Met website"
              className={styles.featuredImageLink}
              href={FEATURED_ARTWORK_URL}
              rel="noreferrer"
              target="_blank"
            >
              {featuredImageFailed ? (
                <span className={styles.featuredImageFallback}>Marble bust of a youth</span>
              ) : (
                <img
                  alt="Marble bust of a youth in the Greek and Roman Art collection"
                  className={styles.featuredImage}
                  onError={() => setFeaturedImageFailed(true)}
                  src={FEATURED_ARTWORK_IMAGE}
                />
              )}
            </a>
            <div className={styles.featuredCaption}>
              <h2>Featured collection</h2>
              <p>Marble bust of a youth, Roman, 1st or 2nd century CE.</p>
              <a className={styles.artworkCredit} href={FEATURED_ARTWORK_URL} rel="noreferrer" target="_blank">
                Greek and Roman Art · The Met Open Access
              </a>
            </div>
          </article>
        </section>

        <section aria-labelledby="discovery-heading" className={styles.discoverySection}>
          <p className={styles.eyebrow}>Explore the collection</p>
          <h2 className={styles.discoveryHeading} id="discovery-heading">
            Three ways to discover the art of the world.
          </h2>

          <div className={styles.discoveryGrid}>
            <article className={styles.discoveryCard}>
              <header className={styles.cardHeader}>
                <h3>By categories</h3>
                <span aria-hidden="true" className={styles.cardIcon}>▦</span>
              </header>
              <p className={styles.cardDescription}>
                Browse by medium, period, or department to find paintings, sculpture, prints, and decorative arts.
              </p>
              <ul className={styles.categoryList}>
                <li><Link to="/categories?category=European%20Paintings">European Paintings</Link></li>
                <li><Link to="/categories?category=Arts%20of%20Africa">Arts of Africa</Link></li>
                <li><Link to="/categories?category=Arms%20and%20Armor">Arms and Armor</Link></li>
              </ul>
              <Link className={styles.cardAction} to="/categories">View all categories <span aria-hidden="true">→</span></Link>
            </article>

            <article className={styles.discoveryCard}>
              <header className={styles.cardHeader}>
                <h3>By world location</h3>
                <span aria-hidden="true" className={styles.cardIcon}>◎</span>
              </header>
              <Link aria-label="Open the interactive map of six continents" className={styles.mapPreview} to="/continents">
                <img alt="" className={styles.mapPreviewImage} src={continentMapPreview} />
                <span className={styles.mapPreviewLabel}>Explore six continents</span>
              </Link>
              <p className={styles.cardDescription}>
                Trace the origins of art across continents and follow the movement of objects from their place of creation.
              </p>
              <ul className={styles.locationList}>
                <li><Link to="/collection/europe">Europe</Link></li>
                <li><Link to="/collection/asia">Asia</Link></li>
                <li><Link to="/collection/africa">Africa</Link></li>
              </ul>
              <Link className={styles.cardAction} to="/continents">Open map <span aria-hidden="true">→</span></Link>
            </article>

            <article className={styles.discoveryCard}>
              <header className={styles.cardHeader}>
                <h3>By chronology</h3>
                <span aria-hidden="true" className={styles.cardIcon}>◷</span>
              </header>
              <ol className={styles.timelineList}>
                <li>
                  <span className={styles.timelineIndex}>1</span>
                  <span><strong>Ancient Civilizations</strong><small>3000 BCE–500 CE</small></span>
                </li>
                <li>
                  <span className={styles.timelineIndex}>2</span>
                  <span><strong>Medieval to Renaissance</strong><small>500–1800</small></span>
                </li>
                <li>
                  <span className={styles.timelineIndex}>3</span>
                  <span><strong>Modern and Contemporary</strong><small>1800–present</small></span>
                </li>
              </ol>
              <Link className={styles.cardAction} to="/chronology">View timeline <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </section>
      </main>

      <footer className={styles.pageFooter}>
        <span>Collection data from The Metropolitan Museum of Art.</span>
        <Link to="/statistics">Statistics</Link>
      </footer>
    </>
  )
}