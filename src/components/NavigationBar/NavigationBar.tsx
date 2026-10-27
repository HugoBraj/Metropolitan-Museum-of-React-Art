import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoSmall from '../../assets/logo.svg'
import styles from './NavigationBar.module.css'

export function NavigationBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedSearchTerm = searchTerm.trim()

    if (trimmedSearchTerm.length === 0) {
      return
    }

    navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`)
    setSearchTerm('')
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.navigationBar}>
      <Link className={styles.brandLink} to="/" aria-label="The Met home">
        <img className={styles.logoImage} src={logoSmall} alt="" />
      </Link>

      <button
        aria-controls="main-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        type="button"
      >
        <span aria-hidden="true" className={styles.menuIcon}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {isMenuOpen && (
        <button
          aria-label="Dismiss navigation overlay"
          className={styles.navigationBackdrop}
          onClick={() => setIsMenuOpen(false)}
          type="button"
        />
      )}

      <nav
        aria-label="Main navigation"
        className={styles.navigationPanel}
        data-open={isMenuOpen}
        id="main-navigation"
      >
        <ul className={styles.navigationLinks}>
          <li>
            <NavLink className={styles.navigationLink} end onClick={() => setIsMenuOpen(false)} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/collection">
              Collection
            </NavLink>
          </li>
        </ul>

        <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
          <input
            aria-label="Search artworks"
            className={styles.searchInput}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search artworks"
            type="search"
            value={searchTerm}
          />
          <button className={styles.searchButton} type="submit">
            Search
          </button>
        </form>
      </nav>
    </header>
  )
}