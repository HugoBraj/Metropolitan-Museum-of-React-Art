import { Outlet } from 'react-router-dom'
import { NavigationBar } from '../NavigationBar/NavigationBar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.appLayout}>
      <NavigationBar />
      <Outlet />
    </div>
  )
}