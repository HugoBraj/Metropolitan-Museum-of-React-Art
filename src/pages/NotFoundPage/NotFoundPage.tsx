import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.notFoundPage}>
      <h1 className={styles.pageTitle}>Page not found</h1>
      <Link className={styles.homeLink} to="/">
        Return to the collection
      </Link>
    </main>
  )
}