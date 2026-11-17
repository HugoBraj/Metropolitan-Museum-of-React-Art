import styles from './LoadingSkeleton.module.css'

interface ResultsSkeletonProps {
  count: number
  gridClassName: string
}

export function ResultsSkeleton({ count, gridClassName }: ResultsSkeletonProps) {
  return (
    <div aria-label="Loading artworks" role="status">
      <div aria-hidden="true" className={gridClassName}>
        {Array.from({ length: count }, (_, index) => (
          <div className={styles.artworkCard} key={index}>
            <div className={`${styles.shape} ${styles.artworkImage}`} />
            <div className={styles.artworkCaption}>
              <span className={`${styles.shape} ${styles.artworkTitle}`} />
              <span className={`${styles.shape} ${styles.artworkArtist}`} />
              <span className={`${styles.shape} ${styles.artworkDate}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SuggestionsSkeleton() {
  return (
    <div aria-label="Loading suggestions" role="status">
      <div aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div className={styles.suggestionItem} key={index}>
            <span className={`${styles.shape} ${styles.suggestionTitle}`} />
            <span className={`${styles.shape} ${styles.suggestionArtist}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

interface DepartmentsSkeletonProps {
  gridClassName: string
}

export function DepartmentsSkeleton({ gridClassName }: DepartmentsSkeletonProps) {
  return (
    <div aria-label="Loading departments" role="status">
      <div aria-hidden="true" className={gridClassName}>
        {Array.from({ length: 8 }, (_, index) => (
          <div className={`${styles.shape} ${styles.departmentTile}`} key={index} />
        ))}
      </div>
    </div>
  )
}

export function ArtworkSkeleton() {
  return (
    <div aria-label="Loading artwork" role="status">
      <div aria-hidden="true" className={styles.artworkDetail}>
        <span className={`${styles.shape} ${styles.breadcrumb}`} />
        <div className={styles.detailHeader}>
          <span className={`${styles.shape} ${styles.detailTitle}`} />
          <span className={`${styles.shape} ${styles.detailArtist}`} />
        </div>
        <div className={styles.detailContent}>
          <div className={styles.detailCopy}>
            <span className={`${styles.shape} ${styles.detailMetadata}`} />
            <span className={`${styles.shape} ${styles.detailDimensions}`} />
            <span className={`${styles.shape} ${styles.detailDescription}`} />
            <span className={`${styles.shape} ${styles.detailDescriptionShort}`} />
          </div>
          <div className={`${styles.shape} ${styles.detailImage}`} />
        </div>
      </div>
    </div>
  )
}

export function ArtworkCountSkeleton() {
  return (
    <span aria-label="Loading artwork count" role="status">
      <span aria-hidden="true" className={`${styles.shape} ${styles.artworkCount}`} />
    </span>
  )
}