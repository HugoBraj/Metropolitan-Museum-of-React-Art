import { Link } from 'react-router-dom'
import styles from './CategoriesPage.module.css'

const COLLECTION_CATEGORIES = [
  {
    title: 'Ancient Egyptian jewelry',
    description: 'Small treasures from the ancient world.',
    image: 'https://images.metmuseum.org/CRDImages/gr/web-large/74514459.jpg',
    filters: { geoLocation: 'Egypt', medium: 'Jewelry', dateBegin: '-6000', dateEnd: '30', hasImages: 'true' },
  },
  {
    title: 'Van Gogh paintings',
    description: 'Paintings by Vincent van Gogh in the collection.',
    image: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-41223-001.jpg',
    filters: { departmentId: '11', q: 'Van Gogh', artistOrCulture: 'true', hasImages: 'true' },
  },
  {
    title: 'American quilts',
    description: 'Textiles made across the United States.',
    image: 'https://images.metmuseum.org/CRDImages/ad/web-large/34061.jpg',
    filters: { departmentId: '1', geoLocation: 'United States', medium: 'Quilts', hasImages: 'true' },
  },
  {
    title: 'Korean ceramics',
    description: 'Ceramic traditions from Korea.',
    image: 'https://images.metmuseum.org/CRDImages/as/web-large/DT3702.jpg',
    filters: { departmentId: '6', geoLocation: 'Korea', medium: 'Ceramics', hasImages: 'true' },
  },
  {
    title: 'Ancient Greek vases',
    description: 'Vessels from ancient Greece.',
    image: 'https://images.metmuseum.org/CRDImages/gr/web-large/LC-74_51_354.jpg',
    filters: { departmentId: '13', geoLocation: 'Greece', medium: 'Vases', hasImages: 'true' },
  },
  {
    title: 'Posters',
    description: 'Printed images from the Drawings and Prints collection.',
    image: 'https://images.metmuseum.org/CRDImages/dp/web-large/MM89604.jpg',
    filters: { departmentId: '9', medium: 'Posters', hasImages: 'true' },
  },
  {
    title: 'Arms and armor',
    description: 'Armor, weapons, and their associated objects.',
    image: 'https://images.metmuseum.org/CRDImages/aa/web-large/36.25.211.jpg',
    filters: { departmentId: '4', hasImages: 'true' },
  },
  {
    title: 'Photography',
    description: 'Photographic works from the collection.',
    image: 'https://images.metmuseum.org/CRDImages/ph/web-large/DP112650.jpg',
    filters: { departmentId: '19', hasImages: 'true' },
  },
] as const

export function CategoriesPage() {
  return (
    <main className={styles.categoriesPage}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore the collection</p>
        <h1 className={styles.pageTitle}>Discover by category</h1>
        <p className={styles.pageDescription}>
          Follow a subject, material, place, or artist through The Met collection.
        </p>
      </header>

      <nav aria-label="Collection categories" className={styles.categoryGrid}>
        {COLLECTION_CATEGORIES.map((category) => {
          const query = new URLSearchParams(category.filters)

          return (
            <Link
              aria-label={`Browse ${category.title}`}
              className={styles.categoryLink}
              key={category.title}
              style={{
                backgroundImage: `linear-gradient(180deg, var(--color-preview-overlay-light) 15%, var(--color-preview-overlay-strong) 100%), url("${category.image}")`,
              }}
              to={`/collection?${query.toString()}`}
            >
              <span className={styles.categoryCopy}>
                <span className={styles.categoryTitle}>{category.title}</span>
                <span className={styles.categoryDescription}>{category.description}</span>
              </span>
              <span aria-hidden="true" className={styles.categoryArrow}>→</span>
            </Link>
          )
        })}
      </nav>
    </main>
  )
}