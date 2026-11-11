import styles from './Loader.module.css'

interface LoaderProps {
  text: string
  size?: 'default' | 'compact'
}

export function Loader({ text, size = 'default' }: LoaderProps) {
  const loaderClassName = size === 'compact'
    ? `${styles.loader} ${styles.compact}`
    : styles.loader

  return (
    <div aria-live="polite" className={loaderClassName} role="status">
      <span aria-hidden="true" className={styles.spinner} />
      <span className={styles.message}>{text}</span>
    </div>
  )
}