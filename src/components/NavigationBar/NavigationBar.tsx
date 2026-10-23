import { Link } from 'react-router-dom'
import logoSmall from '../../assets/logo.svg'
import styles from './NavigationBar.module.css'

export function NavigationBar() {
  return (
    <header className={styles.navigationBar}>
      <Link className={styles.brandLink} to="/" aria-label="The Met home">
        <img className={styles.logoImage} src={logoSmall} alt="" />
      </Link>
      <nav aria-label="Main navigation">
        <Link className={styles.collectionLink} to="/" aria-current="page">
          Explore collection
        </Link>
      </nav>
    </header>
  )
}