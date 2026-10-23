import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <main className={styles.homePage}>
      <h1 className={styles.pageTitle}>Metropolitan Museum of Art</h1>
      <p>Explore the collection by region.</p>
    </main>
  )
}