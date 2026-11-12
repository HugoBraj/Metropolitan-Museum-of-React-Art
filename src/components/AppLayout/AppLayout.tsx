import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useArtworkSuggestions } from '../../hooks/useArtworkSuggestions'
import { NavigationBar } from '../NavigationBar/NavigationBar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const [searchTerm, setSearchTerm] = useState('')
  const searchResults = useArtworkSuggestions(searchTerm)

  return (
    <div className={styles.appLayout}>
      <NavigationBar onSearchTermChange={setSearchTerm} searchResults={searchResults} searchTerm={searchTerm} />
      <div className={styles.pageScroll}>
        <Outlet />
      </div>
    </div>
  )
}