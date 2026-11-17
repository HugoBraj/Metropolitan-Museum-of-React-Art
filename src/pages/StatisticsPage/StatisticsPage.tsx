import { CreationDateChart } from '../../components/CreationDateChart/CreationDateChart'
import { CREATION_DATE_STATISTICS } from '../../data/creationDateStatistics'
import styles from './StatisticsPage.module.css'

export function StatisticsPage() {
  return (
    <main className={styles.statisticsPage}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore the collection</p>
        <h1 className={styles.pageTitle}>Statistics</h1>
        <p className={styles.pageDescription}>
          Explore creation dates across the Met's open collection records.
        </p>
      </header>

      <CreationDateChart
        periods={CREATION_DATE_STATISTICS.periods}
        totalObjects={CREATION_DATE_STATISTICS.totalObjects}
        undatedObjects={CREATION_DATE_STATISTICS.undatedObjects}
      />
      <p className={styles.sampleNote}>
        Based on the Met's <a href={CREATION_DATE_STATISTICS.sourceUrl}>Open Access dataset</a> snapshot from {CREATION_DATE_STATISTICS.snapshotDate}.
        Each record is grouped by its earliest recorded creation year. Records with zero for both creation years are excluded.
        Dates may be approximate, and the dataset is not a complete record of the museum's collection.
      </p>
    </main>
  )
}