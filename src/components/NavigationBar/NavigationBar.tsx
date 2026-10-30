import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './NavigationBar.module.css'

export function NavigationBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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
    setIsSearchOpen(false)
  }

  return (
    <header className={styles.navigationBar}>
      <Link className={styles.brandLink} to="/" aria-label="The Met home">
        <span aria-hidden="true" className={styles.brandMark}>M</span>
        <span className={styles.brandName}>The Metropolitan Museum of Art Collection</span>
      </Link>

      <nav
        aria-label="Main navigation"
        className={styles.navigationPanel}
        data-open={isMenuOpen}
        id="main-navigation"
      >
        <ul className={styles.navigationLinks}>
          <li>
            <NavLink className={styles.navigationLink} end onClick={() => setIsMenuOpen(false)} to="/collection">
              All objects
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/categories">
              By categories
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/continents">
              By continents
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/chronology">
              By chronology
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/statistics">
              Statistics
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={styles.navigationActions}>
        <button
          aria-controls="artwork-search"
          aria-expanded={isSearchOpen}
          aria-label={isSearchOpen ? 'Close search' : 'Open search'}
          className={styles.searchToggle}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          type="button"
        >
          <span aria-hidden="true" className={styles.searchIcon} />
        </button>
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
      </div>

      {isMenuOpen && (
        <button
          aria-label="Dismiss navigation overlay"
          className={styles.navigationBackdrop}
          onClick={() => setIsMenuOpen(false)}
          type="button"
        />
      )}

      {isSearchOpen && (
        <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
          <input
            aria-label="Search artworks"
            autoFocus
            className={styles.searchInput}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search artworks"
            type="search"
            value={searchTerm}
          />
          <button aria-label="Submit artwork search" className={styles.searchButton} type="submit">
            <span aria-hidden="true" className={styles.searchIcon} />
          </button>
        </form>
      )}
    </header>
  )
}