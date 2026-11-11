import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { MetObject } from '../../api/metMuseumClient'
import { Loader } from '../Loader/Loader'
import styles from './NavigationBar.module.css'

interface NavigationBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  searchResults: {
    suggestions: MetObject[]
    isLoading: boolean
    isError: boolean
    isReady: boolean
  }
}

export function NavigationBar({ searchTerm, onSearchTermChange, searchResults }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchToggleRef = useRef<HTMLButtonElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node)) {
        return
      }

      if (searchPanelRef.current?.contains(event.target) || searchToggleRef.current?.contains(event.target)) {
        return
      }

      onSearchTermChange('')
      setIsSearchOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown)
  }, [isSearchOpen, onSearchTermChange])

  function closeSearch() {
    onSearchTermChange('')
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedSearchTerm = searchTerm.trim()

    if (trimmedSearchTerm.length === 0) {
      return
    }

    navigate(`/collection?${new URLSearchParams({ q: trimmedSearchTerm })}`)
    closeSearch()
  }

  function toggleSearch() {
    if (isSearchOpen) {
      closeSearch()
      return
    }

    setIsMenuOpen(false)
    setIsSearchOpen(true)
  }

  function toggleMenu() {
    if (isSearchOpen) {
      onSearchTermChange('')
      setIsSearchOpen(false)
    }
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={styles.navigationBar} onKeyDown={(event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }}>
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
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/departments">
              By departments
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.navigationLink} onClick={() => setIsMenuOpen(false)} to="/continents">
              By continents
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
          onClick={toggleSearch}
          ref={searchToggleRef}
          title={isSearchOpen ? 'Close search' : 'Open search'}
          type="button"
        >
          <Search aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
        <button
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          className={styles.menuButton}
          onClick={toggleMenu}
          ref={menuToggleRef}
          title={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          type="button"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={18} strokeWidth={1.8} />
          ) : (
            <Menu aria-hidden="true" size={18} strokeWidth={1.8} />
          )}
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
        <div className={styles.searchPanel} id="artwork-search" ref={searchPanelRef} onKeyDown={(event) => {
          if (event.key === 'Escape') {
            closeSearch()
            searchToggleRef.current?.focus()
          }
        }}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
            <input
              aria-label="Search artworks"
              autoComplete="off"
              autoFocus
              className={styles.searchInput}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search artworks"
              ref={searchInputRef}
              role="searchbox"
              type="text"
              value={searchTerm}
            />
            {searchTerm && (
              <button
                aria-label="Clear search"
                className={styles.searchButton}
                onClick={() => {
                  onSearchTermChange('')
                  searchInputRef.current?.focus()
                }}
                title="Clear search"
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            )}
            <button aria-label="Submit artwork search" className={styles.searchButton} title="Search artworks" type="submit">
              <Search aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </form>

          {searchTerm.trim().length >= 2 && (
            <section aria-label="Artwork suggestions" className={styles.suggestions}>
              {searchResults.isLoading && <Loader size="compact" text="Loading suggestions..." />}
              {searchResults.isError && <p className={styles.suggestionStatus} role="status">Some suggestions could not be loaded.</p>}
              {searchResults.isReady && !searchResults.isError && searchResults.suggestions.length === 0 && (
                <p className={styles.suggestionStatus} role="status">No artworks found.</p>
              )}
              {searchResults.suggestions.length > 0 && (
                <ul className={styles.suggestionList}>
                  {searchResults.suggestions.map((artwork) => (
                    <li key={artwork.objectID}>
                      <Link className={styles.suggestionLink} onClick={closeSearch} to={`/objects/${artwork.objectID}`}>
                        <span className={styles.suggestionTitle}>{artwork.title?.trim() || 'Untitled artwork'}</span>
                        <span className={styles.suggestionArtist}>{artwork.artistDisplayName?.trim() || 'Artist unknown'}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}
    </header>
  )
}