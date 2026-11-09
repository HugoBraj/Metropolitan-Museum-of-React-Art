import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useArtwork } from '../../hooks/useArtwork'
import styles from './ArtworkPage.module.css'

function readText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export function ArtworkPage() {
  const { objectId } = useParams()
  const parsedObjectId = Number(objectId)
  const artworkQuery = useArtwork(Number.isInteger(parsedObjectId) ? parsedObjectId : undefined)
  const [imageFailed, setImageFailed] = useState(false)

  if (artworkQuery.isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>Loading artwork...</div>
      </main>
    )
  }

  if (artworkQuery.isError) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>Unable to load this artwork.</div>
      </main>
    )
  }

  const artwork = artworkQuery.data

  if (!artwork) {
    return (
      <main className={styles.page}>
        <div className={styles.emptyState}>Artwork not found.</div>
      </main>
    )
  }

  const imageUrl = artwork.primaryImage || artwork.primaryImageSmall
  const title = readText(artwork.title) || 'Untitled artwork'
  const artist = readText(artwork.artistDisplayName) || 'Artist unknown'
  const date = readText(artwork.objectDate)
  const department = readText(artwork.department)
  const country = readText(artwork.country)
  const region = readText(artwork.region)
  const medium = readText(artwork.medium)
  const culture = readText(artwork.culture)
  const period = readText(artwork.period)
  const origin = country || region
  const objectName = readText(artwork.objectName)
  const dimensions = readText(artwork.dimensions)
  const description = artwork.objectURL
    ? `Explore the museum record for ${title}.`
    : 'No description provided by the Metropolitan Museum of Art.'

  return (
    <main className={styles.page}>
      <article className={styles.artworkLayout}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.artistLine}>{artist}</p>
        </header>

        <div className={styles.content}>
          <section className={styles.copyColumn} id="artwork-details">
            <div className={styles.metaRow}>
              {date ? <span>{date}</span> : null}
              {origin ? <span>{origin}</span> : null}
              {department ? <span>{department}</span> : null}
            </div>

            <div className={styles.dimensions}>
              {dimensions ?? 'Dimensions unavailable'}
              {artwork.objectURL ? (
                <>
                  {' '}
                  <a
                    className={styles.realSizeLink}
                    href={artwork.objectURL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Visualize real size
                  </a>
                </>
              ) : null}
            </div>

            <p className={styles.description}>
              {medium ? `${medium}. ` : ''}
              {description}
            </p>

            <div className={styles.infoGrid}>
              {culture ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Culture</span>
                  <span className={styles.infoValue}>{culture}</span>
                </div>
              ) : null}

              {period ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Period</span>
                  <span className={styles.infoValue}>{period}</span>
                </div>
              ) : null}

              {origin ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Origin</span>
                  <span className={styles.infoValue}>{origin}</span>
                </div>
              ) : null}

              {objectName ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Object</span>
                  <span className={styles.infoValue}>{objectName}</span>
                </div>
              ) : null}
            </div>
          </section>

          <aside className={styles.imagePanel} aria-label={`Image of ${title}`}>
            {imageUrl && !imageFailed ? (
              <img
                alt={title}
                className={styles.image}
                onError={() => setImageFailed(true)}
                src={imageUrl}
              />
            ) : (
              <span aria-label={`No image available for ${title}`} className={styles.imageFallback} role="img">
                Image unavailable
              </span>
            )}
          </aside>
        </div>
      </article>
    </main>
  )
}