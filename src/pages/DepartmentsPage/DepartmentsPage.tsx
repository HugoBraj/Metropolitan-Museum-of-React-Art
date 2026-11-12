import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Loader } from '../../components/Loader/Loader'
import { Results } from '../../components/Results/Results'
import { useDepartments } from '../../hooks/useDepartments'
import styles from './DepartmentsPage.module.css'

const DEPARTMENT_IMAGES: Record<number, string> = {
  1: 'https://images.metmuseum.org/CRDImages/ad/web-large/144703.jpg',
  4: 'https://images.metmuseum.org/CRDImages/aa/web-large/36.25.211.jpg',
  5: 'https://images.metmuseum.org/CRDImages/ao/web-large/CI40.65.12_d1.jpg',
  6: 'https://images.metmuseum.org/CRDImages/as/web-large/DT3702.jpg',
  7: 'https://images.metmuseum.org/CRDImages/md/web-large/DP362226.jpg',
  9: 'https://images.metmuseum.org/CRDImages/dp/web-large/MM89604.jpg',
  10: 'https://images.metmuseum.org/CRDImages/eg/web-large/DP-21418-002.jpg',
  11: 'https://images.metmuseum.org/CRDImages/ep/web-large/DP-41223-001.jpg',
  12: 'https://images.metmuseum.org/CRDImages/es/web-large/19016.jpg',
  13: 'https://images.metmuseum.org/CRDImages/gr/web-large/LC-74_51_354.jpg',
  14: 'https://images.metmuseum.org/CRDImages/is/web-large/wb-20.120.28.JPG',
  15: 'https://images.metmuseum.org/CRDImages/rl/web-large/DP-29455-001.jpg',
  16: 'https://images.metmuseum.org/CRDImages/li/web-large/DP-34852-005.jpg',
  17: 'https://images.metmuseum.org/CRDImages/md/web-large/DP362226.jpg',
  18: 'https://images.metmuseum.org/CRDImages/mi/web-large/DT8322.jpg',
  19: 'https://images.metmuseum.org/CRDImages/ph/web-large/DP112650.jpg',
}

const DEFAULT_DEPARTMENT_IMAGE = '/bg_home_buttons/by-departments.png'

export function DepartmentsPage() {
  const departmentsQuery = useDepartments()
  const [searchParams] = useSearchParams()
  const selectedDepartmentId = Number(searchParams.get('departmentId'))
  const selectedDepartment = Number.isInteger(selectedDepartmentId)
    ? departmentsQuery.data?.find((department) => department.departmentId === selectedDepartmentId)
    : undefined
  const hasDepartmentSelection = searchParams.has('departmentId')

  return (
    <main className={styles.departmentsPage}>
      {selectedDepartment && (
        <Breadcrumbs current={selectedDepartment.displayName} items={[{ label: 'By department', to: '/departments' }]} />
      )}
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Explore the collection</p>
        <h1 className={styles.pageTitle}>{selectedDepartment?.displayName ?? 'By department'}</h1>
        <p className={styles.pageDescription}>
          {selectedDepartment
            ? `Browse objects from the ${selectedDepartment.displayName} department.`
            : 'Explore works through the museum departments that care for them.'}
        </p>
      </header>

      {departmentsQuery.isPending && <Loader text="Loading departments..." />}
      {departmentsQuery.isError && (
        <p aria-live="polite" className={styles.statusMessage}>
          Departments could not be loaded. Please try again later.
        </p>
      )}
      {departmentsQuery.isSuccess && hasDepartmentSelection && !selectedDepartment && (
        <p className={styles.statusMessage}>Department not found.</p>
      )}
      {departmentsQuery.isSuccess && selectedDepartment && (
        <Results
          breadcrumbItems={[
            { label: 'By department', to: '/departments' },
            { label: selectedDepartment.displayName, to: `/departments?departmentId=${selectedDepartment.departmentId}` },
          ]}
          criteria={{ departmentId: selectedDepartment.departmentId }}
        />
      )}
      {departmentsQuery.isSuccess && !hasDepartmentSelection && departmentsQuery.data.length === 0 && (
        <p className={styles.statusMessage}>No departments are available.</p>
      )}
      {departmentsQuery.isSuccess && !hasDepartmentSelection && departmentsQuery.data.length > 0 && (
        <nav aria-label="Museum departments" className={styles.departmentGrid}>
          {departmentsQuery.data.map((department) => (
            <Link
              aria-label={`Browse ${department.displayName}`}
              className={styles.departmentLink}
              key={department.departmentId}
              style={{
                backgroundImage: `linear-gradient(180deg, var(--color-preview-overlay-light) 15%, var(--color-preview-overlay-strong) 100%), url("${DEPARTMENT_IMAGES[department.departmentId] ?? DEFAULT_DEPARTMENT_IMAGE}")`,
              }}
              to={`/departments?departmentId=${department.departmentId}`}
            >
              <span className={styles.departmentLabel}>{department.displayName}</span>
              <span aria-hidden="true" className={styles.departmentArrow}>→</span>
            </Link>
          ))}
        </nav>
      )}
    </main>
  )
}