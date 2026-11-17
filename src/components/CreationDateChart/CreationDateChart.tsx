import styles from './CreationDateChart.module.css'

interface CreationDateChartProps {
  periods: readonly { label: string; count: number }[]
  totalObjects: number
  undatedObjects: number
}

export function CreationDateChart({ periods, totalObjects, undatedObjects }: CreationDateChartProps) {
  const datedCount = totalObjects - undatedObjects
  const maximumCount = Math.max(...periods.map((period) => period.count), 1)

  return (
    <section aria-labelledby="creation-date-title" className={styles.chart}>
      <header className={styles.chartHeader}>
        <div>
          <p className={styles.eyebrow}>The Met collection</p>
          <h2 className={styles.chartTitle} id="creation-date-title">Creation dates</h2>
          <p className={styles.chartDescription}>Objects grouped by their earliest recorded creation year.</p>
        </div>
        <p className={styles.sampleCount}><strong>{datedCount.toLocaleString('en-US')}</strong><span>dated objects</span></p>
      </header>

      {datedCount === 0 ? (
        <p className={styles.emptyMessage}>No creation dates are available.</p>
      ) : (
        <figure className={styles.figure}>
          <ol aria-label="Number of objects by creation period" className={styles.chartRows}>
            {periods.map((period) => (
              <li className={styles.chartRow} key={period.label}>
                <span className={styles.periodLabel}>{period.label}</span>
                <span aria-hidden="true" className={styles.barTrack}>
                  <span className={styles.barFill} style={{ width: `${period.count / maximumCount * 100}%` }} />
                </span>
                <span className={styles.periodCount} aria-label={`${period.count.toLocaleString('en-US')} objects`}>
                  {period.count.toLocaleString('en-US')}
                </span>
              </li>
            ))}
          </ol>
          <figcaption className={styles.chartCaption}>
            {undatedObjects.toLocaleString('en-US')} of {totalObjects.toLocaleString('en-US')} records have zero for both creation years and are excluded.
          </figcaption>
        </figure>
      )}
    </section>
  )
}