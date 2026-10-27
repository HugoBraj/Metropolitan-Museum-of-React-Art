import styles from './RoutePlaceholder.module.css'

interface RoutePlaceholderProps {
  pageName: string
}

export function RoutePlaceholder({ pageName }: RoutePlaceholderProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>{pageName} page</h1>
    </main>
  )
}