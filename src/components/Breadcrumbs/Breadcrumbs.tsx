import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  label: string
  to: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  current: string
}

export function Breadcrumbs({ items, current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb trail" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {items.map((item) => (
          <li className={styles.breadcrumbItem} key={`${item.to}-${item.label}`}>
            <Link to={item.to}>{item.label}</Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className={styles.currentItem}>{current}</li>
      </ol>
    </nav>
  )
}